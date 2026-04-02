setCurDir(getSrcDir());

dyna.Clear();
imeshing.clear();

dyna.Set("Time_Step", 1e-3);
dyna.Set("If_Virtural_Mass", 0);
dyna.Set("Output_Interval", 200);
dyna.Set("Large_Displace", 1);
dyna.Set("If_Renew_Contact", 1);
dyna.Set("Renew_Interval", 10);
dyna.Set("Block_Rdface_Contact_Scheme", 3);
dyna.Set("If_Cal_EE_Contact", 1);

imeshing.genBrick3D("1", 10, 1, 10, 20, 2, 20, -5, -2, -5);
blkdyn.GetMesh(imeshing);

blkdyn.RotateGrid(20, [0,0,0], [0,0,1], 1,11);

blkdyn.CrtBoundIFaceByGroup(1);
blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");
blkdyn.SetMat(1500, 1e7, 0.25, 1e6, 1e6, 15, 10);

blkdyn.SetIModel("brittleMC");
blkdyn.SetIStiffByElem(10);
blkdyn.SetIStrengthByElem(1);

blkdyn.SetLocalDamp(0.01);

blkdyn.FixV("xyz", 0.0, "x", -6, -4.999);
blkdyn.FixV("xyz", 0.0, "x", 4.999,6);
blkdyn.FixV("xyz",0,"x",-100,100);

rdface.Import("ansys","rdfacepartRota.dat");
rdface.CrtPart("feng");

rdface.SetPartProp(1.172213e+03, [1.474390e-05,1.463637e-01,3.534710e-01], [1.701473e+01,1.582510e+01,1.582546e+01,-1.584523e-03,1.202272e+00,-1.546533e-03 ], "feng");

rdface.SetPartLocalDamp(0.05, 0.05);

dyna.TimeStepCorrect(0.1);
dyna.Solve(100000);
