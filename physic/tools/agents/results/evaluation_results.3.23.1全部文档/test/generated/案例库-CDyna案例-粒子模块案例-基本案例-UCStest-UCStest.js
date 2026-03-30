setCurDir(getSrcDir());

// 设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

// 创建三维方块网格模型 (10x10x10单元, 尺寸20x20x20)
blkdyn.GenBrick3D(10, 10, 10, 20, 20, 20, 1);

// 设置单元的力学模型类型为线弹性模型
blkdyn.SetModel("linear");

// 设置材料参数 (密度, 弹性模量, 泊松比, 屈服应力, 剪切模量, 其他参数)
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 40, 15);

// 固定底部边界条件 (限制Y方向速度)
blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);

// 设置典型监测点位置 (监测Y方向位移)
dyna.Monitor("block", "ydis", 5.0, 10.0, 5.0);
dyna.Monitor("block", "ydis", 5.0, 6.0, 5.0);
dyna.Monitor("block", "ydis", 5.0, 2.0, 5.0);

// 计算前初始化操作
dyna.BeforeCal();

// 主循环迭代步骤
for (var i = 0; i < 10000; i++) {
    // 集成核心计算
    var unbal = blkdyn.Solver();

    // 计算单元变形力
    blkdyn.CalBlockForce();

    // 计算节点运动
    blkdyn.CalNodeMovement();

    // 输出监测信息
    dyna.OutputMonitorData();

    // 每隔100步推送结果信息至GDEM-Env
    if (i != 0 && i % 100 == 0) {
        print("不平衡率：" + unbal);
        dyna.PutStep(1, i, 0.1);
    }
}
