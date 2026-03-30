setCurDir(getSrcDir());

// ========== 1. 初始化环境配置 ==========
dyna.Clear();
doc.clearResult();

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置重力加速度 (X, Y, Z)
dyna.Set("Gravity 0.0 -9.8 0.0");

// 关闭大变形计算（如需可改为1）
dyna.Set("Large_Displace 0");

// 设置输出间隔为500步
dyna.Set("Output_Interval 500");

// 设置监测结果输出时步为10步
dyna.Set("Moniter_Iter 10");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// ========== 2. 创建三维块体网格模型 ==========
blkdyn.GenBrick3D(10, 10, 10, 20, 20, 20, 1);

// ========== 3. 定义材料本构参数 ==========
// 设置所有单元为线弹性模型
blkdyn.SetModel("linear");

// 设置组1的材料参数：密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角、组号
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e6, 1e6, 30.0, 10.0, 1);

// ========== 4. 设置边界条件 ==========
// X方向右侧法向约束 (固定X方向速度)
blkdyn.FixV("x", 0.0, "x", 9.99, 10.01);

// Y方向底部约束 (固定Y方向速度)
blkdyn.FixV("y", 0.0, "y", -20.0, -19.99);

// Z方向底部约束 (固定Z方向速度)
blkdyn.FixV("z", 0.0, "z", -20.0, -19.99);

// ========== 5. 配置监测点 ==========
// 监测典型测点的X方向位移
dyna.Monitor("block", "xdis", 2, 5, 0);
dyna.Monitor("block", "xdis", 5, 5, 0);
dyna.Monitor("block", "xdis", 8, 5, 0);

// 监测典型测点的Y方向位移
dyna.Monitor("block", "ydis", 2, 5, 0);
dyna.Monitor("block", "ydis", 5, 5, 0);
dyna.Monitor("block", "ydis", 8, 5, 0);

// 监测典型测点的Z方向位移
dyna.Monitor("block", "zdis", 2, 5, 0);
dyna.Monitor("block", "zdis", 5, 5, 0);
dyna.Monitor("block", "zdis", 8, 5, 0);

// 监测典型测点的X方向应力
dyna.Monitor("block", "sxx", 2, 5, 0);
dyna.Monitor("block", "sxx", 5, 5, 0);
dyna.Monitor("block", "sxx", 8, 5, 0);

// ========== 6. 单元时步缩放 - 初始设定 ==========
// 将计算时步调整为5ms (5e-3 s)
dyna.ScaleTimeStep(5e-3);

// 可选：带比例因子调整
// dyna.ScaleTimeStep(5e-3, 1.5);

// ========== 7. 开启自动调整计算时步功能 ==========
// Auto_Cal_TimeStep: 是否每次计算前自动调整计算时步，0-不调整，1-调整
dyna.Set("Auto_Cal_TimeStep 1");

// TimeStep_AutoCorrectRatio: 时步比例因子 (默认1.0)
dyna.Set("TimeStep_AutoCorrectRatio 1.0");

// ========== 8. 计算前初始化 ==========
dyna.BeforeCal();

// ========== 9. 动态计算循环 ==========
var targetTime = 10.0; // 目标仿真时间 (s)
var currentIter = 0;
var maxIter = 200000000; // 最大迭代步数限制

while(currentIter < maxIter) {
    // 集成核心计算
    dyna.Sovle();

    // 获取当前时间
    var timeNow = dyna.Get("Time_Now");

    // 检查是否达到目标时间
    if(timeNow >= targetTime) {
        break;
    }

    currentIter++;
}

// ========== 10. 输出监测数据与结果 ==========
dyna.OutputMonitorData();

// 推送最终结果至环境
dyna.PutStep(1, currentIter, timeNow);

// 打印计算信息
print("计算完成，总迭代步数：" + currentIter);
print("最终时间：" + timeNow + " s");
