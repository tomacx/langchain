setCurDir(getSrcDir());

// 清除旧的计算结果文件
dyna.Clear();
doc.clearResult();

// 定义全局重力加速度参数及结果输出间隔时间步
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Output_Interval 500");

// 生成三维网格模型并初始化单元为线弹性材料属性
blkdyn.GenBrick3D(10, 10, 10, 20, 20, 20, 1);
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 40, 15);

// 施加固定边界条件以限制特定方向的速度自由度
blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);

// 执行核心求解循环直至完成第一阶段正常分析计算
for (var i = 0; i < 5000; i++) {
    var unbal = blkdyn.Solver();
    blkdyn.CalBlockForce();
    blkdyn.CalNodeMovement();
    dyna.OutputMonitorData();

    if (i != 0 && i % 100 == 0) {
        print("不平衡率：" + unbal);
        dyna.PutStep(1, i, 0.1);
    }
}

// 调用 Save 接口将当前计算状态存储为二进制 save 文件
dyna.Save("restart.sav");

// 重新生成网格并恢复模型参数以满足调入 save 文件要求
blkdyn.GenBrick3D(10, 10, 10, 20, 20, 20, 1);
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 40, 15);
blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);

// 调用 Restore 接口从指定路径加载之前保存的计算状态数据
dyna.Restore("restart.sav");

// 配置重启动阶段的监测点坐标及需要输出的监测变量
dyna.Monitor("block", "ydis", 5.0, 10.0, 5.0);
dyna.Monitor("block", "ydis", 5.0, 6.0, 5.0);
dyna.Monitor("block", "ydis", 5.0, 2.0, 5.0);

// 执行后续计算循环并实时输出监测信息至控制台或结果文件夹
for (var j = 0; j < 5000; j++) {
    var unbal = blkdyn.Solver();
    blkdyn.CalBlockForce();
    blkdyn.CalNodeMovement();
    dyna.OutputMonitorData();

    if (j != 0 && j % 100 == 0) {
        print("重启动阶段不平衡率：" + unbal);
        dyna.PutStep(2, j, 0.1);
    }
}
