setCurDir(getSrcDir());

// 创建一个圆柱体
var Volume1 = igeo.genCylinderV(0, 0, 0, 0, 5, 0, 0, 5, 0, 1, 1);

// 创建另一个圆柱体
var Volume2 = igeo.genCylinderV(0, 5, 0, 0, 10, 0, 0, 5, 0, 1, 2);

// 创建第三个圆柱体
var Volume3 = igeo.genCylinderV(0, 10, 0, 0, 15, 0, 0, 4, 0, 0.5, 3);

// 创建一个椭球体
var Volume4 = igeo.genEllipSoidV(20, 0, 0, 5, 3, 2, 0.5, 4, 0, 0, 0);

// 创建第一个长方体
var Volume5 = igeo.genBrickV(40, 0, 0, 45, 10, 5, 1, 5);

// 创建第二个长方体
var Volume6 = igeo.genBrickV(45, 0, 0, 60, 10, 5, 1, 6);

// 创建第三个长方体
var Volume7 = igeo.genBrickV(60, 0, 0, 70, 15, 8, 1.5, 7);

// 将所有体积对象放入数组中
var aVolume1 = [Volume1, Volume2, Volume3, Volume4, Volume5, Volume6, Volume7];

// 对这些体积进行镜像复制操作，生成新的几何体
var Ope1 = igeo.mirrorCopy("Volume", aVolume1, -20, 0, 0, 0, 0, 50, -20, 10, 0);

// 划分三维网格
imeshing.genMeshByGmsh(3);

print("Finished");
