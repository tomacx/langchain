setCurDir(getSrcDir());

// 创建圆柱体
var Volume1 = igeo.genCylinderV(0, 0, 0, 0, 5, 0, 0, 5, 0, 1, 1);
var Volume2 = igeo.genCylinderV(0, 5, 0, 0, 10, 0, 0, 5, 0, 1, 2);

// 创建椭球体
var Volume3 = igeo.genEllipSoidV(20, 0, 0, 5, 3, 2, 0.5, 4, 0, 0, 0);

// 创建长方体
var Volume4 = igeo.genBrickV(40, 0, 0, 45, 10, 5, 1, 5);
var Volume5 = igeo.genBrickV(45, 0, 0, 60, 10, 5, 1, 6);

// 创建一个圆柱体的镜像副本
var aVolume1 = [Volume1];
var Ope1 = igeo.mirrorCopy("Volume", aVolume1, -20, 0, 0, 0, 0, 50, -20, 10, 0);

// 划分网格
imeshing.genMeshByGmsh(3);

print("Finished");
