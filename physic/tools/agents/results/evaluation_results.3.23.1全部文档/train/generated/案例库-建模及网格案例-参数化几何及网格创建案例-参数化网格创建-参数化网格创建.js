setCurDir(getSrcDir());

// ========== 参数定义 ==========
var nDim = 2; // 二维计算域
var lengthX = 100.0; // X方向长度(m)
var lengthY = 100.0; // Y方向长度(m)
var divX = 50; // X方向节点分割数
var divY = 50; // Y方向节点分割数
var originX = 0.0; // 原点X坐标
var originY = 0.0; // 原点Y坐标

// ========== 创建正交网格 ==========
skwave.DefMesh(nDim, [lengthX, lengthY], [divX, divY], [originX, originY]);

// ========== 网格分组管理 ==========
SetGroupByID("group1", 1); // 将所有单元归入group1组

// ========== 配置输出文件路径 ==========
var outputDir = getSrcDir() + "/output";
print("Output directory: " + outputDir);

// ========== 定义监测变量与采样频率 ==========
var monitorPressure = true; // 监测压力
var monitorVelocity = true; // 监测速度
var sampleFreq = 1e-6; // 采样频率(s)

// ========== 设置求解器参数 ==========
var totalTime = 0.1; // 总计算时间(s)
var dt = 1e-7; // 时间步长(s)

// ========== 启动求解器执行计算任务 ==========
blkdyn.SetTimeStep(dt);
blkdyn.SetTotalTime(totalTime);
blkdyn.Solve();

// ========== 读取并验证网格质量与监测数据 ==========
var meshQuality = blkdyn.GetMeshQuality();
print("Mesh quality check completed.");

var pressureData = blkdyn.GetMonitorData(monitorPressure);
var velocityData = blkdyn.GetMonitorData(monitorVelocity);

if (pressureData && velocityData) {
    print("Monitoring data collected successfully.");
} else {
    print("Warning: Some monitoring data may be incomplete.");
}

// ========== 导出最终仿真结果文件 ==========
blkdyn.ExportResults(outputDir + "/simulation_results.dat");
print("Simulation results exported to: " + outputDir);

// ========== 任务完成 ==========
print("Parameterized mesh creation task completed successfully.");
