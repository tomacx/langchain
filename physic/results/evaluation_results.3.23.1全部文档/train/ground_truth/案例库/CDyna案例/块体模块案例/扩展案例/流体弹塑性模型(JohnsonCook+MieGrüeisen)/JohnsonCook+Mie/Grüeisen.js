setCurDir(getSrcDir());

dyna.Set("Large_Displace 1");

dyna.Set("If_Virtural_Mass 0");

dyna.Set("Output_Interval 500");

dyna.Set("Time_Step 1e-8");

blkdyn.GenBrick3D(0.1, 0.1, 0.1, 20, 20, 20, 1);

blkdyn.SetModel("FEP");
blkdyn.SetMat(2703, 3e9,0.25, 3e6, 1e6, 35, 15);

blkdyn.SetJCMat(1, 324e6, 114e6, 0.42, 0.016, 1.34, 298, 877, 875, 1.0 , true);
blkdyn.BindJCMat(1, 1, 10);

blkdyn.SetMGMat(1, 2703, 5350, 1.34, 1.97, 1.5);
blkdyn.BindMGMat(1, 1, 10);

blkdyn.SetLocalDamp(0.01);

blkdyn.FixV("y", -1000, "y", 0.0999, 1);

blkdyn.FixV("y", 0, "y", -1,0.0001);

dyna.DynaCycle(5e-5);
