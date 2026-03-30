setCurDir(getSrcDir());
dyna.Clear();
doc.clearResult();

// 设置计算参数
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Contact_Detect_Tol 1e-5");
dyna.Set("Virtural_Step 0.5");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Output_Interval 1000");
dyna.Set("Time_Step 1e-4");

// 创建几何模型 - 上下连接板
var plateTop = igeo.genRect(0, 0.2, 0, 0.3, 0.05, 0);
var plateBot = igeo.genRect(0, 0.2, 0, 0.3, -0.05, 0);

// 创建螺栓孔
var holeTop = igeo.genCircle(0.15, 0.1, 0, 0.01, 0.005);
var holeBot = igeo.genCircle(0.15, 0.1, 0, 0.01, -0.005);

// 创建螺栓杆
var boltShaft = igeo.genCylinderV(0.15, 0.1, 0.02, 0.15, 0.1, -0.02, 0, 0.008, 0.002, 0.002);

// 创建螺母
var nut = igeo.genCylinderV(0.15, 0.1, 0.03, 0.15, 0.1, 0.02, 0, 0.008, 0.002, 0.002);

// 创建连接面
igeo.CrtBoundIFaceByCoord(-0.1, 0.3, -0.05, 0.05, -0.0001, 0.0001);
igeo.CrtBoundIFaceByCoord(-0.1, 0.3, -0.05, 0.05, 0.0149999, 0.0150001);

// 设置模型类型
blkdyn.SetModel("linear");

// 定义材料属性 - 铝合金连接板 (组号1)
blkdyn.SetMatByGroup(2700, 72e9, 0.33, 3e6, 3e6, 0, 0, 1);

// 定义材料属性 - 螺栓钢 (组号2)
blkdyn.SetMatByGroup(7800, 2.1e11, 0.3, 3e6, 3e6, 5, 10, 2);

// 定义材料属性 - 橡胶垫片 (组号3)
blkdyn.SetMatByGroup(980, 1.2e9, 0.48, 3e6, 3e6, 0, 0, 3);

// 设置接触参数 - 螺栓与螺母螺纹接触
dyna.RunUDFCmd("Contact_SetThreadFriction 0.15");
dyna.RunUDFCmd("Contact_SetNormalStiffness 1e8");

// 设置监测变量 - 螺栓伸长量监测
var monitorPoints = [];
for(var i = 0; i < 3; i++) {
    var x = 0.1 + 0.1 * i;
    var y = 0.1;
    var z = 0.01;
    dyna.Monitor("block", "szz", x, y, z);
    monitorPoints.push([x, y, z]);
}

// 定义拧紧顺序 - 三个螺栓位置
var boltPositions = [
    [0.1, 0.1, 0],
    [0.2, 0.1, 0],
    [0.3, 0.1, 0]
];

// 定义预紧力目标值 (N)
var targetPreload = [5000, 8000, 6000];

// 定义拧紧扭矩序列
var torqueSequence = [
    [0, 0, 0],      // 初始状态
    [10, 0, 0],     // 第一步：拧紧螺栓1
    [20, 0, 0],     // 第二步：继续拧紧螺栓1
    [30, 0, 0],     // 第三步：完成螺栓1
    [15, 10, 0],    // 第四步：开始拧紧螺栓2
    [25, 15, 0],    // 第五步：继续拧紧螺栓2
    [35, 15, 0],    // 第六步：完成螺栓2
    [20, 20, 10],   // 第七步：开始拧紧螺栓3
    [30, 25, 15],   // 第八步：继续拧紧螺栓3
    [40, 25, 15]    // 第九步：完成螺栓3
];

// 执行求解循环 - 模拟拧紧过程
var stepCount = 0;
var maxSteps = torqueSequence.length;

for(var step = 0; step < maxSteps; step++) {
    var currentTorque = torqueSequence[step];

    // 应用当前扭矩载荷
    dyna.RunUDFCmd("ApplyTorque " + currentTorque[0] + " " + currentTorque[1] + " " + currentTorque[2]);

    // 在每个拧紧阶段计算应力
    if(step % 2 === 0) {
        dyna.RunUDFCmd("ComputeStress-mew");

        // 提取螺栓孔附近单元应力
        var stressData = [];
        for(var i = 0; i < monitorPoints.length; i++) {
            var x = monitorPoints[i][0];
            var y = monitorPoints[i][1];
            var z = monitorPoints[i][2];
            dyna.Monitor("block", "szz", x, y, z);
        }

        // 记录当前步骤的预紧力状态
        dyna.RunUDFCmd("RecordPreloadStep " + step);
    }

    // 求解当前步
    dyna.DynaCycle(100);
    stepCount++;
}

// 输出最终应力分布曲线
dyna.RunUDFCmd("ExportStressCurve bolt_hole_stress.csv");
dyna.RunUDFCmd("ExportPreloadData preload_evolution.csv");

// 打印求解完成信息
print("Bolt Tightening Simulation Completed - Steps: " + stepCount);
print("Final Preload Values Recorded");

// 清理资源
dyna.FreeUDF();
