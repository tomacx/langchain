setCurDir(getSrcDir());

// 初始化配置
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("Monitor_Iter 10");
dyna.Set("SaveFile_Out 1");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Contact_Detect_Tol 0.001");

// 创建三维块体网格模型（包含断层区域）
blkdyn.GenBrick3D(20, 20, 20, 40, 40, 40, 1);

// 设置单元本构模型为线弹性
blkdyn.SetModel("linear");

// 设置材料参数：密度、弹性模量、泊松比、抗拉强度、抗压强度、内摩擦角、粘聚力
blkdyn.SetMat(2500, 3e10, 0.25, 1e6, 1e7, 30.0, 1e6);

// 固定底部边界条件（z方向）
blkdyn.FixV("xyz", 0.0, "y", -20.0, 20.0);
blkdyn.FixV("xyz", 0.0, "x", -20.0, 20.0);

// 定义断层错动载荷施加区域（在模型中部设置断层）
var faultX = new Array(-10.0, 10.0);
var faultY = new Array(0.0, 40.0);
var faultZ = new Array(19.5, 20.0);

// 设置断层错动速度边界条件（沿y方向施加位移）
var coeff = new Array(0.0, 1.0, 0.0);
pdyna.ApplyDynaCondLineByCoord("velocity", coeff, 0.0, 0.0, 2.0, 0.5, faultX, faultY, faultZ);

// 设置监测点记录断层面上的位移、应力及时间历史数据
dyna.Monitor("block", "ydis", -10.0, 10.0, 39.0);
dyna.Monitor("block", "ydis", -5.0, 5.0, 39.0);
dyna.Monitor("block", "ystress", -10.0, 10.0, 39.0);

// 设置求解控制参数
dyna.Set("Time_Step 1e-4");
dyna.Set("UnBalance_Ratio 1e-4");

// 计算前初始化
dyna.BeforeCal();

// 循环迭代求解
for (var i = 0; i < 50000; i++) {
    // 集成核心计算
    var unbal = blkdyn.Solver();

    // 计算单元变形力
    blkdyn.CalBlockForce();

    // 计算节点运动
    blkdyn.CalNodeMovement();

    // 输出监测信息
    dyna.OutputMonitorData();

    // 每隔100步推送信息
    if (i != 0 && i % 100 == 0) {
        print("不平衡率：" + unbal);
        print("当前时间步：" + i);
    }
}

// 导出仿真结束后的位移场、力场及监测曲线结果文件
dyna.OutputResult();
