setCurDir(getSrcDir());

dyna.Clear();

dyna.Set("Time_Step 1e-5");
dyna.Set("Output_Interval 200");


skwave.DefMesh(3, [10, 10, 10], [50, 50, 50]);

skwave.SetSolid(1, 4, 6, 4, 6, 4,6);


skwave.InitBySphere(1.01e5, 1.02, [0,0,0], [0,0, 0], 100.0);


//skwave.SetInflow(<nId, iActFlag, iBoundPos, fDens, fVel, fPres [,nRegionType, aRegionV]>);
//skwave.SetInflow(1, 1, 1, 130, 1000, 1e7);

//skwave.SetInflow(1, 1, 4, 130, 1000, 1e7, 2, [6,8,9,11,-1,1]);

//skwave.SetInflow(1, 1, 3, 130, 1000, 1e7, 3, [5,0,0,2]);

skwave.SetInflow(1, 1, 6, 130, 1000, 1e7, 3, [5,5,10,3]);

//skwave.SetInflow(1, 1, 4, 130, 1000, 1e7);


dyna.Monitor("skwave","sw_dens", 1, 5, 0);
dyna.Monitor("skwave","sw_dens", 2, 5, 0);
dyna.Monitor("skwave","sw_dens", 3, 5, 0);

dyna.Monitor("skwave","sw_pp", 1, 5, 0);
dyna.Monitor("skwave","sw_pp", 2, 5, 0);
dyna.Monitor("skwave","sw_pp", 3, 5, 0);

dyna.DynaCycle(10);

print("求解完成");
