setCurDir(getSrcDir());

// 初始化环境并清除旧数据
gflow.clear();

// 设置全局求解参数
gflow.setValue("LastTime", 1000.0);
gflow.setValue("CourantCoeff", 0.2);
gflow.setValue("OutputInterval", 100);
gflow.setValue("ParaNum", 32);

// 定义计算域网格范围（可根据实际地形调整）
gflow.defGrid(0, 1332, 0, 1280, 100, 96);

// 导入地形网格文件
gflow.importGrid("landslide.dat");

// 设置滑坡体材料属性（密度、粘度等参数）
gflow.setMat(20, 0.0, 0.0);

// 定义滑坡体几何形状（椭圆函数定义，可根据需要改为多边形）
var center = [605.455, 471.579];
var radiusX = 100;
var radiusY = 80;
gflow.setSlidingBodyByEllipsoid(center[0], center[1], radiusX, radiusY, 20, 0);

// 设置滑坡体初始厚度分布监测点
gflow.hist("Thickness", 605.455, 471.579);
gflow.hist("Thickness", 753.455, 633.263);

// 导出当前配置的网格模型
gflow.exportGrid();

// 绘制厚度监测点位置（可选）
gflow.drawHistPos();

// 调用求解器执行滑坡运动演化模拟
gflow.solve();

// 打印提示信息确认计算完成
print("Solution is OK!");
