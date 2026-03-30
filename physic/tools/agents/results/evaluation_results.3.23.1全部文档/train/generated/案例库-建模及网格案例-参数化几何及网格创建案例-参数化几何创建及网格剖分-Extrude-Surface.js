setCurDir(getSrcDir());

// 参数化几何变量定义
var length = 10.0;
var width = 8.0;
var height = 5.0;
var radius = 2.0;

// 创建基础点集（矩形轮廓）
var Point1 = igeo.genPoint(0, 0, 0, 0.3);
var Point2 = igeo.genPoint(length, 0, 0, 0.3);
var Point3 = igeo.genPoint(length, width, 0, 0.3);
var Point4 = igeo.genPoint(0, width, 0, 0.3);

// 创建矩形四条边线
var Line1 = igeo.genLine(Point1, Point2);
var Line2 = igeo.genLine(Point2, Point3);
var Line3 = igeo.genLine(Point3, Point4);
var Line4 = igeo.genLine(Point4, Point1);

// 创建封闭线环
var aLine1 = [Line1, Line2, Line3, Line4];
var LineLoop1 = igeo.genLineLoop(aLine1);

// 创建表面几何
var Surface1 = igeo.genSurface(LineLoop1, 2);

// 执行拉伸操作生成体积
var aL = [Surface1];
var Ope1 = igeo.extrude("Surface", aL, 0, 0, height, 1, 0.5, 2);

// 分配材料属性（弹性材料）
var Mat1 = cdyna.SetMaterial(1, "Elastic");
cdyna.SetMatParam(Mat1, "Density", 2500.0);
cdyna.SetMatParam(Mat1, "YoungModulus", 30e9);
cdyna.SetMatParam(Mat1, "PoissonRatio", 0.3);

// 将材料赋给生成的几何实体
cdyna.AssignMaterial(Ope1, Mat1);

// 借助Gmsh进行三维网格剖分
imeshing.genMeshByGmsh(3, "ExtrudeSurface");

// 设置组ID用于监测（整个拉伸体）
cdyna.SetGroupByID("Body", Ope1);

// 配置输出文件路径
var outDir = getSrcDir() + "/results";
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
}
cdyna.SetOutputPath(outDir);

// 初始化监测点（在表面中心位置）
var MonitorPoint1 = [length/2, width/2, height/2];
cdyna.AddMonitorPoint(MonitorPoint1, "Disp", "U");

// 设置边界条件（底部固定）
cdyna.SetBoundaryCondition(Ope1, "Fixed", [0, 0, 0]);

// 设置载荷（顶部施加压力）
cdyna.SetLoad(Ope1, "Pressure", 1e5);

// 执行仿真运行
cdyna.RunSimulation();

print("Extrude-Surface Simulation Finished");
