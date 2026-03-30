setCurDir(getSrcDir());

// 创建多个圆柱体体积
var Volume1 = igeo.genCylinderV(0, 0, 0, 0, 5, 0, 0, 5, 0, 1, 1);
var Volume2 = igeo.genCylinderV(0, 5, 0, 0, 10, 0, 0, 5, 0, 1, 2);
var Volume3 = igeo.genCylinderV(0, 10, 0, 0, 15, 0, 0, 4, 0, 0.5, 3);

// 创建长方体体积
var Volume4 = igeo.genBrickV(40, 0, 0, 45, 10, 5, 1, 5);
var Volume5 = igeo.genBrickV(45, 0, 0, 60, 10, 5, 1, 6);
var Volume6 = igeo.genBrickV(60, 0, 0, 70, 15, 8, 1.5, 7);

// 创建椭球体体积
var Volume7 = igeo.genEllipSoidV(20, 0, 0, 5, 3, 2, 0.5, 4, 0, 0, 0);

// 组合所有体积对象
var aVolume1 = [Volume1, Volume2, Volume3, Volume4, Volume5, Volume6, Volume7];

// 执行旋转复制操作：对坐标范围内的颗粒进行旋转
// 参数：操作类型"Volume", 体积数组, 旋转角度, 原点坐标, 轴方向, 选择范围
var Ope1 = igeo.rotaCopy("Volume", aVolume1, -20, -10, 0, -30, 0, 5, 60, 5);

// 借助Gmsh进行三维网格剖分
imeshing.genMeshByGmsh(3);

// 设置监测点记录关键物理量
var MonitorPoint = imeshing.SetMonitorPoint([10.0, 10.0, 10.0]);
var MonitorVar = imeshing.SetMonitorVar(["Velocity", "Stress", "Displacement"]);

// 输出执行状态
print("Geometry created and rotated successfully");
print("Mesh generation completed with Gmsh");
print("Monitoring points configured");
print("Finished");
