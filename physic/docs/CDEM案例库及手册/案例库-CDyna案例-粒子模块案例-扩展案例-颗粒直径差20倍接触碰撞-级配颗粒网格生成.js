setCurDir(getSrcDir());


var x = new Array(0.0, 100.0);
var y = new Array(0.0, 100.0);
var z = new Array(0.0, 100.0);
pdyna.CreateByCoord(100, 1, 2, 10.0, 10.0, 0,x,y,z);

pdyna.CreateByCoord(500, 2, 2, 5.0, 5.0, 0,x,y,z);

pdyna.CreateByCoord(1000, 3, 2, 1.0, 1.0, 0,x,y,z);

pdyna.CreateByCoord(5000, 4, 2, 0.5, 0.5, 0,x,y,z);

pdyna.exportPDyna("par.dat");


