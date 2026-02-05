setCurDir(getSrcDir());

//////////////////////////////////////////////
gflow.clear();
////求解时间20s
gflow.setValue("LastTime", 20.0) ;
gflow.setValue("CourantCoeff", 0.2) ;
gflow.setValue("OutputInterval", 100) ;
gflow.setValue("ParaNum", 32) ;
gflow.importGrid("landslide.dat");
gflow.setMat(20, 0.0, 0.0);

gflow.hist("Thickness", 605.455,471.579);
gflow.hist("Thickness", 753.455,633.263);

gflow.setSlidingBodyByEllipsoid( -93, 37, 20, 15, 20, 0);

gflow.exportGrid();

gflow.solve();


//打印提示信息
print("Solution is OK!")