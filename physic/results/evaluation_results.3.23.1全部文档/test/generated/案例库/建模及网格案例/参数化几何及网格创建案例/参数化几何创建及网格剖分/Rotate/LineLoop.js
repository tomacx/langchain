// 设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

// 创建点
var Point1 = igeo.genPoint(4, 0, 0, 0.1);
var Point2 = igeo.genPoint(0, 0, 0, 0.1);
var Point3 = igeo.genPoint(0, 2, 0, 0.1);

// 创建线
var Line1 = igeo.genElliArc(Point1, Point2, Point1, Point3);

// 创建点
var Point4 = igeo.genPoint(7, 0, 0, 0.1);
var Point5 = igeo.genPoint(8, 2, 0, 0.1);

// 创建线
var Line2 = igeo.genLine(Point4, Point5);

// 创建点集合
var aPoint = [igeo.genPoint(10, 0, 0, 0.1),
              igeo.genPoint(12, 2, 0, 0.1),
              igeo.genPoint(13, -1, 0, 0.1),
              igeo.genPoint(15, 1, 0, 0.1)];

// 创建曲线
var Line3 = igeo.genCurvedLine(aPoint, "spline");

// 线集合
var aLine1 = [Line1, Line2, Line3];

// 拉伸线集
var Ope1 = igeo.extrude("Line", aLine1, 0, 0, 1, 10, 0.2, 2);

// 创建点集合用于旋转操作
var rotatePoint = [4, 0, 0];
var rotateAxis = [-30, -15, -5];
var rotateAngle = 20;

// 旋转线集
var Ope2 = igeo.rotate("Line", aLine1, rotatePoint[0], rotatePoint[1], rotatePoint[2],
                        rotateAxis[0], rotateAxis[1], rotateAxis[2], rotateAngle);

// 借助Gmsh剖分网格
imeshing.genMeshByGmsh(2);

print("Finished");
