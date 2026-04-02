// 设置当前工作路径为JS脚本所在目录
setCurDir(getSrcDir());

// 创建点
var Point1 = igeo.genPoint(4, 0, 0, 0.1);
var Point2 = igeo.genPoint(0, 0, 0, 0.1);
var Point3 = igeo.genPoint(0, 2, 0, 0.1);

// 创建线
var Line1 = igeo.genElliArc(Point1, Point2, Point1, Point3);

// 定义旋转操作参数
var angleX = -20;
var angleY = -30;
var angleZ = -15;

// 执行旋转操作
var Ope1 = igeo.rotate("Line", [Line1], angleX, angleY, angleZ, -10, -10, -5, 20, 3, 0.5, 3);

// 借助Gmsh剖分网格
imeshing.genMeshByGmsh(2);

print("Finished");
