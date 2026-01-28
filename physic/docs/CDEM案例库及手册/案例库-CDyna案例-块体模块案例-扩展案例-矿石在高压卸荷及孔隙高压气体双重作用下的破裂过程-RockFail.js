setCurDir(getSrcDir());

var InitPP = 50e6;

dyna.Set("Mechanic_Cal 1");

dyna.Set("UnBalance_Ratio 1e-2");

dyna.Set("Gravity 0.0 0.0 0.0");

dyna.Set("Large_Displace 1");

dyna.Set("If_Renew_Contact 1");


dyna.Set("Output_Interval 100");

dyna.Set("Moniter_Iter 100");

dyna.Set("Contact_Detect_Tol 0.0");

dyna.Set("Renew_Interval 100");

dyna.Set("If_Virtural_Mass 0");

dyna.Set("Contact_Search_Method 2");

blkdyn.ImportGrid("ansys", "model.dat");

blkdyn.CrtIFace ();

blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear", 2);
blkdyn.SetModel("Air", 3);
blkdyn.SetMat(3200,  6.0e10,  0.25,  36e6, 12e6, 40, 10, 2);
blkdyn.SetMat(900,  1.0e9,  0.25,  36e6, 12e6, 40, 10, 3);

blkdyn.SetAirMat(1, 2.0, InitPP, 1.333 );
blkdyn.BindAirMat(1, 3, 3);

blkdyn.SetIModel("brittleMC");
//blkdyn.SetIModel("FracE", 2, 2);

blkdyn.SetIMat(1e15, 1e15, 40, 36e6, 12e6);
blkdyn.SetIMat(1e15, 1e15, 0, 1, 1, 2, 3);
blkdyn.SetIMat(1e15, 1e15, 0, 1, 1, 3, 3);

blkdyn.SetIFracEnergyByCoord(10, 1000, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

blkdyn.SetLocalDamp(0.0);

dyna.Set("If_Cal_Rayleigh 1");

blkdyn.SetRayleighDamp(1e-8, 0.0);



//定义三个方向基础值
var values = new Array(-InitPP,-InitPP, -InitPP);
//定义变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
//将控制范围内的位移清零
blkdyn.InitConditionByCoord("stress", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);


dyna.TimeStepCorrect(0.5);

dyna.Monitor("gvalue","gv_spring_crack_ratio");

dyna.Solve(10000);
dyna.Save("50mpa.sav");
blkdyn. ExportGradationCurveByGroup (2, 2);
