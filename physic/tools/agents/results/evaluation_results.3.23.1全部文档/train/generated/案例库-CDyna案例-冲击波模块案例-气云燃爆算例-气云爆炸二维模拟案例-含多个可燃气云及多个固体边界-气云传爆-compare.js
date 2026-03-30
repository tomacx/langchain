setCurDir(getSrcDir());

// 1. 初始化仿真环境并加载CDyna核心接口模块
dyna.Set("Time_Step 1e-4");
dyna.Set("Output_Interval 50");
dyna.Set("SK_GasModel 2");
dyna.Set("SK_ActT 502.0");
dyna.Set("SK_HeatQ 0.5196e6");
dyna.Set("SK_MolMass 36");
dyna.Set("SK_Gama 1.4");

// 2. 定义计算域网格（三维）
skwave.DefMesh(3, [1000, 500, 500], [100, 50, 50]);

// 3. 设置固体边界几何形状（多个固体区域）
skwave.SetSolid(1, -1e5, 1e5, -100, 20, -1e5, 1e5);
skwave.SetSolid(1, 600, 650, -1e5, 350, 150, 350);
skwave.SetSolid(1, 800, 900, -1e5, 200, 100, 200);
skwave.SetSolid(1, 1000, 1100, -1e5, 300, 50, 250);

// 4. 设置多个可燃气云球体区域
skwave.SetGasCloudBySphere(1, [400, 250, 250], 200);
skwave.SetGasCloudBySphere(1, [600, 300, 0], 75);
skwave.SetGasCloudBySphere(1, [800, 0, 0], 40);
skwave.SetGasCloudBySphere(1, [900, 250, 250], 150);

// 设置普通气体区域作为背景
skwave.SetGasCloud(0, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 5. 初始化气体属性（压力、温度等）
skwave.InitBySphere(8.321e4, 1.201, [0,0,0], [0,0, 0], 10000.0);

// 6. 设置起爆源位置（多个起爆点）
skwave.SetFirePos(400, 250, 250, 20, 1.945, 4.162E2, 6.27E5);
skwave.SetFirePos(600, 300, 0, 15, 1.945, 4.162E2, 6.27E5);
skwave.SetFirePos(800, 0, 0, 10, 1.945, 4.162E2, 6.27E5);

// 7. 设置边界条件（固定边界）
skwave.SetBound(0, 0, 1, 0);

// 8. 配置激波传播控制范围及气体燃爆计算开关参数
dyna.Set("SK_WaveControl 1");
dyna.Set("SK_BurnSwitch 1");

// 9. 设置监测点采集压力与温度等关键物理量数据
for(var i = 1; i <= 20; i++) {
    dyna.Monitor("skwave", "sw_dens", 100 * i, 250, 0);
    dyna.Monitor("skwave", "sw_pp", 100 * i, 250, 0);
    dyna.Monitor("skwave", "sw_temp", 100 * i, 250, 0);
    dyna.Monitor("skwave", "sw_gastype", 100 * i, 250, 0);
}

// 在固体边界设置监测点
for(var i = 1; i <= 10; i++) {
    dyna.Monitor("skwave", "sw_pp", 50 + i * 50, 300, 0);
}

// 10. 执行求解器进行时间步推进计算
dyna.DynaCycle(10);

// 11. 将仿真结果及传爆数据推送到宿主平台
dyna.PutStep();

// 12. 输出仿真结束状态报告及关键指标验证结果完整性
print("仿真完成：多个可燃气云及固体边界-气云传爆计算结束");
print("监测点数量：" + dyna.GetValue("Monitor_Count"));
print("气体区域数：" + dyna.GetValue("Gas_Cloud_Count"));
print("固体区域数：" + dyna.GetValue("Solid_Count"));
