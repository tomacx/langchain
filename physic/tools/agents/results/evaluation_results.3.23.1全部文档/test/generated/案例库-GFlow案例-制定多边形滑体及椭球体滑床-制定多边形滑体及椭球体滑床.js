setCurDir(getSrcDir());

// 初始化仿真环境
gflow.clear();

// 设置求解器控制参数
gflow.setValue("LastTime", 20.0);
gflow.setValue("CourantCoeff", 0.2);
gflow.setValue("OutputInterval", 100);
gflow.setValue("ParaNum", 32);

// 导入基础地形网格文件
gflow.importGrid("terrain.dat");

// 设置滑体材料（组号）
gflow.setMat(30, 0.0, 0.0);

// 创建多边形滑体模型
var polygonCoords = new Array(6);
polygonCoords[0] = [-24.834, 30.4117];
polygonCoords[1] = [-27.2767, 37.7105];
polygonCoords[2] = [-27.2767, 49.0642];
polygonCoords[3] = [-17.5059, 45.8203];
polygonCoords[4] = [-11.8063, 37.7105];
polygonCoords[5] = [-15.0, 37.7105];

gflow.setSlidingBodyByPolygon(polygonCoords, 10, 1);

// 创建椭球体滑床模型
gflow.setSlidingBodyByEllipsoid(-93, 37, 20, 15, 20, 0);

// 设置监测点记录厚度时程信息
gflow.hist("Thickness", 605.455, 471.579);
gflow.hist("Thickness", 753.455, 633.263);

// 导出计算后的网格及结果数据文件
gflow.exportGrid();

// 执行求解
gflow.solve();

// 绘制监测点的历史曲线图
gflow.drawHistPos();

// 打印提示信息
print("Solution is OK!");
