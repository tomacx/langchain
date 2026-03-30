setCurDir(getSrcDir());

imeshing.clear();
dyna.Clear();
doc.clearResult();

dyna.Set("Mechanic_Cal 1");


dyna.Set("UnBalance_Ratio 1e-5");

dyna.Set("Gravity 0.0 0.0 0.0");

dyna.Set("Large_Displace 1");

dyna.Set("Output_Interval 100");


dyna.Set("GiD_Out 0");

dyna.Set("Msr_Out 0");

dyna.Set("Moniter_Iter 10");

dyna.Set("If_Virtural_Mass 0");

dyna.Set("Virtural_Step 0.6");

dyna.Set("If_Cal_Rayleigh 1");


imeshing.genCylinder("1", 0.0, 0.1, 0, 0, 0, 0, 0.2, 0, 10, 36, 20);
blkdyn.GetMesh(imeshing);

blkdyn.SetModel("HJC", 1);
blkdyn.SetMat(2500, 8e10, 0.3, 3.7e7, 1e7, 35.0, 15.0, 1);

var HJCMat = [4.8e7, 0.79, 1.60, 0.61, 0.007, 7.0, 14.86e9, 0.04, 1.0, 0.01, 0.016e9, 0.001, 85e9, -171e9, 208e9, 0.8e9, 0.1, 0.004e9];
blkdyn.SetHJCMat(1, HJCMat);
blkdyn.BindHJCMat(1, 1, 1);

blkdyn.FixV("y", 0, "y", -1, 0.001);
blkdyn.FixV("y", -1000, "y", 0.199, 1.01);

blkdyn.SetLocalDamp(0.0);
blkdyn.SetRayleighDamp(5e-7, 0.0);

dyna.Set("Time_Step 5e-8");

dyna.DynaCycle(1e-4);

print("Solution Finished");
