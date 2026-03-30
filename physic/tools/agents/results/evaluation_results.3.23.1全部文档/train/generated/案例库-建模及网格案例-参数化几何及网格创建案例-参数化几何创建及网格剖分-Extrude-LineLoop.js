setCurDir(getSrcDir());

// 清除几何和网格信息（可选，确保环境干净）
igeo.clear();
imeshing.clear();

// ========== 步骤1: 创建控制点定义几何轮廓 ==========
var Point1 = igeo.genPoint(0, 0, 0, 0.1);
var Point2 = igeo.genPoint(3, 0, 0, 0.1);
var Point3 = igeo.genPoint(0, 3, 0, 0.1);
var Point4 = igeo.genPoint(-5, 0, 0, 0.1);
var Point5 = igeo.genPoint(-4, -1, 0, 0.1);
var Point6 = igeo.genPoint(-3, -2.5, 0, 0.1);
var Point7 = igeo.genPoint(-2.5, -1.2, 0, 0.1);
var Point8 = igeo.genPoint(-2, -0.5, 0, 0.1);
var Point9 = igeo.genPoint(0, -3, 0, 0.1);

// ========== 步骤2: 创建不同类型的线段 ==========
var Line1 = igeo.genArc(Point2, Point1, Point3);
var Line2 = igeo.genElliArc(Point3, Point1, Point4, Point4);
var aPoint1 = [Point4, Point5, Point6, Point7];
var Line3 = igeo.genCurvedLine(aPoint1, "spline");
var aPoint2 = [Point7, Point8, Point9];
var Line4 = igeo.genCurvedLine(aPoint2, "bspline");
var Line5 = igeo.genLine(Point9, Point2);

// ========== 步骤3: 创建第一个封闭线环 ==========
var aLine1 = [Line1, Line2, Line3, Line4, Line5];
var LineLoop1 = igeo.genLineLoop(aLine1);

// ========== 步骤4: 创建第二个简单矩形线环（用于对比） ==========
var Point10 = igeo.genPoint(20, 0, 0, 0.1);
var Point11 = igeo.genPoint(23, 0, 0, 0.1);
var Point12 = igeo.genPoint(23, 1, 0, 0.1);
var Point13 = igeo.genPoint(20, 1, 0, 0.1);

var Line6 = igeo.genLine(Point10, Point11);
var Line7 = igeo.genLine(Point11, Point12);
var Line8 = igeo.genLine(Point12, Point13);
var Line9 = igeo.genLine(Point13, Point10);

var aLine2 = [Line6, Line7, Line8, Line9];
var LineLoop2 = igeo.genLineLoop(aLine2);

// ========== 步骤5: 拉伸线环集创建三维实体几何模型 ==========
var aLineLoops = [LineLoop1, LineLoop2];
var Ope1 = igeo.extrude("Line", aLineLoops, 0, 0, 1, 10, 0.2, 2);

// ========== 步骤6: 配置网格剖分参数并调用Gmsh进行网格剖分 ==========
imeshing.genMeshByGmsh(2);

// ========== 步骤7: 将生成的网格加载至块体模块求解器中 ==========
GetMesh();

// ========== 步骤8: 对网格进行分组并赋予材料属性与边界条件 ==========
var Group1 = SetGroupByID(1, "Material1", "Boundary1");
var Group2 = SetGroupByID(2, "Material2", "Boundary2");

// 设置材料参数（示例：弹性模量、泊松比、密度）
SetMaterialParam(Group1, 200e8, 0.3, 2500); // E=200GPa, ν=0.3, ρ=2500kg/m³
SetMaterialParam(Group2, 100e8, 0.25, 2400);

// 设置边界条件（固定约束示例）
SetBoundaryCondition(Group1, "Fixed", [0, 0, 0]);
SetBoundaryCondition(Group2, "Fixed", [0, 0, 0]);

// ========== 步骤9: 配置结果输出选项并执行仿真 ==========
SetOutputOption("Stress", "True");
SetOutputOption("Displacement", "True");
SetOutputOption("Strain", "False");

RunSimulation();

print("Extrude-LineLoop Simulation Finished");
