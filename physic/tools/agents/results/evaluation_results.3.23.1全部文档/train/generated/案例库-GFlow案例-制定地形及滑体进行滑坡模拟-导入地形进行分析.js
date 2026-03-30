setCurDir(getSrcDir());

// 清除之前的计算数据以重置仿真状态
gflow.clear();

// 设置求解控制参数
gflow.setValue("LastTime", 150.0);
gflow.setValue("CourantCoeff", 0.2);
gflow.setValue("OutputInterval", 200);
gflow.setValue("ParaNum", 32);

// 导入地形网格文件（如存在）或定义自定义网格区域
gflow.importGrid("terrain.dat");

// 设置滑床材料属性（ID=20，密度=0.0，泊松比=0.01）
gflow.setMat(20, 0.0, 0.01);

// 定义多边形滑体区域（根据坐标点定义）
var polygonCoords = new Array(5);
polygonCoords[0] = [0.0, 0.0];
polygonCoords[1] = [100.0, 0.0];
polygonCoords[2] = [100.0, 80.0];
polygonCoords[3] = [50.0, 90.0];
polygonCoords[4] = [-50.0, 80.0];

gflow.setSlidingBodyByPolygon(polygonCoords, 10, 0);

// 在关键位置设置厚度监测点以记录时程信息
gflow.hist("Thickness", 50.0, 45.0);
gflow.hist("Thickness", 75.0, 60.0);
gflow.hist("Thickness", 25.0, 30.0);

// 导出当前网格状态以便后续分析使用
gflow.exportGrid();

// 绘制监测点历史曲线图
gflow.drawHistPos();

// 调用求解器执行滑坡动力学计算过程
gflow.solve();

// 打印完成提示
print("Solution is OK!");
