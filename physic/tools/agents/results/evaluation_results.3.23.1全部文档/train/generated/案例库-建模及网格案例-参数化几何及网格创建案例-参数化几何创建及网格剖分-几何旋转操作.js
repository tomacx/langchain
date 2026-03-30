setCurDir(getSrcDir());

// ========== 1. 初始化与参数定义 ==========
var radius = 2.0;      // 圆柱半径 (m)
var height = 4.0;      // 圆柱高度 (m)
var nDivX = 20;        // X方向节点分割数
var nDivY = 20;        // Y方向节点分割数
var nDivZ = 15;        // Z方向节点分割数

// ========== 2. 创建参数化几何体（圆柱） ==========
var cylinder = igeo.genCylinderV(0, 0, 0, radius, height, 0, 1, 1, 0.1);

// ========== 3. 网格划分设置 ==========
imeshing.setValue("MeshType3D", 1); // 设置三维网格类型

// ========== 4. 生成网格并导入至imeshing模块 ==========
imeshing.genMeshByGmsh(3);

// ========== 5. 旋转网格操作 ==========
var rotateAngle = 45;      // 旋转角度 (度)
var axisX = 0;             // 旋转轴X坐标
var axisY = 0;             // 旋转轴Y坐标
var axisZ = 0;             // 旋转轴Z坐标

RotateGrid(cylinder, axisX, axisY, axisZ, rotateAngle);

// ========== 6. 网格分组设置 ==========
SetGroupByID(cylinder, "RotatedCylinder");

// ========== 7. 配置输出监测参数 ==========
var outputDir = getSrcDir();
var resultFile = outputDir + "/simulation_results.dat";

// 设置位移监测
imeshing.setValue("OutputDisplacement", true);

// 设置应力监测
imeshing.setValue("OutputStress", true);

// 设置时间步长
var dt = 1e-6;             // 时间步长 (s)
var totalTime = 0.1;       // 总仿真时间 (s)

// ========== 8. 定义计算域网格（可选，用于流体耦合） ==========
skwave.DefMesh(3, [radius*2+height, radius*2+height, height],
               [nDivX, nDivY, nDivZ]);

// ========== 9. 求解设置与执行 ==========
var solver = CDyna.NewSolver();
solver.SetTimeStep(dt);
solver.SetTotalTime(totalTime);
solver.AddGroup("RotatedCylinder");
solver.Solve();

// ========== 10. 导出结果文件 ==========
CDyna.ExportMesh(resultFile);
CDyna.ExportMonitorData(resultFile + "_monitor.dat");

print("仿真完成，结果已导出至: " + resultFile);
