setCurDir(getSrcDir());

dyna.Set("Output_Interval 500")
dyna.Set("Time_Step 1e-5")


skwave.DefMesh(3, [10, 10, 10], [50, 50, 50]);

skwave.SetSolidBySphere(1, [5,5,5], 2);
skwave.SetSolidBySphere(0, [5,5,5], 1.6);
skwave.SetSolid(0, 4.6, 5.4, 4.6, 5.4, 5, 11);

skwave.InitBySphere(1.01e5, 1.02, [0,0,0], [0,0, 0], 100.0);

skwave.InitBySphere(1e8, 100, [0,0,0], [5, 5, 5], 1.8);


dyna.DynaCycle(1e-2);

print("求解完成");
