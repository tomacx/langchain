setCurDir(getSrcDir());

dyna.Set("Mechanic_Cal 0");


dyna.Set("Config_Heat 1");
dyna.Set("Heat_Cal 1");

dyna.Set("Output_Interval 1000");


dyna.Set("GiD_Out 0");

dyna.Set("Msr_Out 0");

dyna.Set("Moniter_Iter 100");


blkdyn.ImportGrid("GiD", "OneDHeat.msh");



var fArrayGrad = new Array(0.0, 0.0, 0.0);



heatcd.SetPropByGroup (1000.0, 0.0, 1.6, 0.2, 1e-3, 1);

heatcd.ApplyConditionByCoord("temp", 100.0, fArrayGrad, -0.01, 0.001, -100, 100, -100, 100, true);


heatcd.ApplyConditionByCoord("temp", 0.0, fArrayGrad, 0.999, 11, -100, 100, -100, 100, true);



dyna.Monitor("block", "temperature", 0.2, 0, 0);
dyna.Monitor("block", "temperature", 0.5, 0, 0);
dyna.Monitor("block", "temperature", 0.8, 0, 0);

dyna.Set("Time_Step 0.002");

dyna.Solve(50000);




print("Solution Finished");
