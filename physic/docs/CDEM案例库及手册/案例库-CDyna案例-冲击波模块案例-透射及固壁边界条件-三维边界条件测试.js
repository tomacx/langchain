setCurDir(getSrcDir());

dyna.Set("Time_Step 4e-6");
dyna.Set("Output_Interval 100");


skwave.DefMesh(3, [10, 10, 10], [50, 50, 50]);

skwave.InitBySphere(1.01e5, 1.02, [0,0,0], [0,0, 0], 100.0);

skwave.InitBySphere(1e9, 100, [0,0,0], [5, 5, 5], 1);

//skwave.SetBound(<iBX1, iBX2, iBY1, iBY2 [,iBZ1, iBZ2]>);
//0 为透射条件，1 为固壁条件
skwave.SetBound(1,1,1,1,0,0);

dyna.Monitor("skwave","sw_dens", 1, 5, 0);
dyna.Monitor("skwave","sw_dens", 2, 5, 0);
dyna.Monitor("skwave","sw_dens", 3, 5, 0);

dyna.Monitor("skwave","sw_pp", 1, 5, 0);
dyna.Monitor("skwave","sw_pp", 2, 5, 0);
dyna.Monitor("skwave","sw_pp", 3, 5, 0);

dyna.DynaCycle(1e-2);

print("求解完成");