// 设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

// 创建圆柱体
var Volume1 = igeo.genCylinderV(0, 0, 0, 0, 5, 0, 0, 5, 0, 1, 1);
var Volume2 = igeo.genCylinderV(0, 5, 0, 0, 10, 0, 0, 5, 0, 1, 2);

// 创建椭球体
var Volume4 = igeo.genEllipSoidV(20, 0, 0, 5, 3, 2, 0.5, 4, 0, 0, 0);

// 创建长方体
var Volume5 = igeo.genBrickV(40, 0, 0, 45, 10, 5, 1, 5);
var Volume6 = igeo.genBrickV(45, 0, 0, 60, 10, 5, 1, 6);

// 将所有几何体放入数组
var aVolume1 = [Volume1, Volume2, Volume4, Volume5, Volume6];

// 对几何体进行旋转操作
var Ope1 = igeo.rotaCopy("Volume", aVolume1, -20, -10, 0, -30, 0, 5, 60, 5);

// 使用Gmsh生成网格
imeshing.genMeshByGmsh(3);

print("Finished");
