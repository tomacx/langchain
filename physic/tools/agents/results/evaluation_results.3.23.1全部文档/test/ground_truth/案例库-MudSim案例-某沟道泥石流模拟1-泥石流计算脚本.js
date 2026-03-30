setCurDir(getSrcDir());

mflow.importGrid("GdemGrid","grid.dat");

//  50mm/h
var rainfall = 50 *1e-3 / 3600.0;

mflow.setRainData([0.0, rainfall, 1e6, rainfall]);

mflow.setParData([0.0005, 0.6, 0.002, 0.3, 0.006, 0.1]);

mflow.setValue("Output_Interval", 100.0);

mflow.setValue("InitWaterCont", 0.03);
mflow.setValue("cstable", 0.01);
mflow.setValue("cohesion", 1e1);
mflow.setValue("friction", 10.0);
mflow.setValue("MaxTimeStep", 100);

mflow.setValue("ST_a", 10);
mflow.setValue("ST_ad", 10);
mflow.setValue("ST_h0", 1e-5)

mflow.hist("height", 523928.1, 381250.3);
mflow.hist("magvel", 523263.8, 381654.2);
mflow.hist("c", 523263.8, 381654.2);
mflow.hist("dh", 523263.8, 381654.2);

mflow.solve(36000.0);

mflow.exportTextData();
