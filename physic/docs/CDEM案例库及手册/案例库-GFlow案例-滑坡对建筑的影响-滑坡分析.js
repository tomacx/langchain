setCurDir(getSrcDir());


//////////////////////////////////////////////
gflow.clear();
////求解时间20s
gflow.setValue("CourantCoeff", 0.2) ;
gflow.setValue("OutputInterval", 100) ;
gflow.setValue("ParaNum", 32) ;
gflow.importGrid("slidegrid.dat");
gflow.setMat(30, 0.0, 0.0);

gflow.hist("Thickness", 605.455,471.579);
gflow.hist("Thickness", 753.455,633.263);


var afCoord = new Array(5);
afCoord[0] = [-24.834,30.4117];
afCoord[1] = [-27.2767,37.7105];
afCoord[2] = [-27.2767,49.0642];
afCoord[3] = [-17.5059,45.8203];
afCoord[4] = [-11.8063,37.7105];


gflow.setSlidingBodyByEllipsoid(-189.5,-285, 20, 15, 20, 1);

gflow.exportGrid();

gflow.solve(50);


//打印提示信息
print("Solution is OK!")