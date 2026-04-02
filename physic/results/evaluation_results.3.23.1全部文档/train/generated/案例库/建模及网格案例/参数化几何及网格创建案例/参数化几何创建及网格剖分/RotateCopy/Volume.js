// 设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

// 创建点
var Point1 = igeo.genPoint(4, 0, 0, 0.1);
var Point2 = igeo.genPoint(0, 0, 0, 0.1);
var Point3 = igeo.genPoint(0, 2, 0, 0.1);

// 创建线
var Line1 = igeo.genElliArc(Point1, Point2, Point1, Point3);

// 创建体
var Volume1 = igeo.genCylinderV(0, 0, 0, 0, 5, 0, 0, 5, 0, 1, 1);
var Volume2 = igeo.genEllipSoidV(20, 0, 0, 5, 3, 2, 0.5, 4, 0, 0, 0);

// 旋转操作
var aLine1 = [Line1];
var Ope1 = igeo.rotate("Line", aLine1, -20, -30, -10, -15, -10, -5, 20, 3, 0.5, 3);

// 复制并旋转体
var aVolume1 = [Volume1, Volume2];
var Ope2 = igeo.rotaCopy("Volume", aVolume1, -20, -10, 0, -30, 0, 5, 60, 5);

// 划分网格
imeshing.genMeshByGmsh(3);

print("Finished");
