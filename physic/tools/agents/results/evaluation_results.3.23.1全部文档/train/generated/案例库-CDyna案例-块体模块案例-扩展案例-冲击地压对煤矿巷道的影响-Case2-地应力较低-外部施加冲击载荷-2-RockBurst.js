setCurDir(getSrcDir());

// 清除模型数据
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 设置计算开关
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("Monitor_Iter 10");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 0.0");

// 创建三维块体网格（20x20x20m，单元尺寸20x20x20）
blkdyn.GenBrick3D(20, 20, 20, 1, 1, 1, 1);

// 设置单元模型为线弹性
blkdyn.SetModel("linear");

// 设置岩石材料参数（密度、弹性模量、泊松比、屈服强度等）
blkdyn.SetMat(2500, 3e10, 0.25, 5e6, 5e6, 40.0, 15.0);

// 固定模型底部边界（Z方向速度自由度）
blkdyn.FixV("z", 0.0, "y", -0.001, 0.001);
blkdyn.FixV("z", 0.0, "x", -0.001, 0.001);

// 设置监测点（Y方向位移）
dyna.Monitor("block", "ydis", 5.0, 10.0, 5.0);
dyna.Monitor("block", "ydis", 5.0, 6.0, 5.0);
dyna.Monitor("block", "ydis", 5.0, 2.0, 5.0);

// 施加外部冲击波载荷（TNT质量100kg，爆炸点坐标[5,2,3]）
blkdyn.ApplyShockWaveByCoord(100.0, [5, 2, 3], 0, 340, 1.0, 0.299, 9.701, -1, 3.81, 0.299, 5.701);

// 计算前初始化
dyna.BeforeCal();

// 循环迭代进行核心物理方程的数值求解
for (var i = 0; i < 10000; i++) {
    // 集成核心计算
    var unbal = blkdyn.Solver();

    // 计算单元变形力
    blkdyn.CalBlockForce();

    // 计算节点运动状态
    blkdyn.CalNodeMovement();

    // 输出监测数据
    dyna.OutputMonitorData();

    // 每隔100步推送信息
    if (i != 0 && i % 100 == 0) {
        print("不平衡率：" + unbal);
        dyna.PutStep(1, i, 0.1);
    }
}
