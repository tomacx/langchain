setCurDir(getSrcDir());

// ========== 1. 初始化 CDyna 仿真环境并加载刚性面模块 rdface ==========
dyna.Clear();
imeshing.clear();

rdface.Import("gid", "GidGrp.msh");

// ========== 2. 定义待测试的刚体部件名称及对应的组号范围 ==========
var partName = "testPart";
var groupLow = 1;
var groupUp = 5;

// ========== 3. 调用 rdface.CrtPartAuto 方法根据几何自动创建刚体部件 ==========
var nTotal = rdface.CrtPartAuto("geo", 1e-3);
print("创建的刚体部件数量: " + nTotal);

// ========== 4. 设置外力矩边界条件，使用 pdyna.SetPartMoment 施加指定力矩 ==========
var afMoment = [0, 1e5, 0]; // X=0, Y=100000 N.m, Z=0
pdyna.SetPartMoment(afMoment, groupLow, groupUp);

// ========== 5. 配置刚性面监测参数，包括位移、速度及加速度分量 ==========
dyna.Monitor("rdface", "rg_PartDisX", nTotal, 0, 0);
dyna.Monitor("rdface", "rg_PartDisY", nTotal, 0, 0);
dyna.Monitor("rdface", "rg_PartDisZ", nTotal, 0, 0);
dyna.Monitor("rdface", "rg_PartVelX", nTotal, 0, 0);
dyna.Monitor("rdface", "rg_PartVelY", nTotal, 0, 0);
dyna.Monitor("rdface", "rg_PartVelZ", nTotal, 0, 0);
dyna.Monitor("rdface", "rg_PartAccX", nTotal, 0, 0);
dyna.Monitor("rdface", "rg_PartAccY", nTotal, 0, 0);
dyna.Monitor("rdface", "rg_PartAccZ", nTotal, 0, 0);

// ========== 6. 设定输出文件路径以存储刚体动力学计算结果数据 ==========
setCurDir(getSrcDir());
var outputDir = getSrcDir() + "/output";
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// ========== 7. 启动仿真求解器进行刚体动力学自动计算过程 ==========
dyna.Set("Time_Step", "1e-3");
dyna.Set("If_Virtural_Mass", "0");
dyna.Set("Output_Interval", "100");
dyna.Set("Large_Displace", "1");
dyna.Set("If_Renew_Contact", "1");
dyna.Set("Gravity", "0 0 -9.8");

// 设置刚体材料属性（密度、弹性模量等）
pdyna.SetMat(2500, 5e7, 0.3, 0, 0, 10, 0, 0.01);

// 设置求解时间步长修正
dyna.TimeStepCorrect(1.0);

// 执行求解（迭代次数根据收敛情况调整）
dyna.Solve(100000);

// ========== 8. 监控计算过程中的收敛状态及实时监测数据更新情况 ==========
var convergenceStatus = dyna.GetConvergenceStatus();
print("收敛状态: " + convergenceStatus);

// ========== 9. 读取并解析计算结束后的刚性面平均位移与速度结果 ==========
var resultData = {
    partDisX: dyna.GetValue("rg_PartDisX", nTotal, 0, 0),
    partDisY: dyna.GetValue("rg_PartDisY", nTotal, 0, 0),
    partDisZ: dyna.GetValue("rg_PartDisZ", nTotal, 0, 0),
    partVelX: dyna.GetValue("rg_PartVelX", nTotal, 0, 0),
    partVelY: dyna.GetValue("rg_PartVelY", nTotal, 0, 0),
    partVelZ: dyna.GetValue("rg_PartVelZ", nTotal, 0, 0)
};

print("刚性面平均位移结果:");
print("  X方向: " + resultData.partDisX);
print("  Y方向: " + resultData.partDisY);
print("  Z方向: " + resultData.partDisZ);

print("刚性面平均速度结果:");
print("  X方向: " + resultData.partVelX);
print("  Y方向: " + resultData.partVelY);
print("  Z方向: " + resultData.partVelZ);

// ========== 10. 生成包含 Part 测试结果的最终报告文件并保存至指定目录 ==========
var reportContent = "=== 刚体动力学 Part 测试结果报告 ===\n\n";
reportContent += "部件名称: " + partName + "\n";
reportContent += "组号范围: " + groupLow + "-" + groupUp + "\n";
reportContent += "创建部件数量: " + nTotal + "\n\n";
reportContent += "外力矩设置 (N.m):\n";
reportContent += "  X: " + afMoment[0] + "\n";
reportContent += "  Y: " + afMoment[1] + "\n";
reportContent += "  Z: " + afMoment[2] + "\n\n";
reportContent += "=== 位移结果 (m) ===\n";
reportContent += "X: " + resultData.partDisX.toFixed(6) + "\n";
reportContent += "Y: " + resultData.partDisY.toFixed(6) + "\n";
reportContent += "Z: " + resultData.partDisZ.toFixed(6) + "\n\n";
reportContent += "=== 速度结果 (m/s) ===\n";
reportContent += "X: " + resultData.partVelX.toFixed(6) + "\n";
reportContent += "Y: " + resultData.partVelY.toFixed(6) + "\n";
reportContent += "Z: " + resultData.partVelZ.toFixed(6) + "\n\n";
reportContent += "=== 收敛状态 ===\n";
reportContent += convergenceStatus;

var reportPath = outputDir + "/part_test_report.txt";
fs.writeFileSync(reportPath, reportContent);
print("报告已保存至: " + reportPath);
