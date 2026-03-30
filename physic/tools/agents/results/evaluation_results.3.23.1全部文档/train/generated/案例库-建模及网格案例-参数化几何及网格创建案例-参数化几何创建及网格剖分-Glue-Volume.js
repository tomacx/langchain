setCurDir(getSrcDir());

// ========== 1. 参数化几何创建 ==========
// 创建基础点
var P1 = igeo.genPoint(0, 0, 0, 0.1);
var P2 = igeo.genPoint(10, 0, 0, 0.1);
var P3 = igeo.genPoint(10, 5, 0, 0.1);
var P4 = igeo.genPoint(0, 5, 0, 0.1);

// 创建矩形线环（底面）
var Line1 = igeo.genLine(P2, P1);
var Line2 = igeo.genLine(P3, P2);
var Line3 = igeo.genLine(P4, P3);
var Line4 = igeo.genLine(P1, P4);
var aLineBottom = [Line1, Line2, Line3, Line4];
var LineLoopBottom = igeo.genLineLoop(aLineBottom);

// 创建顶面线环（偏移Z方向）
var P5 = igeo.genPoint(0, 0, 10, 0.1);
var P6 = igeo.genPoint(10, 0, 10, 0.1);
var P7 = igeo.genPoint(10, 5, 10, 0.1);
var P8 = igeo.genPoint(0, 5, 10, 0.1);

var Line5 = igeo.genLine(P6, P5);
var Line6 = igeo.genLine(P7, P6);
var Line7 = igeo.genLine(P8, P7);
var Line8 = igeo.genLine(P5, P8);
var aLineTop = [Line5, Line6, Line7, Line8];
var LineLoopTop = igeo.genLineLoop(aLineTop);

// 创建侧面线环
var Line9 = igeo.genLine(P1, P5);
var Line10 = igeo.genLine(P2, P6);
var Line11 = igeo.genLine(P3, P7);
var Line12 = igeo.genLine(P4, P8);
var aLineSide = [Line9, Line10, Line11, Line12];
var LineLoopSide = igeo.genLineLoop(aLineSide);

// 创建底面
var SurfaceBottom = igeo.genSurface([LineLoopBottom], 1);

// 创建顶面
var SurfaceTop = igeo.genSurface([LineLoopTop], 1);

// 创建侧面
var SurfaceSide = igeo.genSurface([LineLoopSide], 1);

// 执行面的粘接操作生成体
var Ope1 = igeo.glue("Surface", [SurfaceBottom, SurfaceTop, SurfaceSide]);

// ========== 2. 网格剖分 ==========
// 调用Gmsh进行三维网格剖分，文件名自定义为"myVolumeMesh"
imeshing.genMeshByGmsh(3, "myVolumeMesh");

// ========== 3. MieGrueisen材料属性设置 ==========
// 设置全局MieGrueisen材料参数（铝材典型参数）
pdyna.SetMGMat(1, 2703, 5350, 1.34, 1.97, 1.5);

// ========== 4. 输出监测点配置 ==========
// 设置压力监测点（在几何中心位置）
var MonitorPoint = [5, 2.5, 5];
gflow.SetMonitorPoint(MonitorPoint, "Pressure");

// 设置位移监测点
gflow.SetMonitorPoint(MonitorPoint, "Displacement");

// ========== 5. 执行求解 ==========
// 计算到10秒
gflow.sovle(10.0);

print("Simulation completed successfully.");
