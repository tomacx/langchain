setCurDir(getSrcDir());

doc.clearResult();

dyna.Clear();

igeo.clear();

imeshing.clear();

dyna.Set("Gravity 0.0 0.0 0.0");

dyna.Set("Large_Displace 1");

dyna.Set("If_Renew_Contact 1");

dyna.Set("Contact_Detect_Tol 0.0");

dyna.Set("If_Virtural_Mass 0");

dyna.Set("Output_Interval 500");

var shortL = 0.2;
var longL  = 2.0;
var rockL    = 0.1;

var width = 0.03;

var shortNo = 40;

var longNo = 400;

var rockNo = 40;

imeshing.genBrick2D("f1", shortL, width,  shortNo, 1, 0, 0);

imeshing.genBrick2D("f2", longL, width, longNo, 1, shortL, 0);

imeshing.genBrick2D("f3", rockL, width, rockNo, 1,  shortL + longL, 0);

blkdyn.GetMesh(imeshing);

blkdyn. CrtIFace (  -1, -1  );

blkdyn. CrtIFace ( 3, 3 );

blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");

blkdyn.SetMat(7800, 2.1e11, 0.25, 235e6, 235e6 , 0, 0 , 1, 2);

blkdyn.SetMat(250, 3e10, 0.25, 3e6, 1e6 , 30, 15 , 3);

blkdyn.SetIModel("brittleMC");

blkdyn.SetIMat(1e14, 1e14, 0.0, 0.0 ,0.0);

blkdyn.SetIMat(1e14, 1e14, 30, 3e6, 1e6, 3, 3);

//blkdyn.SetIModel("FracE", 3, 3);
//blkdyn.SetIFracEnergyByGroupInterface(0.3, 1, 3, 3);

blkdyn.FixV("y",0,"y", -1,1);

dyna.Monitor("block","xvel", shortL * 0.5, 0, 0);
dyna.Monitor("block","xvel", shortL + longL * 0.5, 0, 0);
dyna.Monitor("block","xvel", shortL + longL +rockL * 0.5 , 0, 0);

dyna.Monitor("block","sxx", shortL * 0.5, 0, 0);
dyna.Monitor("block","sxx", shortL + longL * 0.5, 0, 0);
dyna.Monitor("block","sxx", shortL + longL +rockL * 0.5 , 0, 0);

//定义三个方向基础值
var values = new Array(2.0, 0.0, 0);
//定义变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
//将组号1到3范围内的节点速度初始化为设定值
blkdyn.InitConditionByGroup("velocity", values, gradient, 1, 1);

dyna.TimeStepCorrect(0.5);

blkdyn.SetLocalDamp(0.0);

dyna.Set("If_Cal_Rayleigh 1");

blkdyn.SetRayleighDamp(1.0e-7, 0.0);

dyna.DynaCycle(1.2e-3);
