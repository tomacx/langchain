setCurDir(getSrcDir());

dyna.Clear();

// 设置时间步长和输出间隔
dyna.Set("Time_Step", 1e-5);
dyna.Set("Output_Interval", 200);

// 定义冲击波网格
skwave.DefMesh(3, [10, 10, 10], [50, 50, 50]);

// 设置固体区域
skwave.SetSolid(1, 4, 6, 4, 6, 4, 6);

// 初始化冲击波球体
skwave.InitBySphere(1.01e5, 1.02, [0, 0, 0], [0, 0, 0], 100.0);

// 设置入流条件
skwave.SetInflow(1, 1, 6, 130, 1000, 1e7, 3, [5, 5, 10, 3]);

// 监测密度和压力变化
dyna.Monitor("skwave", "sw_dens", 1, 5, 0);
dyna.Monitor("skwave", "sw_dens", 2, 5, 0);
dyna.Monitor("skwave", "sw_dens", 3, 5, 0);

dyna.Monitor("skwave", "sw_pp", 1, 5, 0);
dyna.Monitor("skwave", "sw_pp", 2, 5, 0);
dyna.Monitor("skwave", "sw_pp", 3, 5, 0);

// 进行动力学计算
dyna.DynaCycle(10);

print("求解完成");
