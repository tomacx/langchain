//设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

//创建点
var Point1 = igeo.genPoint(0, 0, 0, 0.1);
var Point2 = igeo.genPoint(3, 0, 0, 0.1);
var Point3 = igeo.genPoint(0, 3, 0, 0.1);
var Point4 = igeo.genPoint(-5, 0, 0, 0.1);
var Point5 = igeo.genPoint(-4, -1, 0, 0.1);
var Point6 = igeo.genPoint(-3, -2.5, 0, 0.1);
var Point7 = igeo.genPoint(-2.5, -1.2, 0, 0.1);
var Point8 = igeo.genPoint(-2, -0.5, 0, 0.1);
var Point9 = igeo.genPoint(0, -3, 0, 0.1);

//依次创建若干种线型的线
var Line1 = igeo.genArc(Point2, Point1, Point3);
var Line2 = igeo.genElliArc(Point3, Point1, Point4, Point4);
var aPoint1 = [Point4, Point5, Point6, Point7];
var Line3 = igeo.genCurvedLine(aPoint1, "spline");
var aPoint2 = [Point7, Point8, Point9];
var Line4 = igeo.genCurvedLine(aPoint2, "bspline");
Line5 = igeo.genLine(Point9, Point2);

//创建一个LineLoop
var aLine1 = [Line1, Line2, Line3, Line4, Line5];
var LineLoop1 = igeo.genLineLoop(aLine1);

//创建点
var Point10 = igeo.genPoint(20, 0, 0, 0.1);
var Point11 = igeo.genPoint(23, 0, 0, 0.1);
var Point12 = igeo.genPoint(23, 1, 0, 0.1);
var Point13 = igeo.genPoint(20, 1, 0, 0.1);

//依次创建几条LINE类型的线
var Line6 = igeo.genLine(Point10, Point11);
var Line7 = igeo.genLine(Point11, Point12);
var Line8 = igeo.genLine(Point12, Point13);
var Line9 = igeo.genLine(Point13, Point10);

//创建第二个LineLoop
var aLine2 = [Line6, Line7, Line8, Line9];
var LineLoop2 = igeo.genLineLoop(aLine2);

//拉伸LineLoop集
var aLineLoop1 = [LineLoop1, LineLoop2];
var Ope1 = igeo.extrude("LineLoop", aLineLoop1, 0.2, 0.5, 1.5, 5, 0.2, 2);

//借助Gmsh剖分网格
imeshing.genMeshByGmsh(2);


print("Finished");
