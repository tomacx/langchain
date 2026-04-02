setCurDir(getSrcDir());

dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0 0 -9.8");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 1e-4");
dyna.Set("Renew_Interval 100");
dyna.Set("Output_Interval 500");
dyna.Set("If_Find_Contact_OBT 1");
dyna.Set("Interface_Soften_Value 0.003 0.006");

//dyna.Set("Contact_Search_Method 2");
//dyna.Set("Min_Cell_Length 0.1");
//dyna.Set("If_Opti_Cell_Length 1");

dyna.Set("If_Virtural_Mass 0");
dyna.Set("Large_Displace 1");
dyna.Set("Config_Crack_Show 1");

var msh1 = imesh.importAnsys("3ceng.dat");
blkdyn.GetMesh(msh1);

blkdyn.CrtIFace(1);
blkdyn.CrtIFace(2);
blkdyn.CrtIFace(3);
blkdyn.CrtBoundIFaceByCoord(-1e5,1e5, -1e5,1e5, -1e5,1e5);
blkdyn.UpdateIFaceMesh();


blkdyn.SetModel("linear");
//玻璃1材料参数
blkdyn.SetMat(1200, 2.5e9, 0.25, 60e6, 40e6, 10, 5, 1);
//玻璃2材料参数
blkdyn.SetMat(2230, 67e9, 0.25, 150e6, 100e6, 30, 5, 2);
//玻璃3材料参数
blkdyn.SetMat(3970, 344e9, 0.29, 1000e6, 742e6, 30, 5, 3);
//弹的材料参数
blkdyn.SetMat(15600, 450e9, 0.3, 900e6, 600e6, 30, 5, 4);

blkdyn.SetIModel("brittleMC");
blkdyn.SetIModel("linear", 4);
blkdyn.SetIStrengthByElem();
blkdyn.SetIMat(1e11, 1e11, 35, 5e6, 2e6, 1,2);
blkdyn.SetIMat(1e11, 1e11, 35, 5e6, 2e6, 2,3);
blkdyn.SetIMat(1e11, 1e11, 0, 0, 0, 4);
blkdyn.SetIStiffByElem(10.0);

blkdyn.FixV("xyz", 0, "y", -0.0001, 0.0001);
blkdyn.FixV("xyz", 0, "y", 299e-3, 301e-3);
blkdyn.FixV("xyz", 0, "x", -0.0001, 0.0001);
blkdyn.FixV("xyz", 0, "x", 299e-3, 301e-3);

dyna.Monitor("block",  "magdis", 0.15, 0.15,  0.10825);
dyna.Monitor("block",  "magvel", 0.15, 0.15,  0.10825);
dyna.Monitor("block",  "magdis", 0.15, 0.15,  0.0);
dyna.Monitor("block",  "magvel", 0.15, 0.15,  0.0);
dyna.Monitor("gvalue",  "gv_spring_crack_ratio");

//初始化子弹速度900m/s
blkdyn.InitConditionByGroup("velocity", [0, 0, -900], [0,0,0,0,0,0,0,0,0], 4,4);

blkdyn.SetLocalDamp(0.0);


dyna.TimeStepCorrect(0.6);

dyna.DynaCycle(1e-3);
dyna.Save("Final.sav");
