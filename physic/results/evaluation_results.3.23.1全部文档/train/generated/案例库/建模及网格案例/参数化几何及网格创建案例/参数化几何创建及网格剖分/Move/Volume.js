// 设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

// 创建点
var Point1 = igeo.genPoint(0, 0, 0, 0.3);
var Point2 = igeo.genPoint(3, 0, 0, 0.3);
var Point3 = igeo.genPoint(0, 3, 0, 0.3);

// 创建线
var Line1 = igeo.genArc(Point2, Point1, Point3);

// 创建封闭线环
var aLine1 = [Line1];
var LineLoop1 = igeo.genLineLoop(aLine1);

// 创建面
var Surface1 = igeo.genSurface(LineLoop1, 2);

// 面拉伸为体
var Volume1 = igeo.extrude("Surface", [Surface1], 0, 0, 5, 1, 1, 1);

// 移动体
var Ope1 = igeo.move("Volume", [Volume1], 10, 15, 15);

// 划分三维网格
imeshing.genMeshByGmsh(3);

print("Finished");
