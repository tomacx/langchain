setCurDir(getSrcDir());


var Volume1 = igeo.genCylinderV(0, 0, 0, 0, 5, 0, 0, 5, 0, 1, 1);
var Volume2 = igeo.genCylinderV(0, 5, 0, 0, 10, 0, 0, 5, 0, 1, 2);
var Volume3 = igeo.genCylinderV(0, 10, 0, 0, 15, 0, 0, 4, 0, 0.5, 3);

var Volume4 = igeo.genEllipSoidV(20, 0, 0, 5, 3, 2, 0.5, 4, 0, 0, 0);

var Volume5 = igeo.genBrickV(40, 0, 0, 45, 10, 5, 1, 5);
var Volume6 = igeo.genBrickV(45, 0, 0, 60, 10, 5, 1, 6);
var Volume7 = igeo.genBrickV(60, 0, 0, 70, 15, 8, 1.5, 7);

var aVolume1 = [Volume1, Volume2, Volume3, Volume4, Volume5, Volume6, Volume7];
var Ope1 = igeo.mirrorMove("Volume", aVolume1, -20, 0, 0, 0, 0, 50, -20, 10, 0);

imeshing.genMeshByGmsh(3);

print("Finished");