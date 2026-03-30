setCurDir(getSrcDir());

// 初始化仿真环境并设置全局参数
dyna.Set("Para_Threads_Num 4");
dyna.Set("Output_Interval 500");
dyna.Set("Gravity 0.0 0.0 -9.8");
dyna.Set("Time_Step 1e-4");
dyna.Set("Large_Displace 1");

// 导入包含桩体和上部结构的网格文件到块体动力学模块中
blkdyn.ImportGrid("gid", "PileSupport.msh");

// 设置模型为线弹性模型
blkdyn.SetModel("linear");

// 定义桩体材料属性（ID=2500）：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、初始粘聚力
blkdyn.SetMat(2500, 3e10, 0.25, 1e6, 1e6, 15, 15);

// 定义上部结构材料属性（ID=2501）：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、初始粘聚力
blkdyn.SetMat(2501, 3e10, 0.25, 1e6, 1e6, 15, 15);

// 设置桩体边界约束（桩底固定）
blkdyn.FixV("z", 0.0, "z", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// 设置上部结构边界约束（两侧固定）
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 49.99, 51);
blkdyn.FixV("z", 0.0, "z", -0.001, 0.001);

// 创建耦合面（桩体与上部结构接触面）
trff.CrtFace(2, 2);

// 设置耦合面本构模型为线弹性模型
trff.SetModel("linear");

// 设置耦合面材料参数：法向刚度、切向刚度、内摩擦角、当前粘聚力、当前抗拉强度、初始粘聚力
trff.SetMat(5e9, 5e9, 20, 0, 0, 1e8);

// 设置监测点位置以记录仿真过程中的位移和应力变化数据
dyna.Monitor("pile", "NodeDisX", 1, 1, 0);
dyna.Monitor("pile", "NodeDisY", 1, 1, 0);
dyna.Monitor("pile", "NodeDisZ", 1, 1, 0);
dyna.Monitor("pile", "StressXX", 1, 1, 0);
dyna.Monitor("pile", "StressYY", 1, 1, 0);
dyna.Monitor("pile", "StressZZ", 1, 1, 0);

// 设置上部结构监测点
dyna.Monitor("structure", "NodeDisX", 2, 1, 0);
dyna.Monitor("structure", "NodeDisY", 2, 1, 0);
dyna.Monitor("structure", "NodeDisZ", 2, 1, 0);
dyna.Monitor("structure", "StressXX", 2, 1, 0);
dyna.Monitor("structure", "StressYY", 2, 1, 0);
dyna.Monitor("structure", "StressZZ", 2, 1, 0);

// 设置耦合面监测点
dyna.Monitor("interface", "CopForceX", 3, 1, 0);
dyna.Monitor("interface", "CopForceY", 3, 1, 0);
dyna.Monitor("interface", "CopForceZ", 3, 1, 0);

// 定义总计算时间步长和模拟结束时间
dyna.Set("Total_Time 1.0");

// 调用求解器接口执行动力学分析计算过程并生成中间结果文件
dyna.Solve();

// 检查计算日志文件以确认仿真是否收敛或出现错误信息
var logFile = "cdyna.log";
if (blkdyn.CheckLog(logFile)) {
    console.log("仿真计算完成，请查看日志文件：" + logFile);
} else {
    console.error("仿真计算过程中出现错误，请检查日志文件");
}

// 导出最终的位移、应力及耦合面力等结果数据供后续后处理使用
blkdyn.ExportResults("results.dat", "NodeDisplacement", "Stress", "ContactForce");
