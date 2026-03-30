setCurDir(getSrcDir());

//////////////////////////////////////////////
gflow.clear();
gflow.defGrid(0, 1332, 0, 1280, 100, 96);
gflow.setValue("LastTime", 1000.0);
gflow.setValue("CourantCoeff", 0.2);
gflow.setValue("OutputInterval", 100);
gflow.setValue("ParaNum", 32);
gflow.importGrid("sucun.dat");
gflow.setMat(20, 0.0, 0.0);

gflow.hist("Thickness", 605.455, 471.579);
gflow.hist("Thickness", 753.455, 633.263);

gflow.setSlidingBodyByEllipsoid(1100, 870, 40, 100, 50, 0);

gflow.exportGrid();

gflow.solve();

//打印提示信息
print("Solution is OK!");
