// 设置当前工作路径为JS脚本所在目录
setCurDir(getSrcDir());

// 清除之前的几何信息
igeo.clear();

// 创建几个点
var Point1 = igeo.genPoint(0, 0, 0, 0.3);
var Point2 = igeo.genPoint(3, 0, 0, 0.3);
var Point3 = igeo.genPoint(0, 3, 0, 0.3);

// 创建几条线
var Line1 = igeo.genLine(Point1, Point2);
var Line2 = igeo.genLine(Point2, Point3);
var Line3 = igeo.genLine(Point3, Point1);

// 创建一个封闭的线环
var aLine = [Line1, Line2, Line3];
var LineLoop = igeo.genLineLoop(aLine);

// 基于线环创建一个面
var Surface = igeo.genSurface(LineLoop, 2);

// 拉伸表面以形成实体
var Ope1 = igeo.extrude("Surface", [Surface], 0, 0, 1, 5, 0.3, 2);

// 使用Gmsh进行网格剖分
imeshing.genMeshByGmsh(3);
