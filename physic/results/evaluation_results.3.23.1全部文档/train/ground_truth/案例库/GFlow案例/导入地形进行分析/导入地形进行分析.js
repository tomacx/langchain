setCurDir(getSrcDir());

//////////////////////////////////////////////
gflow.clear();
gflow.defGrid( 537340, 537454,378140, 378248,100, 100);
gflow.setValue("LastTime", 80.0) ;
gflow.setValue("CourantCoeff", 0.04) ;
gflow.setValue("OutputInterval", 400) ;
gflow.setValue("ParaNum", 32) ;
gflow.importGrid("Cdem_zbed.dat");
gflow.setMat(20, 0.0, 0.01);

gflow.hist("Thickness", 30, 50);
gflow.hist("Thickness", 50, 50);
gflow.hist("Thickness", 80, 50);

gflow.solve();

//gflow.resultImport();

//打印提示信息
print("Solution is OK!")
