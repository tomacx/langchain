setCurDir(getSrcDir());
gflow.clear();
gflow.defGrid( 0.0, 100.0, 0.0, 100.0, 200, 200);
gflow.setValue("LastTime", 80.0) ;
gflow.setValue("CourantCoeff", 0.04) ;
gflow.setValue("OutputInterval", 400) ;
gflow.setValue("ParaNum", 32) ;

gflow.setMat(50, 0.0, 0.01);
gflow.setSlidingBodyByBrick( 70, 50, 10, 20, 20);
gflow.setTerrainByBrick( 40, 50, 20, 20, 20, 0);
gflow.exportGrid();

gflow.hist("Thickness", 30, 50);
gflow.hist("Thickness", 50, 50);
gflow.hist("Thickness", 80, 50);

gflow.solve();
print("Solution is OK!");


