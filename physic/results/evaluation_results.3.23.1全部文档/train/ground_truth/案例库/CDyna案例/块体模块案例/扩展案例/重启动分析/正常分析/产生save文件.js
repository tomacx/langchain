setCurDir(getSrcDir());

dyna.Clear();
doc.clearResult();

dyna.Set("Output_Interval 500");

blkdyn.GenBrick3D(10,10,10,5,5,5,1);

blkdyn.SetModel("linear");
blkdyn.SetMat(2200, 3e8, 0.3, 1e4, 1e4, 15, 15);

blkdyn.FixV("xyz", 0, "y", -0.001, 0.001);

dyna.Solve();

dyna.Save("Elastic.sav");

blkdyn.SetLocalDamp(0.01);

blkdyn.SetModel("MC");

dyna.Solve(1000);

dyna.Save("Plastic.sav");
