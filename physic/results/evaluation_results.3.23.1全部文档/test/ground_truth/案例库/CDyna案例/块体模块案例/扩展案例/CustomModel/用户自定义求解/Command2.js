setCurDir(getSrcDir());
dyna.Set("Gravity 0.0 -9.8 0.0");
blkdyn.GenBrick3D(10,10,10,20,20,20,1);

dyna.Set("Output_Interval 500");
dyna.Set("Time_Step 1");

blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 40, 15);
blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);
dyna.Monitor("block","ydis", 5.0, 10.0, 5.0);
dyna.Monitor("block","ydis", 5.0, 6.0, 5.0);
dyna.Monitor("block","ydis", 5.0, 2.0, 5.0);


dyna.LoadUDF("CustomModel");

dyna.RunUDFCmd("MySolve 5000");

dyna.RunUDFCmd("CalDist 0 0 0 10 10 0");

dyna.RunUDFCmd("PrintTotalVolume");

dyna.FreeUDF();
