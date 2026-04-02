setCurDir(getSrcDir());

// 清除模块数据
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 创建几何模型
var acoord = new Array(6);
acoord[0] = [0, 0, 0, 1];
acoord[1] = [40, 0, 0, 1];
acoord[2] = [40, 25, 0, 1];
acoord[3] = [20, 25, 0, 1];
acoord[4] = [10, 10, 0, 1];
acoord[5] = [0, 10, 0, 1];

igeo.genPloygenS(acoord, 1);

// 划分网格
imeshing.genMeshByGmsh(2);

// 设置计算参数
dyna.Set("Output_Interval 1000");
dyna.Set("Gravity 0 -9.8 0");

// 包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage 1");

// 开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal 0");

// 获取网格并设置材料参数
blkdyn.GetMesh(imeshing);
blkdyn.SetModel("linear");
blkdyn.SetMat(2200, 1e9, 0.3, 2e4, 2e4, 25, 15);

// 设置孔隙渗流参数
var arrayK = new Array(1e-10, 1e-10, 1e-10);
poresp.SetPropByCoord(1000.0, 1e6, 0.0, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

// 设置边界条件
blkdyn.FixV("x", 0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0, "x", 39.99, 41);
blkdyn.FixV("y", 0, "y", -0.001, 0.001);

// 设置监测点
dyna.Monitor("block", "xdis", 10, 10, 0);
dyna.Monitor("block", "xdis", 14.2, 16.3, 0);
dyna.Monitor("block", "xdis", 20, 25, 0);

// 进行计算
dyna.Solve();

// 设置软化参数并重新进行计算
dyna.Set("Block_Soften_Value 3e-3 9e-3");
blkdyn.SetModel("SoftenMC");

dyna.Solve();

// 初始化条件
blkdyn.InitConditionByGroup("displace", [0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], 1, 1);

// 设置孔隙渗流计算参数并重新进行计算
dyna.Set("PoreSeepage_Cal 1");
dyna.Set("If_Biot_Cal 1");

dyna.Set("Time_Now 0");
dyna.TimeStepCorrect(1.0);
