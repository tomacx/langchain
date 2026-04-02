setCurDir(getSrcDir());

// 清除模块数据
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

var acoord = new Array(6);
var size1 = 1.5;
var size2 = 4;

acoord[0] = [0,0,0, size2];
acoord[1] = [30,0,0, size2];
acoord[2] = [30,20,0, size2];
acoord[3] = [20,20,0, size1];
acoord[4] = [10,5,0, size1];
acoord[5] = [0,5,0, size2];

igeo.genPloygenS(acoord, 1);

imeshing.genMeshByGmsh(2);

dyna.Set("Output_Interval 1000");
dyna.Set("Gravity 0 -9.8 0");

// 开启孔隙渗流计算功能
dyna.Set("Config_PoreSeepage 1");
dyna.Set("PoreSeepage_Cal 0");

blkdyn.GetMesh(imeshing);
blkdyn.SetModel("linear");
blkdyn.SetMat(2200, 1e9, 0.3, 2e4, 2e4, 25, 15);

var arrayK = new Array(1e-10, 1e-10, 1e-10);
poresp.SetPropByCoord (1000.0, 1e6, 0.0, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

blkdyn.FixV("x", 0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0, "x", 29.99, 31);
blkdyn.FixV("y", 0, "y", -0.001, 0.001);

dyna.Monitor("block","xdis", 15, 10, 0);
dyna.Monitor("block","xdis", 20, 16, 0);
dyna.Monitor("block","xdis", 30, 20, 0);

dyna.Solve();

// 设置材料模型为软化模型
blkdyn.SetModel("SoftenMC");
dyna.Set("Block_Soften_Value 3e-3 9e-3");

dyna.Solve();

// 初始化条件
var values = new Array(0.0, 0.0, 0);
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
blkdyn.InitConditionByCoord("displace", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 开启孔隙渗流计算
dyna.Set("PoreSeepage_Cal 1");
dyna.Set("If_Biot_Cal 1");

dyna.TimeStepCorrect(1.0);
