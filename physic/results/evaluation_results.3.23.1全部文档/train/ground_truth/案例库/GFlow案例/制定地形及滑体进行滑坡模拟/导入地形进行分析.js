setCurDir(getSrcDir());

//////////////////////////////////////////////
gflow.clear();
//gflow.defGrid( 537340, 537454,378140, 378248,100, 100);
gflow.setValue("LastTime", 1500.0) ;
gflow.setValue("CourantCoeff", 0.2) ;
gflow.setValue("OutputInterval", 200) ;
gflow.setValue("ParaNum", 32) ;
gflow.importGrid("data.txt");
gflow.setMat(20, 0.0, 0.0);


gflow.setSlidingBodyByEllipsoid(8.86259e+06,2.9276e+06, 100,100,100, 0, 0);

gflow.hist("Thickness", 8.86251e+06,2.9273e+06);
gflow.hist("Thickness", 8.86272e+06,2.92745e+06);

gflow.exportGrid();
gflow.drawHistPos();
gflow.solve();

//gflow.resultImport();

//打印提示信息
print("Solution is OK!")
