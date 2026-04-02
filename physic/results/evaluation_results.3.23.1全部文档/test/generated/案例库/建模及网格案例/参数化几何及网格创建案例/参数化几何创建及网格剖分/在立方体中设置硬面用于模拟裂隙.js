// 设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

// 清除几何信息
igeo.clear();

// 清除网格信息
imeshing.clear();

// 创建矩形线环
var LineLoop1 = igeo.genRect(0, 0, 0, 20, 20, 0, 1);

// 创建椭圆线环
var Point1 = igeo.genPoint(6, 3, 0, 1);
var LineLoop2 = igeo.genEllipse(Point1, 3, 2, 0, 0, 0, 1);

// 创建圆形线环
var LineLoop3 = igeo.genCircle(5, 15, 0, 3, 1);

// 创建面
var aLineLoop1 = [LineLoop1, LineLoop2, LineLoop3];
var Surface1 = igeo.genSurface(aLineLoop1, 1);

// 面拉伸为体
var aSurface1 = [Surface1];
var Volume1 = igeo.extrude("Surface", aSurface1, 0, 0, 10, 1, 1, 1);

// 创建圆柱体
var Volume2 = igeo.genCylinderV(15, 10, 0, 15, 10, -4, 2, 4, 0.3, 0.3, 2);

// 两个体的粘接操作
var Volume3 = igeo.glue("Volume", Volume2, Volume1);

// 划分三维网格
imeshing.genMeshByGmsh(3);
