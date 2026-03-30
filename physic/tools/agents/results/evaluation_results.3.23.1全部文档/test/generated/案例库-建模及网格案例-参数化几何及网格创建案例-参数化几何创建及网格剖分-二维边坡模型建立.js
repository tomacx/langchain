setCurDir(getSrcDir());

// ========== 1. 定义边坡几何参数 ==========
var height = 10.0;      // 边坡高度 (m)
var widthBottom = 20.0; // 底部宽度 (m)
var slopeAngle = 30.0;  // 坡角 (度)

// 计算坡顶宽度
var tanAlpha = Math.tan(slopeAngle * Math.PI / 180);
var widthTop = widthBottom - 2 * height * tanAlpha;

// ========== 2. 创建边坡轮廓点 ==========
var size = 0.05; // 节点尺寸

// 定义边坡轮廓的关键点坐标（逆时针方向）
var p1 = [widthBottom/2, 0, 0];                    // 左下角
var p2 = [-widthBottom/2, 0, 0];                   // 右下角
var p3 = [-widthTop/2, height, 0];                 // 左上角
var p4 = [widthTop/2, height, 0];                  // 右上角

// 创建点对象
var id1 = igeo.genPoint(p1[0], p1[1], p1[2], size);
var id2 = igeo.genPoint(p2[0], p2[1], p2[2], size);
var id3 = igeo.genPoint(p3[0], p3[1], p3[2], size);
var id4 = igeo.genPoint(p4[0], p4[1], p4[2], size);

// ========== 3. 创建边坡轮廓线 ==========
var line1 = igeo.genLine(id1, id2); // 底部水平线
var line2 = igeo.genLine(id2, id3); // 左坡面
var line3 = igeo.genLine(id3, id4); // 顶部水平线
var line4 = igeo.genLine(id4, id1); // 右坡面

// ========== 4. 创建边坡轮廓线环 ==========
var lineLoop = [line1, line2, line3, line4];
var lineLoopObj = igeo.genLineLoop(lineLoop);

// ========== 5. 创建边坡表面 ==========
var surface = igeo.genSurface([lineLoopObj], 1);

// ========== 6. 网格剖分 ==========
imeshing.genMeshByGmsh(2);

// ========== 7. 加载网格到求解器 ==========
GetMesh();

// ========== 8. 根据坐标对网格进行分组 ==========
// 底部区域（y < 0.5）- 固定边界
SetGroupByCoord("bottom", [0, -1000, -1000], [0, 0.5, 1000]);

// 坡体主体区域（y > 0.5）- 边坡材料
SetGroupByCoord("slope", [0, 0.5, -1000], [0, height + 1, 1000]);

// ========== 9. 分配材料力学参数 ==========
// 底部固定区域材料（刚性约束）
blkdyn.SetMaterial("bottom", {
    "type": "rigid",
    "density": 2500,
    "youngModulus": 1e10,
    "poissonRatio": 0.3
});

// 边坡主体材料（岩体）
blkdyn.SetMaterial("slope", {
    "type": "elastic",
    "density": 2600,
    "youngModulus": 5e8,
    "poissonRatio": 0.25,
    "shearModulus": 1.923e8
});

// ========== 10. 设置边界条件 ==========
// 底部固定约束
blkdyn.SetBoundary("bottom", {
    "ux": 0,
    "uy": 0,
    "uz": 0
});

// 自由表面（默认不施加约束）

// ========== 11. 配置监测点 ==========
// 坡顶位移监测点
var monitorPointTop = [widthTop/2, height - 0.5, 0];
blkdyn.SetMonitor(monitorPointTop, ["disp", "stress"]);

// 坡脚位移监测点
var monitorPointBottom = [-widthBottom/2 + 1, 0.5, 0];
blkdyn.SetMonitor(monitorPointBottom, ["disp", "stress"]);

// 坡体中部应力监测点
var monitorPointMid = [0, height/2, 0];
blkdyn.SetMonitor(monitorPointMid, ["stress"]);

// ========== 12. 设置重力加速度 ==========
blkdyn.SetGravity([0, -9.81, 0]);

// ========== 13. 执行仿真计算并输出结果 ==========
blkdyn.Solve();

// 输出监测结果
print("=== 边坡仿真完成 ===");
print("坡顶位移: " + blkdyn.GetMonitorResult(monitorPointTop, "disp"));
print("坡脚位移: " + blkdyn.GetMonitorResult(monitorPointBottom, "disp"));
print("坡体中部应力: " + blkdyn.GetMonitorResult(monitorPointMid, "stress"));

// 导出分析报告
blkdyn.ExportReport("slope_analysis_report.txt");
