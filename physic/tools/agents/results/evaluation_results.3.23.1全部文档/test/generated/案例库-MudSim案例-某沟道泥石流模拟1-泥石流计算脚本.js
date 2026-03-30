setCurDir(getSrcDir());

// 导入计算网格
mflow.importGrid("GdemGrid", "grid.dat");

// 设置降雨时程曲线 [时间起点, 降雨强度(m/s), 持续时间(s), 降雨强度]
mflow.setRainData([0.0, 5e-3, 1e6, 5e-3]);

// 设置颗粒级配曲线参数
mflow.setParData([0.002, 0.35, 0.005, 0.45, 0.015, 0.5]);

// 设置输出间隔（秒）
mflow.setValue("Output_Interval", 100.0);

// 设置临时文件输出选项
mflow.setValue("TempFile_Out", 1);

// 设置Tecplot文件输出选项
mflow.setValue("TecFile_Out", 1);

// 设置初始含水量（可选）
mflow.setValue("InitWaterCont", 0.3);

// 设置粘聚力 (Pa)
mflow.setValue("cohesion", 800);

// 设置摩擦系数
mflow.setValue("friction", 15.0);

// 设置最大时间步长
mflow.setValue("MaxTimeStep", 10);

// 设置监测点1（坐标x, y）
mflow.hist("height", 401458, 4.48574e6);
mflow.hist("magvel", 401458, 4.48574e6);
mflow.hist("c", 401458, 4.48574e6);
mflow.hist("dh", 401458, 4.48574e6);

// 设置监测点2
mflow.hist("height", 401850, 4.48558e6);
mflow.hist("magvel", 401850, 4.48558e6);
mflow.hist("c", 401850, 4.48558e6);
mflow.hist("dh", 401850, 4.48558e6);

// 设置监测点3
mflow.hist("height", 401643, 4.48508e6);
mflow.hist("magvel", 401643, 4.48508e6);
mflow.hist("c", 401643, 4.48508e6);
mflow.hist("dh", 401643, 4.48508e6);

// 设置监测点4
mflow.hist("height", 401528, 4.48485e6);
mflow.hist("magvel", 401528, 4.48485e6);
mflow.hist("c", 401528, 4.48485e6);
mflow.hist("dh", 401528, 4.48485e6);

// 执行核心求解过程（时间单位：秒）
mflow.solve(86400);

// 输出最终计算结果文本数据
mflow.exportTextData();
