setCurDir(getSrcDir());

dyna.Clear();
imeshing.clear();


dyna.Set("Time_Step 5e-3");

dyna.Set("If_Virtural_Mass 0");

dyna.Set("Output_Interval 200");

dyna.Set("Large_Displace 1");

dyna.Set("If_Renew_Contact 1");

dyna.Set("Renew_Interval 10");

dyna.Set("Block_Rdface_Contact_Scheme 3");


imeshing.genBrick3D("1", 20, 1, 5, 80, 5, 20, -5, -1, -2.5);


blkdyn.GetMesh(imeshing);


//blkdyn.RotateGrid(20, [0,0,0], [0,0,1], 1,11);


blkdyn.CrtIFaceByCoord(-100, 100, -0.001,0.001,-100,100);

blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("MC");
blkdyn.SetMat(1500, 1e7, 0.25, 1e4, 1e4, 20, 10);

blkdyn.SetIModel("brittleMC");

///强度及摩擦设为26,--摩擦系数0.5
blkdyn.SetIMat(1e10, 1e10, 26.0,0,0);

blkdyn.SetIStiffByElem(10.0);
//blkdyn.SetIStrengthByElem(1);

blkdyn.SetLocalDamp(0.8);

blkdyn.FixV("x", 0.0, "x", -6,  -4.999);
blkdyn.FixV("x", 0.0, "x", 14.99,  15.1);
blkdyn.FixV("z", 0.0, "z", -2.6,-2.499);
blkdyn.FixV("z", 0.0, "z",2.499, 2.6);

blkdyn.FixV("xyz",0,"y", -1.1, -0.99);

rdface.Import("gid","wheel.msh"); ///rdfacepartRota.dat

rdface.CrtPart("feng");

rdface.SetPartProp(1.9e+03, [-9.363010e-06,4.997800e-01,1.240097e-01], [1.313625e+01,  1.315585e+01,2.425868e+01,0,0,0], "feng");



rdface.SetPartRotaVel([0,0,0],[1,1,1]);

rdface.SetPartForce([0,-20000,0]);

rdface.SetPartLocalDamp(0.8, 0.8);

dyna.Monitor("rdface","rg_xDis", 1,1,1);
dyna.Monitor("rdface","rg_yDis", 1,1,1);
dyna.Monitor("rdface","rg_zDis", 1,1,1);

dyna.TimeStepCorrect(0.2);

dyna.Solve();

blkdyn.SetLocalDamp(0.02);
rdface.SetPartRotaVel([0,0,-30],[1,1,1]);
rdface.SetPartLocalDamp(0.02, 0.05);

dyna.Solve(1000000);
