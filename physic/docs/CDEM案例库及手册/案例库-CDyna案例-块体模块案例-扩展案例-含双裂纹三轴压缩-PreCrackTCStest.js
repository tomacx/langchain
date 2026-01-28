setCurDir(getSrcDir());

dyna.Set("Mechanic_Cal 1");

dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0 0.0 0");

dyna.Set("Large_Displace 0");

dyna.Set("Output_Interval 1000");

dyna.Set("GiD_Out 0");

dyna.Set("Msr_Out 0");

dyna.Set("Moniter_Iter 100");

dyna.Set("If_Virtural_Mass 1");

dyna.Set("Virtural_Step 0.5");

dyna.Set("Renew_Interval 100");

dyna.Set("Contact_Detect_Tol 0.00");

dyna.Set("If_Renew_Contact 0");

dyna.Set("SaveFile_Out 0");

blkdyn.ImportGrid("gmsh", "pre-crack-2.msh");

blkdyn.CrtIFace(1, 1);
blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");

blkdyn.SetMatByGroup(2700, 5e10, 0.25, 3e6, 3e6, 30.0, 10.0, 1);


blkdyn.SetIModel("linear");
blkdyn.SetIMat(5e13, 5e13, 30, 3e6, 3e6);


//裂缝1设置材料参数
var coord1 = new Array(0.025, 0.0625,  0);
var coord2 = new Array(0.05,  0.0875,  0);
blkdyn.SetIMatByLine(1e11, 1e11,10,0.0,0.0,coord1, coord2, 1e-6);

//裂缝2设置材料参数
var coord3 = new Array(0.05,  0.1125,  0);
var coord4 = new Array(0.075, 0.1375,  0);
blkdyn.SetIMatByLine(1e11, 1e11,10,0.0,0.0,coord3, coord4, 1e-6);



blkdyn.SetPreIFaceByFriction(1,0,11);

///模型底部及顶部法向速度约束为0
blkdyn.FixVByCoord("y", 0.0,-1e10, 1e10, -1e-4,1e-4, -1e10, 1e10);
blkdyn.FixVByCoord("y", 0.0, -1e10, 1e10, 0.1999, 0.21, -1e10, 1e10);


//设置施加的三个基础值
var values1 = new Array(2e6, 0, 0);
var values2 = new Array(-2e6, 0, 0);
//设置9个变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
//左侧面施加面力
blkdyn.ApplyConditionByCoord("face_force", values1, gradient, -0.0001, 0.0001, -100, 100, -100, 100, false );
//右侧面施加面力
blkdyn.ApplyConditionByCoord("face_force", values2, gradient, 0.0999, 0.1001, -100, 100, -100, 100, false );


//定义三个方向基础值
var values3 = new Array(-2e6, -2e6, -2e6);
//定义变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
//施加地应力
blkdyn.InitConditionByCoord("stress", values3, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

dyna.Monitor("block", "syy", 0.0, 0.2, 0.0);
dyna.Monitor("block", "syy", 0.05, 0.2, 0.0);
dyna.Monitor("block", "syy", 0.1, 0.2, 0.0);


dyna.Monitor("block", "syy", 0.0, 0.0, 0.0);
dyna.Monitor("block", "syy", 0.05, 0.0, 0.0);
dyna.Monitor("block", "syy", 0.1, 0.0, 0.0);


blkdyn.SetLocalDamp(0.1);

dyna.Solve();

//blkdyn.SetModel("MC");

blkdyn.SetIModel("FracE");

//指定材料的断裂能
blkdyn.SetIFracEnergyByCoord(5, 25, -10, 10, -10, 10, -10, 10);

dyna.Solve();

//顶部施加竖直向下的准静态速度载荷
//实际计算时，为了保证准静态，可适当调小加载时步，如调整至-1e-9
blkdyn.FixVByCoord("y", -5e-9, -1e10, 1e10, 0.1999, 0.21, -1e10, 1e10);

dyna.Solve(50000);

print("Solution Finished");