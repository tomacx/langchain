//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());


dyna.Set("Mechanic_Cal 1");

dyna.Set("UnBalance_Ratio 1e-3");

dyna.Set("Gravity 0 0 0");

dyna.Set("Large_Displace 1");

dyna.Set("If_Renew_Contact 1");

dyna.Set("Renew_Interval  100");

dyna.Set("Contact_Detect_Tol  1e-5");

dyna.Set("Output_Interval 2000");

dyna.Set("Moniter_Iter 100");

dyna.Set("If_Virtural_Mass 1");

dyna.Set("SaveFile_Out  0");

dyna.Set("Virtural_Step 0.5");




pdyna.Import("pdyna","Pdyna.dat");

pdyna.SetModel("linear");

//施加颗粒与颗粒接触的材料参，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 3e10, 0.25, 10e6, 20e6, 30, 0.8, 0.0);


//四周施加高围压
var Face_Force1 = [50e6, 0.0, 0.0];
pdyna.ApplyFaceForce(Face_Force1, -100, 1.5e-4, -100, 100, -100, 100);

var Face_Force2 = [-50e6, 0.0, 0.0];
pdyna.ApplyFaceForce(Face_Force2, 0.00985, 100, -100, 100, -100, 100);

var Face_Force3 = [0.0, 50e6, 0.0];
pdyna.ApplyFaceForce(Face_Force3, -100, 100, -100, 1.5e-4, -100, 100);

var Face_Force4 = [0.0, -50e6, 0.0];
pdyna.ApplyFaceForce(Face_Force4, -100, 100, 0.00985, 100, -100, 100);

dyna.Solve();
dyna.Save("Stage1.sav");


//反向加力，撤掉载荷
var Face_Force1 = [-50e6, 0.0, 0.0];
pdyna.ApplyFaceForce(Face_Force1, -100, 1.5e-4, -100, 100, -100, 100);

var Face_Force2 = [50e6, 0.0, 0.0];
pdyna.ApplyFaceForce(Face_Force2, 0.00985, 100, -100, 100, -100, 100);

var Face_Force3 = [0.0, -50e6, 0.0];
pdyna.ApplyFaceForce(Face_Force3, -100, 100, -100, 1.5e-4, -100, 100);

var Face_Force4 = [0.0, 50e6, 0.0];
pdyna.ApplyFaceForce(Face_Force4, -100, 100, 0.00985, 100, -100, 100);


//撤掉载荷后加上约束
pdyna.FixVByCoord("x", 0.0, -100, 1.5e-4, -100, 100, -100, 100);
pdyna.FixVByCoord("x", 0.0, 0.00985, 100, -100, 100, -100, 100);
pdyna.FixVByCoord("y", 0.0, -100, 100, -100, 1.5e-4, -100, 100);
pdyna.FixVByCoord("y", 0.0, -100, 100, 0.00985, 100, -100, 100);


dyna.Solve();
dyna.Save("Stage2.sav");


//局部卸载
pdyna.FreeVByCoord("x", -100, 1.5e-4, 3.5e-3, 6.5e-3, -100, 100);


//重新设置阻尼
pdyna.SetMat(2500, 3e10, 0.25, 1e6, 1e6, 30, 0.0, 0.1);


pdyna.SetModel("brittleMC");

dyna.Set("If_Virtural_Mass 0");

dyna.Set("Time_Now  0");

dyna.Set("Time_Step  1e-6");

dyna.TimeStepCorrect();

dyna.DynaCycle(1e-4);

print("Completed!");
