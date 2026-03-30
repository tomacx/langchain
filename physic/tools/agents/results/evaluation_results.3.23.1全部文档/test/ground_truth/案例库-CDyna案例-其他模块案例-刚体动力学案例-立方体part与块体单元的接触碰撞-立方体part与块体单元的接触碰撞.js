setCurDir(getSrcDir());

dyna.Clear();
imeshing.clear();


dyna.Set("Time_Step 1e-3");

dyna.Set("If_Virtural_Mass 0");

dyna.Set("Output_Interval 200");

dyna.Set("Large_Displace 1");

dyna.Set("If_Renew_Contact 1");

dyna.Set("Renew_Interval 10");

dyna.Set("Block_Rdface_Contact_Scheme 3");

dyna.Set("If_Cal_EE_Contact 1");


imeshing.genBrick3D("1", 10, 1, 10, 1, 1,1, -5, -2, -5);

blkdyn.GetMesh(imeshing);


//blkdyn.RotateGrid(20, [0,0,0], [0,0,1], 1,11);




blkdyn.CrtBoundIFaceByGroup(1);

blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");
blkdyn.SetMat(1500, 1e8, 0.25, 1e6, 1e6, 15, 10);

blkdyn.SetIModel("brittleMC");

blkdyn.SetIStiffByElem(2.0);
blkdyn.SetIStrengthByElem(10);

blkdyn.SetLocalDamp(0.01);

blkdyn.FixV("xyz", 0.0, "x", -6,  -4.999);
blkdyn.FixV("xyz", 0.0, "x", 4.999, 6);

blkdyn.FixV("xyz",0,"x",-100,100);

rdface.Import("gid","bound.msh");

rdface.CrtPart("feng");

rdface.SetPartProp(8.004000e+03, [-4.022659e-01,3.281506e+00,1.000000e+00], [5.337557e+03, 5.337187e+03, 5.338744e+03, 8.808287e-01, -5.656059e-12,-2.879643e-13 ], "feng");


//rdface.SetPartVel([0,-5,0],[0,0,0]);

//rdface.SetPartRotaVel([0,1.0,0],[0,1,0])


rdface.SetPartLocalDamp(0.1, 0.1);


dyna.TimeStepCorrect(0.02);

dyna.Solve(100000);
