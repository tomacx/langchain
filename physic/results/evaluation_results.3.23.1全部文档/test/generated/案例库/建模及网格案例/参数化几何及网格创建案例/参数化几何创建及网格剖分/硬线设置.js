// 设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();

// 创建点
var Point1 = igeo.genPoint(0, 0, 0, 0.1);
var Point2 = igeo.genPoint(3, 0, 0, 0.1);
var Point3 = igeo.genPoint(0, 3, 0, 0.1);

// 创建线
var Line1 = igeo.genLine(Point1, Point2, 0.01, 0.02);
var Line2 = igeo.genLine(Point2, Point3, 0.01, 0.02);
var Line3 = igeo.genLine(Point3, Point1, 0.01, 0.02);

// 创建面
var id = igeo.genRectS(0, 0, 0, 4, 4, 0, 0.2, 1);

// 设置硬线到面上
igeo.setHardLineToFace(Line1, id);
igeo.setHardLineToFace(Line2, id);
igeo.setHardLineToFace(Line3, id);

// 剖分网格
imeshing.genMeshByGmsh(2);

print("Finished");
