setCurDir(getSrcDir());

dyna.Set("Time_Step 1e-6");
dyna.Set("Output_Interval 100");


skwave.DefMesh(2, [10, 10], [200, 200]);

skwave.SetSolid(1, 8, 9, 2,8, -1, 1);
skwave.SetSolid(1, 2, 9, 1,2, -1, 1);
skwave.SetSolid(1, 2, 9, 8,9, -1, 1);

skwave.InitBySphere(1.01e5, 1.02, [0,0,0], [0,0, 0], 100.0);

skwave.InitBySphere(1e9, 100, [0,0,0], [5, 5, 0], 0.5);

dyna.Monitor("skwave","sw_dens", 1, 5, 0);
dyna.Monitor("skwave","sw_dens", 2, 5, 0);
dyna.Monitor("skwave","sw_dens", 3, 5, 0);

dyna.Monitor("skwave","sw_pp", 1, 5, 0);
dyna.Monitor("skwave","sw_pp", 2, 5, 0);
dyna.Monitor("skwave","sw_pp", 3, 5, 0);

dyna.DynaCycle(1e-2);

print("求解完成");