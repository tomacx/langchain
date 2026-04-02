setCurDir(getSrcDir());

dyna.Set("Mechanic_Cal 1");


dyna.Set("UnBalance_Ratio 1e-5");

dyna.Set("Gravity 0.0 0.0 0.0");

dyna.Set("Large_Displace 0");

dyna.Set("Output_Interval 100");


dyna.Set("GiD_Out 0");

dyna.Set("Msr_Out 0");

dyna.Set("Moniter_Iter 10");

dyna.Set("If_Virtural_Mass 0");

dyna.Set("Virtural_Step 0.6");


dyna.Set("If_Cal_Rayleigh 1")

blkdyn.ImportGrid("flac3d", "cubic.flac3d");


blkdyn.SetMatByGroupRange(2500, 3e10, 0.25, 3e6, 1e6, 40.0, 10.0, 1, 2);
blkdyn.SetModel("linear", 1);

blkdyn.SetLocalDamp(0.0);
blkdyn.SetRayleighDamp(5e-7, 0.0);

var fValue1 = [-0.01,  0.01];
var fValue2 = [ 9.99, 10.01];


blkdyn.SetFreeFieldBound("x",-0.01,0.01);
blkdyn.SetFreeFieldBound("x", 9.99, 10.01);
blkdyn.SetFreeFieldBound("z", -0.01, 0.01);
blkdyn.SetFreeFieldBound("z", 9.99, 10.01);
blkdyn.SetFreeFieldBound3DColumn();



dyna.Monitor("block", "sxx", 0.1, 0, 0);
dyna.Monitor("block", "sxx", 0.2, 0, 0);
dyna.Monitor("block", "sxx", 0.3, 0, 0);
dyna.Monitor("block", "sxx", 0.4, 0, 0);



dyna.Set("Time_Step 1e-5");

var coeff = [1.0, 0.0, 0.0];
var range1 = [-2000.0,2000.0];
var range2 = [-0.01,0.01];
blkdyn.SetQuietBoundByCoord(-2000,2000,-0.01,0.01,-2000,2000);
blkdyn.ApplyDynaSinVarByCoord("face_force", false, coeff, 0.0, 1e6, 0.01, 0.0, 0.0, 1.0, range1, range2, range1);

dyna.DynaCycle(0.1);



print("Solution Finished");
