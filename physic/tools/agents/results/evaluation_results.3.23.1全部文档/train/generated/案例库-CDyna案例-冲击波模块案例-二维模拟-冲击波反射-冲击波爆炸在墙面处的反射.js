setCurDir(getSrcDir());

// 初始化计算环境
dyna.Set("Time_Step 1e-6");
dyna.Set("Output_Interval 100");
dyna.Set("Mechanic_Cal 1");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");

// 定义二维计算域网格（2D平面）
skwave.DefMesh(2, [10, 10], [200, 200]);

// 设置固体边界（墙面区域）
// 参数：单元ID, X方向范围, Y方向范围, Z方向范围
skwave.SetSolid(1, 8, 9, 2, 8, -1, 1);
skwave.SetSolid(1, 2, 9, 1, 2, -1, 1);
skwave.SetSolid(1, 2, 9, 8, 9, -1, 1);

// 设置空气域初始状态（声速、密度等）
skwave.InitBySphere(1.01e5, 1.02, [0, 0, 0], [0, 0, 0], 100.0);

// 设置爆炸源参数（TNT当量、起爆位置、起爆时间）
skwave.InitBySphere(1e9, 100, [0, 0, 0], [5, 5, 0], 0.5);

// 设置自由场边界条件（空气域）
blkdyn.SetFreeFieldBound3DColumn();

// 设置监测点（墙面表面压力监测）
dyna.Monitor("skwave", "sw_pp", 1, 5, 0);
dyna.Monitor("skwave", "sw_pp", 2, 5, 0);
dyna.Monitor("skwave", "sw_pp", 3, 5, 0);

// 设置监测点（墙面表面密度/速度监测）
dyna.Monitor("skwave", "sw_dens", 1, 5, 0);
dyna.Monitor("skwave", "sw_dens", 2, 5, 0);
dyna.Monitor("skwave", "sw_dens", 3, 5, 0);

// 执行求解循环
dyna.DynaCycle(1e-2);

print("冲击波反射计算完成");
