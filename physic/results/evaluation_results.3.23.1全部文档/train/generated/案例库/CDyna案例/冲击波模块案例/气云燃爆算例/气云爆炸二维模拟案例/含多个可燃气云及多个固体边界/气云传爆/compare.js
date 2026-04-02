setCurDir(getSrcDir());

dyna.Set("If_Virtural_Mass", 0);
dyna.Set("Large_Displace", 1);
dyna.Set("If_Renew_Contact", 1);
dyna.Set("Interface_Soften_Value", "1e-5 1e-5");

dyna.Set("Time_Step", 1e-5);
dyna.Set("Output_Interval", 100);
dyna.Set("SK_GasModel", 2);

imeshing.genBrick2D("1", 21, 1, 42, 2, -0.51, -0.01);
imeshing.genBrick2D("2", 1, 7, 8, 56, 7.91, 0.99);

blkdyn.GetMesh(imeshing);

blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 3e10, 0.25, 1e6, 1e6, 35, 15);

blkdyn.SetIModel("SSMC");
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();

blkdyn.SetLocalDamp(0.01);

blkdyn.FixV("xyz", 0, "y", -1, 1.01);

skwave.DefMesh(2, [20, 10], [200, 100]);
skwave.InheritSolid();

skwave.SetGasCloud(1, -1, 8, -1, 11, -1, 1);
skwave.InitBySphere(8.321e4, 1.21, [0, 0, 0], [0, 0, 0], 100.0);

skwave.SetFirePos(3, 5, 0, 0.5, 1.945, 4.162E2, 6.27E5);

dyna.Monitor("skwave", "sw_dens", 5, 5, 0);
dyna.Monitor("skwave", "sw_dens", 10, 5, 0);
dyna.Monitor("skwave", "sw_dens", 15, 5, 0);

dyna.Monitor("skwave", "sw_pp", 5, 5, 0);
dyna.Monitor("skwave", "sw_pp", 10, 5, 0);
dyna.Monitor("skwave", "sw_pp", 15, 5, 0);

dyna.Monitor("skwave", "sw_temp", 5, 5, 0);
dyna.Monitor("skwave", "sw_temp", 10, 5, 0);
dyna.Monitor("skwave", "sw_temp", 15, 5, 0);

dyna.Monitor("skwave", "sw_gastype", 5, 5, 0);
dyna.Monitor("skwave", "sw_gastype", 10, 5, 0);
dyna.Monitor("skwave", "sw_gastype", 15, 5, 0);

dyna.DynaCycle(1e-1);

print("求解完成");
