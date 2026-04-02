setCurDir(getSrcDir());

// 清除之前的计算数据
geo.Clear();
mesh.Clear();
dyna.Clear();
doc.ClearResult();

var acoord = new Array(6);

var size = 1.0;
acoord[0] = [0,0,0,  size];
acoord[1] = [40,0,0,  size];
acoord[2] = [40,25,0,  size];
acoord[3] = [20,25,0,  size];
acoord[4] = [10,10,0,  size];
acoord[5] = [0,10,0,  size];

igeo.genPloygenS(acoord,1);

imeshing.genMeshByGmsh(2);

dyna.Set("Output_Interval 1000");

dyna.Set("Gravity 0 -9.8 0");

// 包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage 1");

// 开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal 0");

blkdyn.GetMesh(imeshing);

blkdyn.SetModel("linear");
blkdyn.SetMat(2200,1e9,0.3,2e4,2e4,25,15);

// 定义X、Y、Z三个方向的渗透系数
var arrayK = new Array(1e-10, 1e-10, 1e-10);

// 指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByCoord (1000.0, 1e6, 0.0, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

blkdyn.FixV("x",0,"x",-0.001,0.001);
blkdyn.FixV("x",0,"x",39.99,41);
blkdyn.FixV("y",0,"y",-0.001,0.001);

dyna.Monitor("block","xdis",10,10,0);
dyna.Monitor("block","xdis",14.2,16.3,0);
dyna.Monitor("block","xdis",20,25,0);

dyna.Solve();

// 设置软化参数
dyna.Set("Block_Soften_Value 3e-3 9e-3");
blkdyn.SetModel("SoftenMC");

dyna.Solve();

// 初始化条件
blkdyn.InitConditionByGroup("displace", [0,0,0], [0,0,0,0,0,0,0,0,0], 1,1);

// 开启孔隙渗流计算
dyna.Set("PoreSeepage_Cal 1");

// 设置比奥系数计算开关
dyna.Set("If_Biot_Cal 1");

// 设置当前时间为0
dyna.Set("Time_Now 0");

// 时间步长校正
dyna.TimeStepCorrect(1.0);

// 设置峰值降雨强度 50mm/（12小时）
var peakRainIntensity = 50 / (12 * 3600); // 转换为m/s

// 模拟降雨过程
for (var t = 0; t <= 12*3600; t += dyna.GetTimeStep()) {
    var rainRate = peakRainIntensity * Math.sin(Math.PI * t / (12*3600));
    poresp.SetPropByCoord(1000.0, 1e6, rainRate, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);
    dyna.Solve();
}

// 结束模拟
dyna.Set("PoreSeepage_Cal 0");
