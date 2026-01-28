setCurDir(getSrcDir());

dyna.Set("Output_Interval 200");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");

dyna.Set("Gravity 0 0 -9.8")

rdface.Import("ansys","Bound.dat");

pdyna.CreateByCoord(15000, 2, 2, 2, 8, 0,[400, 600], [400, 600],[310, 500]);

pdyna.SetModel("brittleMC");
pdyna.SetMat(2500, 1e9, 0.25, 0, 0, 25, 0.0, 0.1);

dyna.TimeStepCorrect(0.8);

dyna.Solve(10000);