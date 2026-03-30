setCurDir(getSrcDir());

// 初始化环境并加载核心模块
pdyna.LoadModule("pdyna");
skwave.LoadModule("skwave");

// 1. 设置三维计算域网格 (200m x 200m x 50m，每个方向分割40个点)
skwave.DefMesh(3, [200.0, 200.0, 50.0], [40, 40, 10]);

// 2. 定义滑坡体圆柱生成参数
var cylinderEnd1 = new Array(0.0, 0.0, 0.0);      // 圆柱轴线端点1坐标
var cylinderEnd2 = new Array(100.0, 0.0, 50.0);   // 圆柱轴线端点2坐标

// 3. 在指定圆柱区域内随机生成球形颗粒 (总数量上限、组号、类型、半径范围)
pdyna.CreateByCylinder(5000, 1, 2, 0.5, 2.0, 0.0, cylinderEnd1, cylinderEnd2, 0.0, 10.0);

// 4. 配置颗粒接触对摩擦系数与粘聚力等参数 (通过Set UserDefValue设置)
var frictionCoeff = 0.6;      // 颗粒间摩擦系数
var cohesion = 5000.0;        // 颗粒间粘聚力 (Pa)
var tensileStrength = 10000.0;// 抗拉强度 (Pa)

// 设置用户自定义材料参数到颗粒接触对
for (var i = 1; i <= 5000; i++) {
    pdyna.SetUserDefValue(i, "friction", frictionCoeff);
    pdyna.SetUserDefValue(i, "cohesion", cohesion);
    pdyna.SetUserDefValue(i, "tensileStrength", tensileStrength);
}

// 5. 设置模型底部固定边界条件 (z=0平面)
for (var i = 1; i <= 5000; i++) {
    var pos = pdyna.GetParticlePos(i);
    if (pos[2] < 5.0) {  // 底部5m范围内颗粒固定
        pdyna.SetParticleVelocity(i, 0.0, 0.0, 0.0);
        pdyna.SetParticleConstraint(i, true);
    }
}

// 6. 施加重力加速度 (g = 9.81 m/s²，方向向下)
pdyna.SetGravity(0.0, 0.0, -9.81);

// 7. 初始化颗粒初始速度场 (轻微扰动触发滑坡运动)
for (var i = 1; i <= 5000; i++) {
    var pos = pdyna.GetParticlePos(i);
    // 顶部颗粒给予微小随机初速度
    if (pos[2] > 40.0) {
        var v = Math.random() * 0.1 - 0.05;
        pdyna.SetParticleVelocity(i, v, 0.0, 0.0);
    }
}

// 8. 配置输出监测选项 (记录颗粒位移、接触力及能量耗散)
pdyna.SetOutputOption("particleDisplacement", true);
pdyna.SetOutputOption("contactForce", true);
pdyna.SetOutputOption("energyDissipation", true);
pdyna.SetOutputOption("stressDistribution", true);

// 9. 设定仿真时间步长与总计算时长
var dt = 1e-6;      // 时间步长 (s)
var totalTime = 10.0; // 总计算时长 (s)

// 10. 执行求解器计算并导出结果
pdyna.SetTimeStep(dt);
pdyna.SetTotalTime(totalTime);
pdyna.Solve();

// 导出包含粒子轨迹与应力分布的结果文件
pdyna.ExportResults("slip_model_results.dat");
