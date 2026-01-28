setCurDir(getSrcDir());


dyna.Set("Output_Interval 100");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0 0 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Interface_Soften_Value 3e-3 3e-3");

igeo.genRectS(6, 0, 0, 7, 6, 0, 0.2, 1);
imeshing.genMeshByGmsh(2);

blkdyn.GetMesh(imeshing);
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 3e10, 0.25, 6e6, 5e6, 35, 15);
blkdyn.SetIModel("SSMC");
blkdyn.SetIMat(1e12, 1e12, 35, 6e6, 5e6);

blkdyn.FixV("xyz", 0, "y", -0.01, 0.01);
blkdyn.SetLocalDamp(0.01);


skwave.DefMesh(2, [10, 10], [100, 100]);
skwave.InheritSolid();
skwave.SetSolid(1, -1, 11, -1, 0.1, -1,1);

skwave.InitBySphere(1.01e5, 1.02, [0,0,0], [0,0, 0], 100.0);

skwave.InitBySphere(1e9, 100, [0,0,0], [3, 5, 0], 0.5);



dyna.Set("Time_Step 2e-6");
dyna.DynaCycle(0.1);

print("求解完成");