setCurDir(getSrcDir());

mflow.importGrid("GdemGrid","grid.dat");

var rainfall = 56*1e-3 / 3600;

mflow.setRainData([0.0, rainfall, 1e6, rainfall]);

mflow.setParData([0.00020, 0.30, 0.00334, 0.3, 0.0131, 0.40]);

mflow.setValue("Output_Interval", 2000.0);

mflow.setValue("cohesion", 800);
mflow.setValue("friction", 15);
mflow.setValue("MaxTimeStep", 10);

//设置监测点1
mflow.hist("height", 401458, 4.48574e6);
mflow.hist("magvel", 401458, 4.48574e6);
mflow.hist("c", 401458, 4.48574e6);
mflow.hist("dh", 401458, 4.48574e6);

//设置监测点2
mflow.hist("height", 401850, 4.48558e6);
mflow.hist("magvel", 401850, 4.48558e6);
mflow.hist("c", 401850, 4.48558e6);
mflow.hist("dh", 401850, 4.48558e6);

//设置监测点3
mflow.hist("height", 401643, 4.48508e6);
mflow.hist("magvel", 401643, 4.48508e6);
mflow.hist("c", 401643, 4.48508e6);
mflow.hist("dh", 401643, 4.48508e6);

//设置监测点4
mflow.hist("height", 401528, 4.48485e6);
mflow.hist("magvel", 401528, 4.48485e6);
mflow.hist("c", 401528, 4.48485e6);
mflow.hist("dh", 401528, 4.48485e6);

mflow.solve(86400);
