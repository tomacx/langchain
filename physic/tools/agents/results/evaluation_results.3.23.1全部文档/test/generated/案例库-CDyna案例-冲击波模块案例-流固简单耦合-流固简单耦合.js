setCurDir(getSrcDir());

// 初始化仿真环境
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0 0 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Interface_Soften_Value 3e-3 3e-3");
dyna.Set("Solid_Cal_Mode 2");

// 导入流体网格
blkdyn.ImportGrid("ansys", "fluid.dat");

// 设置块体模型和材料参数
blkdyn.SetModel("MC");
blkdyn.SetMat(2500, 3e10, 0.25, 6e6, 5e6, 35, 15);

// 设置接触面本构模型
blkdyn.SetIModel("SSMC");
blkdyn.SetIMat(1e12, 1e12, 35, 6e6, 5e6);

// 创建流体域网格
skwave.DefMesh(3, [10, 10, 10], [50, 50, 50], [-0.5, -0.5, -0.5]);

// 继承固体边界
skwave.InheritSolid();

// 设置流体域中的固体区域
skwave.SetSolid(1, -5, 5, -5, 0.2, -5, 5);

// 初始化冲击波参数 - 未燃烧气体（空气）
skwave.InitBySphere(1.01e5, 1.02, [0, 0, 0], [0, 0, 0], 1000.0);

// 初始化冲击波参数 - 爆炸区域
skwave.InitBySphere(1e9, 1000, [0, 0, 0], [2.0, 1.5, 1.0], 0.3);

// 设置局部阻尼控制数值振荡
blkdyn.SetLocalDamp(0.01);

// 设置冲击波动态边界条件
blkdyn.ApplyShockWaveByCoord(100.0, [5, 2, 3], 0, 340, 1.0, -1, 1, -1, 1, -1, 1);

// 设置时间步长
dyna.Set("Time_Step 2e-6");

// 设置监测变量 - 压力、密度、速度等
dyna.Monitor("skwave", "sw_pp", 1, 5, 0);
dyna.Monitor("skwave", "sw_dens", 1, 5, 0);
dyna.Monitor("skwave", "sw_xvel", 1, 5, 0);
dyna.Monitor("skwave", "sw_yvel", 1, 5, 0);
dyna.Monitor("skwave", "sw_zvel", 1, 5, 0);
dyna.Monitor("skwave", "sw_e", 1, 5, 0);

// 执行求解计算
dyna.DynaCycle(0.1);

print("求解完成");
