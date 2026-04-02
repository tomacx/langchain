setCurDir(getSrcDir());

// 清除现有数据和设置
gflow.clear();

// 导入地形网格文件以定义计算区域
gflow.importGrid("data.txt");

// 设定模拟参数包括求解时间、输出间隔及并行核数
gflow.setValue("LastTime", 1500.0);
gflow.setValue("CourantCoeff", 0.2);
gflow.setValue("OutputInterval", 200);
gflow.setValue("ParaNum", 32);

// 定义滑坡体的位置与尺寸（椭球体）
gflow.setSlidingBodyByEllipsoid(8.86259e+06, 2.9276e+06, 100, 100, 100, 0, 0);

// 添加监测点以记录滑坡厚度变化
gflow.hist("Thickness", 8.86251e+06, 2.9273e+06);
gflow.hist("Thickness", 8.86272e+06, 2.92745e+06);

// 导出当前的网格数据用于后续分析
gflow.exportGrid();

// 执行滑坡运动模拟计算过程
gflow.solve();

// 绘制监测点的历史位置数据以便结果可视化
gflow.drawHistPos();

// 输出提示信息确认解决方案完成
print("Solution is OK!");
