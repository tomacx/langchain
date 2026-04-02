setCurDir(getSrcDir());

dyna.Set("Time_Step", 1e-5);
dyna.Set("Output_Interval", 100);
dyna.Set("SK_GasModel", 2);

skwave.DefMesh(2, [20, 10], [200, 100]);

// 设置固体区域
skwave.SetSolid(1, -1, 21, -1, 2, -1, 1);
skwave.SetSolid(1, 7, 9, -1, 5, -1, 1);

// 设置可燃气云区域
skwave.SetGasCloud(1, -1, 7, -1, 11, -1, 1);

// 初始化气云参数
skwave.InitBySphere(8.321e4, 1.21, [0, 0, 0], [0, 0, 0], 100.0);

// 设置点火位置
skwave.SetFirePos(3, 5, 0, 0.5, 1.945, 4.162E2, 6.27E5);

// 添加监控点
dyna.Monitor("skwave", "sw_dens", 5, 5, 0);
dyna.Monitor("skwave", "sw_dens", 10, 5, 0);
dyna.Monitor("skwave", "sw_dens", 15, 5, 0);

dyna.Monitor("skwave", "sw_pp", 5, 5, 0);
dyna.Monitor("skwave", "sw_pp", 10, 5, 0);
dyna.Monitor("skwave", "sw_pp", 15, 5, 0);

dyna.Monitor("skwave", "sw_temp", 5, 5, 0);
dyna.Monitor("skwave", "sw_temp", 10, 5, 0);
dyna.Monitor("skwave", "sw_temp", 15, 5, 0);

dyna.Monitor("skwave", "sw_gastype", 5, 5, 0);
dyna.Monitor("skwave", "sw_gastype", 10, 5, 0);
dyna.Monitor("skwave", "sw_gastype", 15, 5, 0);

// 运行求解
dyna.DynaCycle(1e-1);

print("求解完成");
