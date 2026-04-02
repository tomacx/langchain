setCurDir(getSrcDir());

// 清除现有数据以准备新仿真
gflow.clear();

// 设置求解参数
gflow.setValue("LastTime", 1500.0);
gflow.setValue("CourantCoeff", 0.2);
gflow.setValue("OutputInterval", 200);
gflow.setValue("ParaNum", 32);

// 导入滑床及滑体的网格文件
gflow.importGrid("data.txt");

// 定义椭球形滑体
gflow.setSlidingBodyByEllipsoid(8.86259e+06, 2.9276e+06, 100, 100, 100, 0);

// 设定监测点以记录时程信息
gflow.hist("Thickness", 8.86251e+06, 2.9273e+06);
gflow.hist("Thickness", 8.86272e+06, 2.92745e+06);

// 导出计算结果
gflow.exportGrid();

// 执行求解步骤以计算结果
gflow.solve();

// 绘制监测点历史位置
gflow.drawHistPos();

// 打印提示信息
print("Solution is OK!");
