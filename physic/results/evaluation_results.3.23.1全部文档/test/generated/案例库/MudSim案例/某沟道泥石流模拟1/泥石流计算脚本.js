setCurDir(getSrcDir());

// 导入计算网格
mflow.importGrid("GdemGrid", "grid.dat");

// 设置降雨时程曲线
var rainfall = 56 * 1e-3 / 3600;
mflow.setRainData([0.0, rainfall, 1e6, rainfall]);

// 设置颗粒级配曲线
mflow.setParData([0.00020, 0.30, 0.00334, 0.3, 0.0131, 0.40]);

// 设置全局变量Output_Interval为2000.0
mflow.setValue("Output_Interval", 2000.0);

// 添加监测点并记录高度、速度等信息
mflow.hist("height", 401458, 4.48574e6);
mflow.hist("magvel", 401458, 4.48574e6);

// 设置监测点2
mflow.hist("height", 401850, 4.48558e6);
mflow.hist("magvel", 401850, 4.48558e6);

// 设置监测点3
mflow.hist("height", 401643, 4.48508e6);
mflow.hist("magvel", 401643, 4.48508e6);

// 设置监测点4
mflow.hist("height", 401528, 4.48485e6);
mflow.hist("magvel", 401528, 4.48485e6);

// 模拟求解
mflow.solve(86400);

// 导出文本数据
mflow.exportTextData();
