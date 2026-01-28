setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

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

//包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage 1");

//开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal 0");

blkdyn.GetMesh(imeshing);

blkdyn.SetModel("linear");
blkdyn.SetMat(2200,1e9,0.3,5e4,5e4,25,15);


//定义X、Y、Z三个方向的渗透系数
var arrayK = new Array(1e-10, 1e-10, 1e-10);

//指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByCoord (1000.0, 1e6, 0.0, 0.3, arrayK, 0.5, -500, 500, -500, 500, -500, 500);

blkdyn.FixV("x",0,"x",-0.001,0.001);
blkdyn.FixV("x",0,"x",39.99,41);
blkdyn.FixV("y",0,"y",-0.001,0.001);

dyna.Monitor("block","xdis",10,10,0);
dyna.Monitor("block","xdis",14.2,16.3,0);
dyna.Monitor("block","xdis",20,25,0);

dyna.Solve();

blkdyn.SetModel("MC");

dyna.Solve();

blkdyn.InitConditionByGroup("displace", [0,0,0], [0,0,0,0,0,0,0,0,0], 1,1);

dyna.Set("PoreSeepage_Cal 1");

dyna.Set("If_Biot_Cal 1");

dyna.Set("Time_Now 0");

dyna.TimeStepCorrect(0.9);

//给一个渗流场条件
poresp.InitConditionByCoord("pp", 1.96e5, [0,-9800,0], -100,100,-1,20.01,-1,1,false);
poresp.InitConditionByCoord("sat", 1.1, [0,0.0,0], -100,100,-1,20.01,-1,1,false);
poresp.ApplyConditionByCoord("pp", 1.96e5, [0,-9800,0], -100,100,-1,20.01,-1,1,true);

dyna.Solve();

//设置土体吸水弱化参数，饱和度等于1，即开始吸水
dyna.Set("If_Cal_AbsorbErosion 1 1 0.5 1e6 0.8 0.05");

dyna.Set("Time_Now 0");

//关闭渗流开关，仅考虑吸水引起的强度降低
dyna.Set("PoreSeepage_Cal 0");
dyna.Set("If_Biot_Cal 0");

dyna.DynaCycle(2.3e6);
