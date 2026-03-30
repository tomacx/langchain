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

//拉伸点集
var aPoint1 = [Point1, Point2, Point3, Point4, Point5, Point6, Point7, Point8, Point9 ];
var Ope1 = igeo.extrude("Point", aPoint1, 0, 0, 1, 10, 0.2);

imeshing.genMeshByGmsh(1);

print("Finished");
