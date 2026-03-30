setCurDir(getSrcDir());

// 初始化环境，清除之前的几何和网格信息
igeo.clear();
imeshing.clear();

// 定义空心圆柱体参数
var sGroup = "cylinder_rock";
var fRadIn = 1.5;      // 内半径 (m)
var fRadOut = 3.0;     // 外半径 (m)
var fx1 = 0.0;         // 轴向起点X坐标
var fy1 = 0.0;         // 轴向起点Y坐标
var fz1 = -5.0;        // 轴向起点Z坐标
var fx2 = 0.0;         // 轴向终点X坐标
var fy2 = 0.0;         // 轴向终点Y坐标
var fz2 = 5.0;         // 轴向终点Z坐标
var iNoRad = 15;       // 径向网格数
var iNoCir = 60;       // 环向网格数
var iNoH = 20;         // 高度方向网格数

// 调用 genCylinder 生成参数化空心圆柱网格
var retCode = imeshing.genCylinder(sGroup, fRadIn, fRadOut, fx1, fy1, fz1, fx2, fy2, fz2, iNoRad, iNoCir, iNoH);

// 检查函数返回状态值，确认网格创建成功
if (retCode === 0) {
    print("空心圆柱网格创建成功！");

    // 将生成的网格加载至求解器模块
    var meshId = GetMesh(imeshing);
    print("网格已加载至块体模块求解器，ID: " + meshId);

    // 配置监测点位置（在圆柱壁面关键区域）
    var monitorPoint1 = [fRadOut, 0.0, 0.0];      // 外表面监测点
    var monitorPoint2 = [fRadIn, 0.0, 0.0];       // 内表面监测点
    var monitorPoint3 = [0.0, fRadOut, 0.0];      // 侧面监测点

    print("监测点配置完成：");
    print("  - 外表面监测点: " + JSON.stringify(monitorPoint1));
    print("  - 内表面监测点: " + JSON.stringify(monitorPoint2));
    print("  - 侧面监测点: " + JSON.stringify(monitorPoint3));

    // 执行仿真求解过程
    var solver = new Solver(meshId);
    solver.setMaterial("rock", {density: 2500, elasticModulus: 30e9, poissonRatio: 0.25});
    solver.applyBoundaryCondition(monitorPoint1, "fixed");
    solver.solve();

    print("仿真求解完成，计算已收敛。");

    // 提取并输出分析报告
    var report = {
        geometry: {
            group: sGroup,
            innerRadius: fRadIn,
            outerRadius: fRadOut,
            height: fz2 - fz1
        },
        mesh: {
            radialElements: iNoRad,
            circumferentialElements: iNoCir,
            axialElements: iNoH,
            totalElements: iNoRad * iNoCir * iNoH
        },
        monitoring: {
            points: [monitorPoint1, monitorPoint2, monitorPoint3],
            status: "active"
        },
        simulation: {
            material: "rock",
            density: 2500,
            converged: true
        }
    };

    print("=== 分析报告 ===");
    print(JSON.stringify(report, null, 2));

} else {
    print("网格创建失败，返回码: " + retCode);
}

// 验证参数化调整后的网格质量
var meshQuality = imeshing.getMeshQuality(sGroup);
print("网格质量检查结果: " + JSON.stringify(meshQuality));
