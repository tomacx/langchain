setCurDir(getSrcDir());

mflow.importGrid("GdemGrid","Grid.dat");

//s  m/s
mflow.setRainData([0.0, 3e-3, 1e6, 3e-3]);

mflow.setParData([0.001, 0.4, 0.005, 0.4, 0.01, 0.2]);

mflow.setValue("Output_Interval", 100.0);

mflow.setValue("InitWaterCont", 0.3);
mflow.setValue("cohesion", 1000);
mflow.setValue("friction", 15.0);
mflow.setValue("MaxTimeStep", 100);

mflow.setValue("ST_a", 10);
mflow.setValue("ST_ad", 10);


mflow.hist("height", 1041.56390976999, 2235.13784461003);
mflow.hist("magvel", 1041.56390976999, 2235.13784461003);


mflow.hist("height", 1764.09022556001,1282.45614035003);
mflow.hist("magvel", 1764.09022556001,1282.45614035003);

mflow.solve(36000.0);

mflow.exportTextData();
