setCurDir(getSrcDir());

// ========== 1. 初始化与参数定义 ==========
var modelLength = 2.0;   // 模型长度 (m)
var modelWidth = 1.5;    // 模型宽度 (m)
var meshSize = 0.05;     // 网格尺寸 (m)

// ========== 2. 创建二维几何模型 ==========
// 定义四个角点坐标
var p1 = [0.0, 0.0, 0.0];
var p2 = [modelLength, 0.0, 0.0];
var p3 = [modelLength, modelWidth, 0.0];
var p4 = [0.0, modelWidth, 0.0];

// 创建点 (半径设为网格尺寸的1/10)
var size = meshSize / 10;
var id1 = igeo.genPoint(p1[0], p1[1], p1[2], size);
var id2 = igeo.genPoint(p2[0], p2[1], p2[2], size);
var id3 = igeo.genPoint(p3[0], p3[1], p3[2], size);
var id4 = igeo.genPoint(p4[0], p4[1], p4[2], size);

// 创建四条边线
var line1 = igeo.genLine(id1, id2);
var line2 = igeo.genLine(id2, id3);
var line3 = igeo.genLine(id3, id4);
var line4 = igeo.genLine(id4, id1);

// 创建线环 (形成封闭边界)
var loop1 = [line1, line2, line3, line4];
var lineLoop = igeo.genLineLoop(loop1);

// 创建面域
var surface = igeo.genSurface([lineLoop], 1);

// ========== 3. 网格剖分 ==========
// 设置二维网格划分参数
imeshing.setValue("MeshType2D", 6); // Frontal网格类型
imeshing.setValue("MeshSize2D", meshSize);

// 借助Gmsh进行网格剖分
imeshing.genMeshByGmsh(2);

// ========== 4. 网格分组与材料属性分配 ==========
// 将网格按区域分组 (例如：左半部分和右半部分)
SetGroupByPlane("X", modelLength / 2, "left");
SetGroupByPlane("X", modelLength / 2, "right");

// 定义材料参数
var mat1 = {
    density: 2500.0,      // 密度 (kg/m³)
    youngModulus: 30e6,   // 弹性模量 (Pa)
    poissonRatio: 0.25,   // 泊松比
    yieldStress: 10e6     // 屈服应力 (Pa)
};

var mat2 = {
    density: 2700.0,      // 密度 (kg/m³)
    youngModulus: 40e6,   // 弹性模量 (Pa)
    poissonRatio: 0.25,   // 泊松比
    yieldStress: 15e6     // 屈服应力 (Pa)
};

// 为不同分组分配材料属性
SetGroupByID("left", mat1);
SetGroupByID("right", mat2);

// ========== 5. 设置边界条件 ==========
// 固定底部边界 (Y=0)
SetGroupByCoord("Y", 0, "bottom");
blkdyn.SetBoundaryCondition("bottom", "fixed");

// 自由面 (默认不施加约束)
// 顶部边界施加垂直向下的重力载荷
blkdyn.SetBodyForce("gravity", [0.0, -9.81, 0.0]);

// ========== 6. 设置监测点与传感器 ==========
// 创建位移监测点 (在模型中心位置)
var monitorPoint = [modelLength / 2, modelWidth / 2, 0.0];
blkdyn.SetMonitorPoint(monitorPoint);

// 创建应力监测截面
blkdyn.SetStressMonitor("X", modelLength / 4);
blkdyn.SetStressMonitor("Y", modelWidth / 4);

// ========== 7. 加载网格至求解器并启动计算 ==========
GetMesh("gmsh", "GDEM.msh");

// 设置求解时间步长与总时长
blkdyn.SetTimeStep(1e-6);
blkdyn.SetTotalTime(0.5);

// 启动计算
blkdyn.Solve();

// ========== 8. 导出结果文件 ==========
blkdyn.ExportResults("results.dat");
blkdyn.ExportMonitorData("monitor.dat");

print("仿真脚本执行完成，结果已导出。");
