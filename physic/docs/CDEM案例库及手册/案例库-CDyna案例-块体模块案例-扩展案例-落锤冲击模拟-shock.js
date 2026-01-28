setCurDir(getSrcDir());

dyna.Set("Gravity 0 0 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 8e-4");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Output_Interval 200");
dyna.Set("Config_Crack_Show 1");


blkdyn.ImportGrid("gmsh","CDEM.msh");

blkdyn.CrtIFace(1);
blkdyn.CrtBoundIFaceByGroup(2);
blkdyn.UpdateIFaceMesh();


blkdyn.SetModel("linear");
blkdyn.SetMat(7800,2.1e11,0.3,8e8,8e8,0,0,2);
blkdyn.SetMat(2500,8e10,0.3,10e6,8e6,45,10,1);

blkdyn.SetIModel("brittleMC");
blkdyn.SetIStrengthByElem();
blkdyn.SetIStiffByElem(10.0);


//定义三个方向基础值
var values = new Array(0.0, 0, -50);
//定义变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
//将组号1到3范围内的节点速度初始化为设定值
blkdyn.InitConditionByGroup("velocity", values, gradient, 2, 2);

blkdyn.FixV("z", 0, "z", -0.001, 0.001);

blkdyn.SetLocalDamp(0.01);

dyna.TimeStepCorrect(0.8);

dyna.DynaCycle(0.005);