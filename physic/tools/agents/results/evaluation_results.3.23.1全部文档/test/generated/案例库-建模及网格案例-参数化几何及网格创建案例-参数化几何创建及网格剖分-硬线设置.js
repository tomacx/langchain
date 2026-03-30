setCurDir(getSrcDir());
igeo.clear();
imeshing.clear();

// 创建参数化几何模型 - 矩形域
var id = igeo.genRectS(0, 0, 0, 10.0, 10.0, 0, 0.2, 1);

// 设置硬线边界条件 - 将四条边设为硬线
igeo.setHardLineToFace(1, 1);
igeo.setHardLineToFace(2, 1);
igeo.setHardLineToFace(3, 1);
igeo.setHardLineToFace(4, 1);

// 网格剖分 - 借助Gmsh进行网格划分
imeshing.genMeshByGmsh(2);

// 获取已生成的网格并加载至求解器
GetMesh();

// 配置监测点位置及输出变量
var monitorPoint = [5.0, 5.0, 0.0];
print("Monitor point set at: " + monitorPoint.join(", "));

// 设置仿真时间步长、总时长及收敛判据等求解参数
setTimeStep(1e-6);
setTotalTime(0.1);
setConvergenceCriterion(1e-5);

// 输出脚本执行状态
print("Parameterized geometry and mesh generation completed successfully");
print("Hard line boundary conditions applied to all faces");
print("Simulation ready for execution");
