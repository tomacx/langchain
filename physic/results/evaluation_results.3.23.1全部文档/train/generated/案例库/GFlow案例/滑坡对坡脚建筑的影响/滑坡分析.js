setCurDir(getSrcDir());

// 清除现有数据和设置
gflow.clear();

// 设定求解时间为20秒
gflow.setValue("LastTime", 20.0);

// 导入地形网格文件
gflow.importGrid("landslide.dat");

// 定义滑坡体参数并使用椭球体模型设置滑坡体
gflow.setSlidingBodyByEllipsoid(-93, 37, 20, 15, 20, 0);

// 添加厚度监测点以监控滑坡过程中的堆积厚度变化
gflow.hist("Thickness", 605.455, 471.579);
gflow.hist("Thickness", 753.455, 633.263);

// 导出当前计算网格状态
gflow.exportGrid();

// 执行GFlow模拟计算
gflow.solve();

// 输出解决方案完成的提示信息
print("Solution is OK!");
