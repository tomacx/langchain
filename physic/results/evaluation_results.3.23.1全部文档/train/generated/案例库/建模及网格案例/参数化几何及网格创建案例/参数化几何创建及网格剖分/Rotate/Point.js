// 设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

// 创建点
var Point1 = igeo.genPoint(4, 0, 0, 0.1);
var Point2 = igeo.genPoint(0, 0, 0, 0.1);
var Point3 = igeo.genPoint(0, 2, 0, 0.1);

// 创建线
var Line1 = igeo.genElliArc(Point1, Point2, Point1, Point3);

// 创建点集并旋转
var aPoint1 = [Point1, Point2, Point3];
var Ope1 = igeo.rotate("Point", aPoint1, -20, -30, -10, -15, -10, -5, 20, 3, 0.5);

// 创建线集并旋转
var Line2 = igeo.genLine(Point1, Point3);
var aLine1 = [Line1, Line2];
var Ope2 = igeo.rotate("Line", aLine1, -20, -30, -10, -15, -10, -5, 20, 3, 0.5);

// 借助Gmsh剖分网格
imeshing.genMeshByGmsh(2);

print("Finished");
