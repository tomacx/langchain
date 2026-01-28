setCurDir(getSrcDir());


dyna.Set("Gravity 0 -9.8 0");

dyna.Set("If_Virtural_Mass 0");

dyna.Set("Contact_Detect_Tol 0.0");

dyna.Set("Output_Interval 500");

dyna.Set("Contact_Search_Method 2");

dyna.Set("Particle_Renew_Interval 1");

dyna.Set("If_Opti_Cell_Length 0");

dyna.Set("Min_Cell_Length 4.0");

dyna.Set("OpenMP_SubBlock_No 136");

pdyna.Import("pdyna","OriginPar.dat");


pdyna.SetModel("brittleMC");

pdyna. SetMat(2500, 1e8, 0.25, 0,0,0,0,0.1);


rdface.Import("gid","bound.msh");

dyna.TimeStepCorrect(0.3);


dyna.Solve(30000);