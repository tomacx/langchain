setCurDir(getSrcDir());

// 初始化求解器参数
dyna.Set("Time_Step 1e-5");
dyna.Set("Output_Interval 500");
dyna.Set("SK_GasModel 2");
dyna.Set("SK_ActT 502.0");
dyna.Set("SK_HeatQ 0.5196e6");
dyna.Set("SK_MolMass 36");
dyna.Set("SK_Gama 1.4");

// 定义三维计算网格（气罐内部流体域）
skwave.DefMesh(3, [10, 10, 10], [50, 50, 50]);

// 设置固体边界（气罐壁面）- 使用球体布尔操作构建
skwave.SetSolidBySphere(1, [5, 5, 5], 2);
skwave.SetSolidBySphere(0, [5, 5, 5], 1.6);

// 设置固体边界区域ID和范围
skwave.SetSolid(0, 4.6, 5.4, 4.6, 5.4, 5, 11);

// 初始化流体域参数（压力、密度、温度）
skwave.InitBySphere(1.01e5, 1.02, [0, 0, 0], [0, 0, 0], 100.0);

// 设置爆炸源起爆点位置（气罐中心附近）
skwave.SetFirePos(5, 5, 5, 20, 1.945, 4.162E2, 6.27E5);

// 设置冲击波动态边界条件
blkdyn.ApplyShockWaveByCoord(100.0, [5, 5, 5], 0, 340, 1.0, 0.299, 9.701, -1, 3.81, 0.299, 5.701);

// 设置监测点（压力、密度、温度演化）
for (var i = 1; i <= 10; i++) {
    dyna.Monitor("skwave", "sw_pp", 10 * i, 5, 0);
    dyna.Monitor("skwave", "sw_dens", 10 * i, 5, 0);
    dyna.Monitor("skwave", "sw_temp", 10 * i, 5, 0);
}

// 设置监测点（流速）
for (var i = 1; i <= 5; i++) {
    dyna.Monitor("skwave", "sw_xvel", 20 * i, 5, 0);
    dyna.Monitor("skwave", "sw_yvel", 20 * i, 5, 0);
    dyna.Monitor("skwave", "sw_zvel", 20 * i, 5, 0);
}

// 执行计算循环
dyna.DynaCycle(10);

print("求解完成");
