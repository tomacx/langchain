//设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

//创建点
var Point1 = igeo.genPoint(0, 0, 0, 0.1);
var Point2 = igeo.genPoint(0, 2, 0, 0.1);
var Point3 = igeo.genPoint(0, 4, 0, 0.1);
var Point4 = igeo.genPoint(2, 2, 0, 0.1);

//创建线
var Line1 = igeo.genLine(Point1, Point3);
var Line2 = igeo.genArc(Point1, Point2, Point4);
var Line3 = igeo.genArc(Point4, Point2, Point3);

//创建封闭线环
aLine1 = [Line1, Line2, Line3];
var LineLoop1 = igeo.genLineLoop(aLine1);

//旋转线环
var aLineLoop1 = [LineLoop1];
var Ope1 = igeo.rotate("LineLoop", aLineLoop1, -5, -2, -4, -2, 4, 0, 60, 3, 0.1, 2);

//借助Gmsh剖分网格
imeshing.genMeshByGmsh(2);


print("Finished");
