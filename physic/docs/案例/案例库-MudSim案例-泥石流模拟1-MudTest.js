setCurDir(getSrcDir());

mflow.importGrid("GdemGrid","ModelFinal.dat");

mflow.setRainData([0.0, 1e-3, 1e6, 1e-3]);

mflow.setParData([0.005, 0.2, 0.01, 0.4, 0.1, 0.4]);

mflow.setValue("Output_Interval", 10.0);

mflow.setValue("TempFile_Out", 1);
mflow.setValue("TecFile_Out", 1);

mflow.hist("height", 1041.56390976999, 2235.13784461003);
mflow.hist("magvel", 1041.56390976999, 2235.13784461003);


mflow.hist("height", 1764.09022556001,1282.45614035003);
mflow.hist("magvel", 1764.09022556001,1282.45614035003);

mflow.solve(120.0);

mflow.exportTextData();