//设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

//创建点
var Point1 = igeo.genPoint(4, 0, 0, 0.1);
var Point2 = igeo.genPoint(0, 0, 0, 0.1);
var Point3 = igeo.genPoint(0, 2, 0, 0.1);
var Point4 = igeo.genPoint(7, 0, 0, 0.1);
var Point5 = igeo.genPoint(8, 2, 0, 0.1);
var Point6 = igeo.genPoint(10, 0, 0, 0.1);
var Point7 = igeo.genPoint(12, 2, 0, 0.1);
var Point8 = igeo.genPoint(13, -1, 0, 0.1);
var Point9 = igeo.genPoint(15, 1, 0, 0.1);

//创建线
var Line1 = igeo.genElliArc(Point1, Point2, Point1, Point3);
var Line2 = igeo.genLine(Point4, Point5);
var aPoint = [Point6, Point7, Point8, Point9];
var Line3 = igeo.genCurvedLine(aPoint, "spline");

//旋转线集
var aLine1 = [Line1, Line2, Line3];
var Ope1 = igeo.rotate("Line", aLine1, -20, -30, -10, -15, -10, -5, 20, 3, 0.5, 3);

//借助Gmsh剖分网格
imeshing.genMeshByGmsh(2);

print("Finished");
