setCurDir(getSrcDir());

gflow.clear();

gflow.setValue("LastTime", 20.0);
gflow.setValue("CourantCoeff", 0.2);
gflow.setValue("OutputInterval", 100);
gflow.setValue("ParaNum", 32);

gflow.importGrid("landslide.dat");

gflow.setMat(20, 0.0, 0.0);

gflow.hist("Thickness", 605.455, 471.579);
gflow.hist("Thickness", 753.455, 633.263);

var afCoord = new Array(5);
afCoord[0] = [-24.834, 30.4117];
afCoord[1] = [-27.2767, 37.7105];
afCoord[2] = [-27.2767, 49.0642];
afCoord[3] = [-17.5059, 45.8203];
afCoord[4] = [-11.8063, 37.7105];

gflow.setSlidingBodyByPolygon(afCoord, 10, 0);

gflow.exportGrid();

gflow.solve(50);

print("Solution is OK!");
