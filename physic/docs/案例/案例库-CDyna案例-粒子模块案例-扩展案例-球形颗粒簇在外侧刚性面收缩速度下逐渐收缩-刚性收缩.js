setCurDir(getSrcDir());

dyna.Set("Large_Displace 1");

dyna.Set("Gravity 0 0 0");

dyna.Set("If_Renew_Contact 1");

dyna.Set("Output_Interval 200");

dyna.Set("If_Virtural_Mass 0");

pdyna.Import("gid","sphere.msh");

pdyna.SetModel("brittleMC");

//pdyna.SetMat(<density, young, poisson, tension, cohesion, friction, localdamp, viscdamp >);
pdyna.SetMat(2000, 1e8, 0.2, 0,0,10, 0.0, 0.1);



rdface.Import("gid","sphere-bound.msh");

//rdface.ApplyRadialVelocity(IDNo, nType, fOrigin[3], fNormal[3], fVel, GroupLow, GroupUp);

////外测刚性面施加向内的径向速度，模式为2（法向不起作用），球形收缩
rdface.ApplyRadialVelocity(1, 2, [0,0,0], [0,0,1], -1, 2, 2);

dyna.TimeStepCorrect(0.8);

dyna.Solve(2000);
