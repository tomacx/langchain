setCurDir(getSrcDir());

// 初始化脚本环境并清除现有数据
gflow.clear();

// 设置求解时间参数为20秒
gflow.setValue("LastTime", 20.0);
gflow.setValue("CourantCoeff", 0.2);
gflow.setValue("OutputInterval", 100);
gflow.setValue("ParaNum", 32);

// 导入地形网格文件landslide.dat
gflow.importGrid("landslide.dat");

// 定义滑坡体椭球参数以模拟滑坡行为
gflow.setSlidingBodyByEllipsoid(-93, 37, 20, 15, 20, 0);

// 设定监测点位置以记录厚度变化
gflow.hist("Thickness", 605.455, 471.579);
gflow.hist("Thickness", 753.455, 633.263);

// 输出计算过程中的网格信息以便后续分析
gflow.exportGrid();

// 执行GFlow核心求解流程并监控结果
gflow.solve();

// 打印提示信息
print("Solution is OK!");
