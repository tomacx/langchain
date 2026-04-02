// 设置当前工作路径为脚本所在目录
setCurDir(getSrcDir());

// 创建点
var Point1 = igeo.genPoint(0, 0, 0, 0.3);
var Point2 = igeo.genPoint(3, 0, 0, 0.3);
var Point3 = igeo.genPoint(0, 3, 0, 0.3);

// 创建线
var Line1 = igeo.genArc(Point2, Point1, Point3);

// 创建封闭线环
var aLine1 = [Line1];
var LineLoop1 = igeo.genLineLoop(aLine1);

// 创建面
var Surface1 = igeo.genSurface(LineLoop1, 2);

// 使用Gmsh进行网格剖分
imeshing.genMeshByGmsh(2);

print("Finished");
