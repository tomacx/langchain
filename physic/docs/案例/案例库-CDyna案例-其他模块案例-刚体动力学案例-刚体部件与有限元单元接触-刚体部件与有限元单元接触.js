setCurDir(getSrcDir());

dyna.Clear();
imeshing.clear();

dyna.Set("If_Cal_EE_Contact 1");

dyna.Set("Time_Step 1e-3");

dyna.Set("If_Virtural_Mass 0");

dyna.Set("Output_Interval 1000");

dyna.Set("Large_Displace 1");

dyna.Set("If_Renew_Contact 1");

dyna.Set("Renew_Interval  1");

dyna.Set("Block_Rdface_Contact_Scheme 1");

dyna.Set("Contact_Detect_Tol 1e-2");

blkdyn.GenBrick3D(10, 1, 1, 1,1,1,1);

//blkdyn.MoveGrid([0,0,2],1,11);

blkdyn.CrtBoundIFaceByGroup(1);

blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");
blkdyn.SetMat(1500, 1e9, 0.25, 1e6, 1e6, 15, 10);

blkdyn.SetIModel("brittleMC");

blkdyn.SetIStiffByElem(50);
blkdyn.SetIStrengthByElem(1);

blkdyn.SetLocalDamp(0.01);

blkdyn.FixV("xyz", 0.0, "x", -100, 100);



rdface.Import("ansys","rdface-6face.dat");

rdface.CrtPart("feng");

rdface.SetPartProp(10000, [5.500000e+00,2.500000e+00,-4.487788e-18], [8.416667e+04, 8.416667e+04, 1.666667e+03,	-1.776321e-14,2.097789e-14,6.616041e-15], "feng");




rdface.SetPartLocalDamp(0.02, 0.02);


dyna.TimeStepCorrect(0.2);

dyna.Solve(100000);