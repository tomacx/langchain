setCurDir(getSrcDir());


dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0 0 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Interface_Soften_Value 3e-3 3e-3");
dyna.Set("Solid_Cal_Mode 2");

blkdyn.ImportGrid("ansys","Bulid.dat");
//blkdyn.CrtIFace();
//blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("MC");
blkdyn.SetMat(2500, 3e10, 0.25, 6e6, 5e6, 35, 15);
blkdyn.SetIModel("SSMC");
blkdyn.SetIMat(1e12, 1e12, 35, 6e6, 5e6);

blkdyn.FixV("xyz", 0, "z", -3, -0.299);
blkdyn.SetLocalDamp(0.01);

///// x  -0.2 18.09   y  -0.4  10.39   z:  -0.3  3.5   
skwave.DefMesh(3, [19, 11, 4.7 ], [160, 90, 35], [-0.4, -0.5, -0.6]);
skwave.InheritSolid();

skwave.InitBySphere(1.01e5, 1.02, [0,0,0], [0,0,0], 1000.0);

skwave.InitBySphere(1e9, 1000, [0,0,0], [8.95, 3.3, 2.0], 0.3);


dyna.Set("Time_Step 2e-6");
dyna.DynaCycle(0.1);

print("求解完成");