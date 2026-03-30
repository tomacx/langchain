setCurDir(getSrcDir());

// ========== 1. 几何创建：点云定义 ==========
var Point1 = igeo.genPoint(4, 0, 0, 0.1);
var Point2 = igeo.genPoint(0, 0, 0, 0.1);
var Point3 = igeo.genPoint(0, 2, 0, 0.1);
var Point4 = igeo.genPoint(7, 0, 0, 0.1);
var Point5 = igeo.genPoint(8, 2, 0, 0.1);
var Point6 = igeo.genPoint(10, 0, 0, 0.1);
var Point7 = igeo.genPoint(12, 2, 0, 0.1);
var Point8 = igeo.genPoint(13, -1, 0, 0.1);
var Point9 = igeo.genPoint(15, 1, 0, 0.1);

// ========== 2. Extrude-Point拉伸操作 ==========
var aPoint1 = [Point1, Point2, Point3, Point4, Point5, Point6, Point7, Point8, Point9];
var Ope1 = igeo.extrude("Point", aPoint1, 0, 0, 1, 10, 0.2);

// ========== 3. 网格剖分 ==========
imeshing.genMeshByGmsh(1);

// ========== 4. 网格分组与材料参数设置 ==========
SetGroupByID(1, 1); // 将单元分为一组，组号为1

// 设置用户自定义材料参数（密度、弹性模量、泊松比）
Set UserDefValue(1, [2500.0, 300000000.0, 0.3]); // 密度(kg/m³), 弹性模量(Pa), 泊松比

// ========== 5. 边界条件设置 ==========
// 固定底部节点（假设z=0平面）
SetGroupByPlane(1, 0, 0, 0); // 选择z=0平面的单元组

// ========== 6. 监测点设置 ==========
var MonitorPoint = igeo.genPoint(4, 5, 5, 0.1); // 在模型中心创建监测点

// ========== 7. 求解器设置 ==========
SetTimeStep(0.0001); // 时间步长(s)
SetTotalTime(0.1);   // 总计算时间(s)

// ========== 8. 启动求解与输出结果 ==========
RunSolver();

print("Simulation completed successfully");
