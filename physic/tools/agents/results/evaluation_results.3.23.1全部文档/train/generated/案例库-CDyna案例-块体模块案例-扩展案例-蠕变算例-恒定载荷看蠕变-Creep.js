setCurDir(getSrcDir());

// 清理环境
igeo.clear();
imeshing.clear();
doc.clearResult();
dyna.Clear();

// 创建三维砖块网格 (10x10x10单元, 20x20x20mm尺寸, group=1)
blkdyn.GenBrick3D(10, 10, 10, 20, 20, 20, 1);

// 设置单元模型为Burger蠕变模型
blkdyn.SetModel("burger");

// 设置材料参数 (密度, 弹性模量, 泊松比, 体积模量, 剪切模量, 屈服应力, 屈服应变)
blkdyn.SetMat(2000, 3e9, 0.3, 8e6, 5e6, 30, 10);

// 设置全局蠕变材料参数 (序号, Maxwell粘度, Maxwell剪切模量, Kelvin粘度, Kelvin剪切模量)
blkdyn.SetCreepMat(1, 3e12, 3e9, 1e11, 3e9);

// 绑定蠕变材料到单元组 (group 1-1)
blkdyn.BindCreepMat(1, 1, 1);

// 设置计算控制参数
dyna.Set("Creep_Cal 1");
dyna.Set("Creep_G_Inherit 1");
dyna.Set("Auto_Creep_Time 0");
dyna.Set("Elem_Plastic_Cal_Creep 0");
dyna.Set("Output_Interval 500");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Large_Displace 0");

// 固定底部节点 (Y方向速度约束)
blkdyn.FixV("y", 0.0, "y", -0.01, 0.001);

// 在顶部施加恒定载荷 (X方向拉力，约1MPa应力)
var values = new Array(1e6, 0, 0);
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
blkdyn.ApplyConditionByCoord("face_force", values, gradient, 0.999, 1.01, -1, 1, -1, 1, false);

// 设置监测点 (X方向位移和应力)
dyna.Monitor("block","xdis", 5.0, 0, 0);
dyna.Monitor("block","xdis", 10.0, 0, 0);
dyna.Monitor("block","sxx", 5.0, 0, 0);
dyna.Monitor("block","sxx", 10.0, 0, 0);

// 设置时间步长
dyna.Set("Time_Step 36.0");

// 初始化计算环境
dyna.BeforeCal();

// 求解循环
for(var i = 0; i < 50000; i++) {
    // 核心计算
    blkdyn.Solver();

    // 计算单元变形力
    blkdyn.CalBlockForce();

    // 计算节点运动
    blkdyn.CalNodeMovement();

    // 输出监测信息
    dyna.OutputMonitorData();

    // 每隔100步推送信息
    if(i != 0 && i % 100 == 0) {
        print("迭代步：" + i);
        dyna.PutStep(1, i, 0.1);
    }
}

// 结束求解
dyna.Solve(50000);
