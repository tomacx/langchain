// 设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

// 创建点
var size = 0.1;
var Point1 = igeo.genPoint(0, 0, 0, size);
var Point2 = igeo.genPoint(3, 0, 0, size);
var Point3 = igeo.genPoint(0, 3, 0, size);

// 创建线
var Line1 = igeo.genLine(Point1, Point2);
var Line2 = igeo.genArc(Point2, Point1, Point3);
var Line3 = igeo.genLine(Point3, Point1);

// 创建封闭线环
var aLine = [Line1, Line2, Line3];
var LineLoop = igeo.genLineLoop(aLine);

// 创建面
var Surface = igeo.genSurface(LineLoop, 1);

// 设置二维网格划分方式为Frontal
imeshing.setValue("MeshType2D", 6);

// 借助Gmsh剖分网格
imeshing.genMeshByGmsh(2);
