setCurDir(getSrcDir());

// 初始化：创建基础点集
var Point1 = igeo.genPoint(4, -2.0, 0, 0.3);
var Point2 = igeo.genPoint(4, 2.0, 0, 0.3);
var Point3 = igeo.genPoint(-2.0, 2.0, 0, 0.3);
var Point4 = igeo.genPoint(-2.0, -2.0, 0, 0.3);

// 创建封闭线环（矩形轮廓）
var Line1 = igeo.genLine(Point1, Point2);
var Line2 = igeo.genLine(Point2, Point3);
var Line3 = igeo.genLine(Point3, Point4);
var Line4 = igeo.genLine(Point4, Point1);

// 创建表面（面）
var aLine = [Line1, Line2, Line3, Line4];
var Surface1 = igeo.genSurface(aLine, 2);

// 旋转操作：绕原点旋转-30度
var Ope1 = igeo.rotate("Surface", [Surface1], -30, 0, 0, 0, 0, 0, 1.0, 0.5);

// 网格剖分（借助Gmsh）
imeshing.genMeshByGmsh(2);

// 设置分组：按ID对网格单元进行分组
var Group1 = imeshing.SetGroupByID("Surface_Group", [1]);

// 加载网格到块体模块求解器
GetMesh();

// 设置监测点（在旋转后的表面中心位置）
var MonitorPoint = [0, 0, 0];
SetMonitorPoint(MonitorPoint);

// 设置输出配置参数
SetOutputConfig("displacement", "stress", "velocity");

// 执行仿真计算，设定时间步长
SetTimeStep(1e-6);
RunSimulation();

// 获取并导出结果
GetResultData();
ExportToFile("simulation_result.dat");

print("Parameterized Geometry Rotation-Surface Simulation Finished");
