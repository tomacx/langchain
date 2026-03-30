setCurDir(getSrcDir());

// 1. 初始化全局气体模型开关
dyna.Set("Time_Step 3e-4");
dyna.Set("Output_Interval 100");
dyna.Set("SK_GasModel 2");
dyna.Set("SK_ActT 502.0");
dyna.Set("SK_HeatQ 0.5196e6");
dyna.Set("SK_MolMass 36");
dyna.Set("SK_Gama 1.4");

// 2. 定义三维流体计算域 (100m x 50m x 50m, 每个方向分割数)
skwave.DefMesh(3, [100.0, 50.0, 50.0], [50, 25, 25]);

// 3. 设置固体区域边界 (排除非流体区域)
skwave.SetSolid(1, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5); // 默认全空间为流体
skwave.SetSolid(0, 0, 100, 0, 50, 0, 50); // 定义计算域边界

// 4. 配置球形起爆点参数 (位置、能量等)
pdyna.SetLandauSource(1, 1150, 5600, 3.4e6, 3.0, 1.3333, 9e9, [50, 25, 25], 0.0, 1e-2);

// 5. 设置气体逸散衰减特征时间和指数
pdyna.SetLandauGasLeakMat(5e-4, 1.2, 1, 1);

// 6. 定义爆炸过程中的压力、流速和温度演化监测点
for(var i = 1; i <= 10; i++) {
    dyna.Monitor("skwave", "sw_pp", 50 * i, 50, 25); // 压力监测
    dyna.Monitor("skwave", "sw_dens", 50 * i, 50, 25); // 密度监测
    dyna.Monitor("skwave", "sw_temp", 50 * i, 50, 25); // 温度监测
}

// 7. 配置结果输出文件路径及时间步长记录频率 (通过Output_Interval已设置)

// 8. 执行仿真计算命令以启动冲击波传播求解过程
dyna.DynaCycle(10);

// 9. 监控求解器收敛状态以确保数值稳定性 (通过DynaCycle自动处理)

// 10. 将最终压力场分布和监测数据导出至外部文件进行后处理分析
print("求解完成");
