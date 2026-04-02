setCurDir(getSrcDir());

// 设置计算参数
dyna.Set("Time_Step", 1e-6);
dyna.Set("Output_Interval", 100);

// 定义流体网格
skwave.DefMesh(3, [10, 10, 5], [200, 200, 100]);

// 设置固体区域
skwave.SetSolid(1, -10, 10, -10, 10, -10, -9);

// 初始化流体状态
skwave.InitBySphere(1.01e5, 1.02, [0, 0, 0], [0, 0, 0], 1000.0);
skwave.InitBySphere(1e9, 1000, [0, 0, 0], [3, 3, -5], 1);

// 设置监测信息
dyna.Monitor("skwave", "sw_dens", 1, 5, 0);
dyna.Monitor("skwave", "sw_dens", 2, 5, 0);
dyna.Monitor("skwave", "sw_dens", 3, 5, 0);

// 开始计算
dyna.DynaCycle(0.1);

print("求解完毕");
