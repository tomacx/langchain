//设置工作目录为脚本文件所在目录
setCurDir(getSrcDir());

//创建点
var Point1 = igeo.genPoint(0, 0, 0, 0.3);
var Point2 = igeo.genPoint(10, 0, 0, 0.3);
var Point3 = igeo.genPoint(10, 4, 0, 0.3);
var Point4 = igeo.genPoint(0, 4, 0, 0.3);
var Point5 = igeo.genPoint(3, 1, 0, 0.3);
var Point6 = igeo.genPoint(7, 1, 0, 0.3);
var Point7 = igeo.genPoint(7, 3, 0, 0.3);
var Point8 = igeo.genPoint(3, 3, 0, 0.1);

//创建线
var Line1 = igeo.genLine(Point2, Point1);
var Line2 = igeo.genLine(Point2, Point3);
var Line3 = igeo.genLine(Point4, Point3);
var Line4 = igeo.genLine(Point1, Point4);
var Line5 = igeo.genLine(Point5, Point6);
var Line6 = igeo.genLine(Point7, Point6);
var Line7 = igeo.genLine(Point8, Point7);
var Line8 = igeo.genLine(Point5, Point8);

//创建线环
var aLine1 = [Line1, Line2, Line3, Line4];
var aLine2 = [Line5, Line6, Line7, Line8];

var LineLoop1 = igeo.genLineLoop(aLine1);
var LineLoop2 = igeo.genLineLoop(aLine2);

//创建面
var aLineLoop1 = [LineLoop1, LineLoop2];

var Surface1 = igeo.genSurface(aLineLoop1, 1);

var Surface2 = igeo.genRectS(1, -2, 0, 3, 0, 0, 0.1, 2);
var Surface3 = igeo.genRectS(-1, 0.5, 0, 0, 1, 0, 0.1, 2);
var Surface4 = igeo.genRectS(1, 4, 0, 3, 6, 0, 0.1, 2);
var Surface5 = igeo.genRectS(10, 1, 0, 13, 1.5, 0, 0.1, 2);

//执行面的粘接操作
var Ope1 = igeo.glue("Surface");

//划分网格
imeshing.genMeshByGmsh(2);
