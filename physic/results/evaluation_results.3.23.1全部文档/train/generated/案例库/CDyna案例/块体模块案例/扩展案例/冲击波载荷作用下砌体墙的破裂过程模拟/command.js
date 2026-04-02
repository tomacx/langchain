setCurDir(getSrcDir());

// 设置计算参数
dyna.Set("Time_Step 1e-6");
dyna.Set("Output_Interval 100");

// 定义网格
skwave.DefMesh(2, [10, 10], [200, 200]);

// 设置固体区域
skwave.SetSolid(1, 8, 9, 2, 8, -1, 1);
skwave.SetSolid(1, 2, 9, 1, 2, -1, 1);
skwave.SetSolid(1, 2, 9, 8, 9, -1, 1);

// 初始化冲击波
skwave.InitBySphere(1.01e5, 1.02, [0, 0, 0], [0, 0, 0], 100.0);
skwave.InitBySphere(1e9, 100, [0, 0, 0], [5, 5, 0], 0.5);

// 设置监测点
dyna.Monitor("skwave", "sw_dens", 1, 5, 0);
dyna.Monitor("skwave", "sw_dens", 2, 5, 0);
dyna.Monitor("skwave", "sw_dens", 3, 5, 0);

// 开始计算
dyna.DynaCycle(1e-2);

print("求解完成");
