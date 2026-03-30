setCurDir(getSrcDir());

// 清理现有仿真数据
gflow.clear();

// 配置全局仿真参数
gflow.setValue("LastTime", 1500.0);
gflow.setValue("CourantCoeff", 0.2);
gflow.setValue("OutputInterval", 200);
gflow.setValue("ParaNum", 32);

// 导入地形网格文件（示例文件名，实际使用时需替换）
gflow.importGrid("terrain.dat");

// 设置滑体材料属性（组号、密度、弹性模量、泊松比等）
gflow.setMat(10, 2000.0, 0.3);

// 定义椭球形滑体（中心坐标、半径、厚度等参数）
gflow.setSlidingBodyByEllipsoid(8.86259e+06, 2.9276e+06, 100, 100, 100, 0, 0);

// 设置监测点（厚度变化）
gflow.hist("Thickness", 8.86251e+06, 2.9273e+06);
gflow.hist("Thickness", 8.86272e+06, 2.92745e+06);

// 导出网格配置以确保数据一致性
gflow.exportGrid();

// 执行求解器计算
gflow.solve();

// 导入计算结果用于后续分析
gflow.resultImport();

// 绘制监测点历史曲线
gflow.drawHistPos();

// 打印执行状态提示
print("Solution is OK!");
