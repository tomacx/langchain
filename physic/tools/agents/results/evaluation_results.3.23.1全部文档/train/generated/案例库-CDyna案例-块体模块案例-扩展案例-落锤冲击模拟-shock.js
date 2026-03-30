setCurDir(getSrcDir());

// 设置仿真参数
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Output_Interval 200");
dyna.Set("Moniter_Iter 10");
dyna.Set("Contact_Detect_Tol 1e-4");
dyna.Set("If_Virtural_Mass 0");

// 创建三维砖块几何（目标块和锤子）
blkdyn.GenBrick3D(0, 0, 0, 2.0, 2.0, 2.0, 1); // 目标块
blkdyn.GenBrick3D(0, 4.5, 0, 0.5, 0.5, 0.5, 2); // 锤子

// 创建接触面
blkdyn.CrtIFace(1);
blkdyn.CrtBoundIFaceByGroup(2);
blkdyn.UpdateIFaceMesh();

// 设置材料模型和参数
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 40.0, 10.0, 1); // 目标块材料

blkdyn.SetModel("linear");
blkdyn.SetMat(7800, 2.1e11, 0.3, 15e6, 10e6, 45.0, 10.0, 2); // 锤子材料

// 设置接触面本构模型
blkdyn.SetIModel("brittleMC");
blkdyn.SetIStrengthByElem();
blkdyn.SetIStiffByElem(10.0);

// 定义初始速度（锤子向下运动）
var hammerVel = new Array(0.0, -50.0, 0.0);
var targetVel = new Array(0.0, 0.0, 0.0);
blkdyn.InitConditionByGroup("velocity", hammerVel, [0,0,0,0,0,0,0,0,0], 2, 2);
blkdyn.InitConditionByGroup("velocity", targetVel, [0,0,0,0,0,0,0,0,0], 1, 1);

// 固定底部节点
blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);
blkdyn.FixV("xy", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("xy", 0.0, "z", -0.001, 0.001);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.01);

// 设置时间步长
dyna.TimeStepCorrect(0.8);
dyna.DynaCycle(5e-6);

// 定义监测点（位移和应力）
dyna.Monitor("block", "ydis", 0.0, 2.0, 1.0);
dyna.Monitor("block", "ydis", 1.0, 2.0, 1.0);
dyna.Monitor("block", "ystress", 0.0, 2.0, 1.0);

// 预计算初始化
dyna.BeforeCal();

// 主计算循环
for(var i = 0; i < 50000; i++) {
    // 集成核心计算
    var unbal = blkdyn.Solver();

    // 计算单元变形力
    blkdyn.CalBlockForce();

    // 计算节点运动
    blkdyn.CalNodeMovement();

    // 输出监测信息
    dyna.OutputMonitorData();

    // 每隔100步推送信息
    if(i != 0 && i % 100 == 0) {
        print("不平衡率：" + unbal);
        print("计算步数：" + i);

        // 推送结果信息至GDEM-Env
        dyna.PutStep(1, i, 0.1);
    }
}

// 最终化仿真过程
print("Simulation completed successfully!");
