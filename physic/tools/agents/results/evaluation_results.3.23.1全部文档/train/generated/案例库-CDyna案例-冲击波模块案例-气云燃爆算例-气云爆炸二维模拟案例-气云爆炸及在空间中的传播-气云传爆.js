setCurDir(getSrcDir());

// 1. 初始化求解器参数
dyna.Set("Time_Step 1e-5");
dyna.Set("Output_Interval 100");
dyna.Set("SK_GasModel 2");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Large_Displace 1");

// 2. 定义二维流体计算域正交网格 (20m x 10m, 200x100个节点)
skwave.DefMesh(2, [20.0, 10.0], [200, 100]);

// 3. 设置固体边界区域（可选，用于模拟墙壁反射）
skwave.SetSolid(1, -1, 21, -1, 2, -1, 1);
skwave.SetSolid(1, 7, 9, -1, 5, -1, 1);

// 4. 设置气云区域
skwave.SetGasCloud(1, -1, 7, -1, 11, -1, 1);

// 5. 初始化气云参数（压力、密度、温度）
skwave.InitBySphere(8.321e4, 1.21, [0, 0, 0], [0, 0, 0], 100.0);

// 6. 设置点火位置及朗道参数（压力、温度等）
skwave.SetFirePos(3, 5, 0, 0.5, 1.945, 4.162E2, 6.27E5);

// 7. 设置气体逸散衰减参数（特征时间5e-4s，指数1.2）
pdyna.SetLandauGasLeakMat(5e-4, 1.2, 1, 10);

// 8. 设置朗道爆源参数（ID=1，初始压力、密度、温度等）
pdyna.SetLandauSource(1, 1150, 5600, 3.4e6, 3.0, 1.3333, 9e9, [0, 0, 0], 0.0, 1e-2);

// 9. 设置监测点（密度、压力、温度、气体类型）
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

// 10. 执行计算（总时长0.1s）
dyna.DynaCycle(1e-1);

print("求解完成");
