//设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

//创建点
var Point1 = igeo.genPoint(0, 0, 0, 0.3);
var Point2 = igeo.genPoint(3, 0, 0, 0.3);
var Point3 = igeo.genPoint(0, 3, 0, 0.3);

//创建线
var Line1 = igeo.genLine(Point1, Point2);
var Line2 = igeo.genLine(Point2, Point3);
var Line3 = igeo.genLine(Point3, Point1);

//生成线环
var aLine1 = [Line1, Line2, Line3];
var LineLoop1 = igeo.genLineLoop(aLine1);

//创建面
var Surface1 = igeo.genSurface(LineLoop1, 2);

//旋转面集
var aSurface1 = [Surface1];
var Volume1 = igeo.rotate("Surface", aSurface1, 0, 0, 0, 0,3, 0, 15, 3, 0.1, 3);

//借助Gmsh剖分网格
imeshing.genMeshByGmsh(3);
