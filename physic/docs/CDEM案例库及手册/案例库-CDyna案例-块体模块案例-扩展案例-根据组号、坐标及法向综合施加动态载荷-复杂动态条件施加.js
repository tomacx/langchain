setCurDir(getSrcDir());

dyna.Set("If_Virtural_Mass 0");

dyna.Set("Gravity 0 0 0");

dyna.Set("Output_Interval 100");

dyna.Set("Large_Displace 1");

blkdyn.ImportGrid("gid","inregularbody.msh");

blkdyn.SetModel("linear");

blkdyn.SetMat(2500, 3e10, 0.25, 3e5, 1e5, 25,10);

blkdyn.SetLocalDamp(0.01);

//blkdyn.ApplyDynaSinVarByGCD(<name,if_set,coeff[3],fKesai,fAmp,fCycle,fIniPhase,fBegTime,fFinTime, nGrp[2], fCoord[6], fDir[5]>);
//blkdyn.ApplyDynaSinVarByGCD("velocity", false, [1, 0,0], 0.0, 100, 0.005, 0, 0, 0.0025, [1,3], [-1e5, -0.9, -1e5, 1e5, -1e5, 1e5], [1, -1, 0, 0, 0.5]);

//blkdyn.ApplyDynaLineVarByGCD(name,if_set,coeff[3],fT0,fV0,fT1,fV1,nGrp[2], fCoord[6], fDir[5]);
//blkdyn.ApplyDynaLineVarByGCD("velocity", false, [1, 0,0],  0, 0, 2e-3, 100, [1,3], [-1e5, -0.9, -1e5, 1e5, -1e5, 1e5], [1, -1, 0, 0, 0.5]);

//blkdyn.ApplyDynaVarFromFileByGCD(name,if_set,coeff[3],fname,nGrp[2], fCoord[6], fDir[5]);
blkdyn.ApplyDynaVarFromFileByGCD("velocity", false, [5, 0,0] ,  "temp.txt",   [1,3], [-1e5, -0.9, -1e5, 1e5, -1e5, 1e5], [1, -1, 0, 0, 0.5]);

dyna.TimeStepCorrect(0.01);

dyna.DynaCycle(0.01);