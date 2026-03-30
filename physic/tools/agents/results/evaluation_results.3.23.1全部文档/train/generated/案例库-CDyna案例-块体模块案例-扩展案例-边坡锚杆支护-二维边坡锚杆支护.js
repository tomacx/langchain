setCurDir(getSrcDir());

// 设置全局计算开关
dyna.Set("Mechanic_Cal 1");
dyna.Set("If_Cal_Bar 0");
dyna.Set("Bar_Out 1");
dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 0");
dyna.Set("Output_Interval 500");
dyna.Set("Moniter_Iter 100");

// 定义边坡几何尺寸
var size = 0.3;
var slopeH = 20.0;
var slopeAngle = 45.0;
var slopeL = slopeH / Math.tan(slopeAngle / 180.0 * Math.PI);
var leftPlatform = 5.0;
var rightPlatform = 8.0;

// 创建边坡多边形面
var aCoord = new Array(6);
acoord[0] = [0, 0, 0, size];
acoord[1] = [slopeL + leftPlatform, 0, 0, size];
acoord[2] = [slopeL + leftPlatform, slopeH, 0, size];
acoord[3] = [leftPlatform, slopeH, 0, size];
acoord[4] = [leftPlatform, slopeH * Math.sin(slopeAngle / 180.0 * Math.PI), 0, size];
acoord[5] = [0, slopeH * Math.sin(slopeAngle / 180.0 * Math.PI), 0, size];

igeo.genPloygenS(acoord, 1);

// 划分二维网格
imeshing.genMeshByGmsh(2);

// 从平台读取网格
blkdyn.GetMesh(imeshing);

// 设置计算本构为线弹性模型
blkdyn.SetModel("linear");

// 设置边坡材料参数（密度、弹性模量、泊松比、抗拉强度、抗压强度、粘聚力、内摩擦角）
blkdyn.SetMat(2500, 3e8, 0.25, 3e4, 1e4, 25.0, 10.0);

// 固定底部边界条件（X方向约束）
blkdyn.FixV("x", 0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0, "x", slopeL + leftPlatform - 0.01, slopeL + leftPlatform + 0.01);

// 固定底部边界条件（Y方向约束）
blkdyn.FixV("y", 0, "y", -0.001, 0.001);

// 设置锚索参数
var anchorCount = 3;
var anchorSpacing = slopeL / (anchorCount + 1);

for(var i = 1; i <= anchorCount; i++) {
    // 计算锚索位置（沿坡面布置）
    var x1 = leftPlatform + i * anchorSpacing;
    var y1 = slopeH - Math.tan(slopeAngle / 180.0 * Math.PI) * (x1 - leftPlatform);

    // 锚索上端点坐标（坡面内）
    var fArrayCoord1 = [x1, y1, 0];

    // 锚索下端点坐标（坡外固定点）
    var x2 = x1 - 5.0;
    var y2 = y1 - 3.0;
    var fArrayCoord2 = [x2, y2, 0];

    // 创建锚索单元
    bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);
}

// 设置所有锚索的力学模型为可破坏模型
bar.SetModelByID("failure", 1, 100);

// 定义锚索材料参数（自由段和锚固段）
var BarPropFree = [1e-2, 7800.0, 1e10, 0.25, 235e6, 235e6, 0.0, 0.0, 1e9, 0.8, 0.0];
var BarPropAnchor = [1e-2, 7800.0, 1e10, 0.25, 235e6, 235e6, 1e6, 35, 1e9, 0.8, 0.0];

// 为每根锚索设置材料属性（简化处理，统一设置）
for(var i = 1; i <= anchorCount; i++) {
    bar.SetPropByID(BarPropFree, i, 1, 15);
    bar.SetPropByID(BarPropAnchor, i, 16, 20);
}

// 在每根锚索的第一个节点上施加预应力，为10kN
for(var i = 1; i <= anchorCount; i++) {
    bar.ApplyPreTenForce(1e4, i, 1, 1, 1);
}

// 设置监测点（位移和应力）
dyna.Monitor("block", "xdis", leftPlatform + anchorSpacing, slopeH - Math.tan(slopeAngle / 180.0 * Math.PI) * (anchorSpacing), 0);
dyna.Monitor("block", "ydis", leftPlatform + anchorSpacing * 2, slopeH - Math.tan(slopeAngle / 180.0 * Math.PI) * (anchorSpacing * 2), 0);
dyna.Monitor("block", "xdis", leftPlatform + anchorSpacing * 3, slopeH - Math.tan(slopeAngle / 180.0 * Math.PI) * (anchorSpacing * 3), 0);

// 设置锚索应力监测
for(var i = 1; i <= anchorCount; i++) {
    dyna.Monitor("bar", "sxx", i, 1, 0);
}

// 计算前初始化
dyna.BeforeCal();

// 循环求解
for(var step = 0; step < 5000; step++) {
    // 集成核心计算
    var unbal = blkdyn.Solver();

    // 计算单元变形力
    blkdyn.CalBlockForce();

    // 计算节点运动
    blkdyn.CalNodeMovement();

    // 输出监测信息
    dyna.OutputMonitorData();

    // 每隔100步推送信息
    if(step != 0 && step % 100 == 0) {
        print("不平衡率：" + unbal);
        print("当前时步：" + step);

        // 推送结果信息至GDEM-Env
        dyna.PutStep(1, step, 0.1);
    }
}

// 输出最终监测数据
dyna.OutputMonitorData();
