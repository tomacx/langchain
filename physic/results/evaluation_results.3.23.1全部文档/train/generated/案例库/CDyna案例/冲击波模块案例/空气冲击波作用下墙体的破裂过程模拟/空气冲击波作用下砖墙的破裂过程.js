setCurDir(getSrcDir());

dyna.Set("Time_Step", 2e-6);
dyna.Set("Output_Interval", 100);

skwave.DefMesh(3, [10, 10, 10], [50, 50, 50]);

// 初始化冲击波源
skwave.InitBySphere(1.01e5, 1.02, [0, 0, 0], [0, 0, 0], 1000.0);

// 设置固壁边界条件
skwave.SetBound(1, 1, 1, 1, 1, 1);

dyna.Monitor("skwave", "sw_dens", 1, 5, 0);
dyna.Monitor("skwave", "sw_dens", 2, 5, 0);
dyna.Monitor("skwave", "sw_dens", 3, 5, 0);

dyna.Monitor("skwave", "sw_pp", 1, 5, 0);
dyna.Monitor("skwave", "sw_pp", 2, 5, 0);
dyna.Monitor("skwave", "sw_pp", 3, 5, 0);

// 运行计算
dyna.DynaCycle(0.1);

print("求解完毕");
