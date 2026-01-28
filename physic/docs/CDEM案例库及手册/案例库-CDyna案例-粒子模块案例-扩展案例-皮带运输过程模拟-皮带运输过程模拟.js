setCurDir(getSrcDir());

dyna.Set("Large_Displace 1");

dyna.Set("Gravity 0 -9.8 0");

dyna.Set("If_Renew_Contact 1");

dyna.Set("Output_Interval 200");

dyna.Set("If_Virtural_Mass 0");

dyna.Set("If_Particle_Cal_Rolling 0");

pdyna.Import("gid","Particle.msh");

pdyna.SetModel("brittleMC");

//pdyna.SetMat(<density, young, poisson, tension, cohesion, friction, localdamp, viscdamp >);
pdyna.SetMat(2000, 1e7, 0.2, 0,0, 25.0, 0.0, 0.1);



rdface.Import("gid","BeltSys.msh");

dyna.TimeStepCorrect(0.8);

dyna.Solve(10000);

////施加皮带速度
rdface.ApplyBeltVelocity(5, 0, 0 ,2, 2);

dyna.Solve(8000);
