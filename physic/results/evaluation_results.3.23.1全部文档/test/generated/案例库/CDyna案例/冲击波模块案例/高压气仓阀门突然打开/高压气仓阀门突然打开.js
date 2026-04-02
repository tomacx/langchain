setCurDir(getSrcDir());

dyna.Clear();
//doc.ClearResult();

dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Interface_Soften_Value 3e-3 3e-3");
dyna.Set("Solid_Cal_Mode 2");

blkdyn.ImportGrid("ansys","bricks.dat");
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 3e10, 0.25, 6e6, 5e6, 35, 15);
blkdyn.SetIModel("SSMC");
blkdyn.SetIMat(1e12, 1e12, 35, 6e6, 5e6);

blkdyn.FixV("xyz", 0.0, "y", -1e-2, 1e-2);
blkdyn.FixV("xyz", 0.0, "y", 2.01, 2.02);
blkdyn.FixV("xyz", 0.0, "x", -1e-2, 1e-2);
blkdyn.FixV("xyz", 0.0, "x", 2.27, 2.29);

blkdyn.SetLocalDamp(0.01);

skwave.DefMesh(3, [3, 3, 2 ], [50, 60, 50], [-0.2, -0.5, -1]);
skwave.InheritSolid();
skwave.SetSolid(1, -5,5 ,-5,0.2,-5, 5);

skwave.InitBySphere(1.01e5, 1.02, [0,0,0], [0,0,0], 1000.0);
skwave.InitBySphere(1e9, 1000, [0,0,0], [1.14, 1.0, 0.5], 0.3);

dyna.Set("Time_Step 2e-6");
blkdyn.ApplyLoad("pressure", "x", -1e-2, 1e-2, 1e7);
dyna.DynaCycle(0.1);

print("求解完毕");
