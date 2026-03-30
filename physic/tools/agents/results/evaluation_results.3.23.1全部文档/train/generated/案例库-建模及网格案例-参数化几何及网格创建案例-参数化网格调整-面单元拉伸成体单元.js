setCurDir(getSrcDir());

// 清除之前的几何和网格信息
igeo.clear();
imeshing.clear();

// ========== 1. 创建参数化二维表面几何 ==========
// 创建一个矩形表面 (x:0-10, y:0-10, z=0)
var rectSurface = igeo.genRectS(0, 0, 0, 10, 10, 0, 0.5, 1);

// 创建一个圆形表面 (圆心:20,0,0, 半径:5, z=0)
var circleSurface = igeo.genCircleS(20, 0, 0, 5, 0.5, 2);

// ========== 2. 生成二维网格 ==========
imeshing.genMeshByGmsh(2);

// ========== 3. 将面单元拉伸成体单元 ==========
// extrude参数: dx, dy, dz, 拉伸高度
imeshing.extrude(0, 0, 5, 10);

// ========== 4. 调整网格密度（可选） ==========
// 如果需要调整特定方向的节点分割，可使用以下方法
// imeshing.MoveGrid([x_offset], [y_offset], [z_offset]);

// ========== 5. 对生成的体单元进行分组 ==========
// 获取所有单元的ID列表
var allElements = imeshing.GetElementIDs();

// 将矩形区域拉伸的单元分为一组 (ID范围: 1-200)
imeshing.SetGroupByID(1, 200);

// 将圆形区域拉伸的单元分为另一组 (ID范围: 201-400)
imeshing.SetGroupByID(201, 400);

// ========== 6. 设置材料属性 ==========
// 为第一组单元设置弹性材料参数
var matParams1 = [210e8, 0.3, 2500]; // E=210GPa, v=0.3, rho=2500kg/m³
imeshing.SetMaterial(1, matParams1);

// 为第二组单元设置不同材料参数
var matParams2 = [200e8, 0.25, 2400]; // E=200GPa, v=0.25, rho=2400kg/m³
imeshing.SetMaterial(2, matParams2);

// ========== 7. 设置边界条件 ==========
// 固定底部面 (z=0) 的位移自由度
var bottomNodes = imeshing.GetNodeIDsByPlane(0, 0, 0, 1e-6);
imeshing.SetBoundaryCondition(bottomNodes, [0, 0, 0]);

// 施加顶部面 (z=5) 的法向压力
var topNodes = imeshing.GetNodeIDsByPlane(0, 0, 5, 1e-6);
imeshing.SetBoundaryCondition(topNodes, [0, 0, -1e5]); // 压力-1e5 Pa

// ========== 8. 配置监测点 ==========
// 在几何中心设置位移监测点
var centerPoint = imeshing.GenPoint(10, 5, 2.5);
imeshing.SetMonitor(centerPoint, "disp");

// 在矩形区域中心设置应力监测点
var stressPoint = imeshing.GenPoint(5, 5, 2.5);
imeshing.SetMonitor(stressPoint, "stress");

// ========== 9. 求解设置 ==========
// 设置时间步长
imeshing.SetTimeStep(1e-6);

// 设置总计算时间
imeshing.SetTotalTime(0.1);

// 设置输出频率
imeshing.SetOutputFrequency(100);

// ========== 10. 执行求解 ==========
imeshing.Solve();

// ========== 11. 导出结果 ==========
// 导出位移结果
imeshing.ExportResults("displacement.dat");

// 导出应力结果
imeshing.ExportResults("stress.dat");

// 导出监测数据
imeshing.ExportMonitorData("monitor.dat");

// 输出完成信息
console.log("仿真计算完成，结果已导出。");
