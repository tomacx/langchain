// 设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

// 清除之前的几何信息
igeo.clear();

// 创建点
var Point1 = igeo.genPoint(0, 0, 0, 0.3);
var Point2 = igeo.genPoint(3, 0, 0, 0.3);
var Point3 = igeo.genPoint(0, 3, 0, 0.3);

// 创建线
var Line1 = igeo.genLine(Point1, Point2);
var Line2 = igeo.genArc(Point2, Point1, Point3); // 假设这里使用弧线

// 创建一个封闭的线环
var aLine1 = [Line1, Line2];
var LineLoop1 = igeo.genLineLoop(aLine1);

// 拉伸线环以创建表面
var Ope1 = igeo.extrude("LineLoop", [LineLoop1], 0, 0, 1, 5, 0.3, 2); // 假设拉伸高度为5，步长为0.3

// 使用Gmsh进行网格剖分
imeshing.genMeshByGmsh(2);
