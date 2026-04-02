setCurDir(getSrcDir());

// 设置计算参数
dyna.Set("Time_Step", 1e-5);
dyna.Set("Output_Interval", 200);

// 定义网格
skwave.DefMesh(3, [10, 10, 10], [50, 50, 50]);

// 初始化固体材料参数
skwave.InitBySphere(1.01e5, 1.02, [0,0,0], [0,0,0], 100.0);

// 设置入射波条件
skwave.SetInflow(1, 1, 3, 130, 1000, 1e7, 3, [5, 0, 0, 2]);

// 设置边界条件，透射及固壁边界条件测试
skwave.SetBound(1, 1, 1, 1, 0, 0);

// 添加监测点
dyna.Monitor("skwave", "sw_dens", 1, 5, 0);
dyna.Monitor("skwave", "sw_dens", 2, 5, 0);
dyna.Monitor("skwave", "sw_dens", 3, 5, 0);

// 添加压力监测点
dyna.Monitor("skwave", "sw_pp", 1, 5, 0);
dyna.Monitor("skwave", "sw_pp", 2, 5, 0);
dyna.Monitor("skwave", "sw_pp", 3, 5, 0);

// 运行计算
dyna.DynaCycle(1e-2);

print("求解完成");
