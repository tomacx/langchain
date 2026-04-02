// 设置工作目录为当前脚本所在路径
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

// 面拉伸为体
var Volume1 = igeo.extrude("Surface", [Surface1], 0, 0, 10, 1, 1, 1);

// 创建另一个矩形面并拉伸为体
var LineLoop2 = igeo.genRect(5, 5, 0, 15, 15, 0, 1);
var Surface2 = igeo.genSurface(LineLoop2, 2);
var Volume2 = igeo.extrude("Surface", [Surface2], 0, 0, 10, 1, 1, 1);

// 将两个体进行粘接操作
var Ope1 = igeo.glue("Volume", Volume1, Volume2);

// 划分三维网格
imeshing.genMeshByGmsh(3);

// 导入地层散点数据，产生栅格文件
imeshing.genSurfMesh("rock1", "test1.txt", 100, 100, "quad", "invdist1", "grid1.dat");
imeshing.genSurfMesh("rock2", "test2.txt", 100, 100, "quad", "invdist1", "grid2.dat");
imeshing.genSurfMesh("rock3", "test3.txt", 100, 100, "quad", "invdist1", "grid3.dat");
imeshing.genSurfMesh("rock4", "test4.txt", 10, 10, "quad", "invdist1", "grid4.dat");

// 创建地层分组文件
var fso = new ActiveXObject("Scripting.FileSystemObject"); // 创建FileSystemObject对象
var DynaP = fso.CreateTextFile("arrange.txt", true);

DynaP.WriteLine("4");
DynaP.WriteLine("grid1.dat");
DynaP.WriteLine("grid2.dat");
DynaP.WriteLine("grid3.dat");
DynaP.WriteLine("grid4.dat");

DynaP.Close();

// 根据地层信息进行分组
imeshing.setGroupByStratum("arrange.txt");
