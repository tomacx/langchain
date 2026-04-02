// 设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

// 创建点
var Point1 = igeo.genPoint(0, 0, 0, 0.3);
var Point2 = igeo.genPoint(3, 0, 0, 0.3);
var Point3 = igeo.genPoint(0, 3, 0, 0.3);

// 创建线
var Line1 = igeo.genArc(Point2, Point1, Point3);
var aPoint1 = [Point1, Point2, Point3];
var Line2 = igeo.genCurvedLine(aPoint1, "spline");

// 创建一个封闭线环
var aLine1 = [Line1, Line2];
var LineLoop1 = igeo.genLineLoop(aLine1);

// 创建一个面
var Surface1 = igeo.genSurface(LineLoop1, 2);

// 拉伸面集
var aSurface1 = [Surface1];
var Ope1 = igeo.extrude("Surface", aSurface1, 0, 0, 1, 5, 0.3);

// 借助Gmsh剖分网格
imeshing.genMeshByGmsh(1);

print("Finished");
