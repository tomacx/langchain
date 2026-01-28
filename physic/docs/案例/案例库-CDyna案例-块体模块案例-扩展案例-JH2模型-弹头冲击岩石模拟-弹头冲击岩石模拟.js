setCurDir(getSrcDir());

dyna.Clear();
doc.clearResult();


dyna.Set("Gravity 0 0 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 1e-4");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Output_Interval 200");
dyna.Set("Elem_Kill_Option 1 0.5 0.5 2 2");


var msh1=imesh.importGid( "impact.msh");
blkdyn.GetMesh(msh1);

blkdyn.CrtBoundIFaceByGroup(1);
blkdyn.CrtIFaceByCylinder(0,-1, 0, 0, 0.205, 0, 0, 0.3);
blkdyn.UpdateIFaceMesh();


blkdyn.SetModel("JH2");
blkdyn.SetMat(2500,8e10,0.3,20e6,20e6,45,10,2);
var JH2Mat = [8e10, 0.3, -1.5e11, 2.0e11, 5e9, 1e10, 1.01, 0.83, 0.68, 0.76, 0.005, 3.5e7, 0.01, 0.9, 1.0, 7.0 , 1.0];
blkdyn.SetJH2Mat(1, JH2Mat);
blkdyn.BindJH2Mat(1, 2, 2);



blkdyn.SetModel("linear", 1);
blkdyn.SetMat(7800,2.1e11,0.3,8e8,8e8,0,0,1);

blkdyn.SetIModel("brittleMC");
blkdyn.SetIStrengthByElem();
blkdyn.SetIStiffByElem(1.0);


//定义三个方向基础值
var values = new Array(0.0,-200, 0);
//定义变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
//将组号1到3范围内的节点速度初始化为设定值
blkdyn.InitConditionByGroup("velocity", values, gradient, 1, 1);

blkdyn.FixV("x", 0, "x", -0.001, 0.001);
blkdyn.FixV("z", 0, "z", -0.001, 0.001);

blkdyn.SetLocalDamp(0.01);

dyna.TimeStepCorrect(0.5);

dyna.Solve(10000);