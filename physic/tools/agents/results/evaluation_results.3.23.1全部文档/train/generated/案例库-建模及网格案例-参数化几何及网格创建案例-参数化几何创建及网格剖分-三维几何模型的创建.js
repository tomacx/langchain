setCurDir(getSrcDir());

// 定义三维几何模型尺寸参数（单位：米）
var length = 2.0;
var width = 1.5;
var height = 1.0;
var thickness = 0.05; // 几何厚度，用于生成实体

// 创建8个顶点
var p1 = igeo.genPoint(0, 0, 0, thickness);
var p2 = igeo.genPoint(length, 0, 0, thickness);
var p3 = igeo.genPoint(length, width, 0, thickness);
var p4 = igeo.genPoint(0, width, 0, thickness);
var p5 = igeo.genPoint(0, 0, height, thickness);
var p6 = igeo.genPoint(length, 0, height, thickness);
var p7 = igeo.genPoint(length, width, height, thickness);
var p8 = igeo.genPoint(0, width, height, thickness);

// 创建12条边（线）
var l1 = igeo.genLine(p1, p2);
var l2 = igeo.genLine(p2, p3);
var l3 = igeo.genLine(p3, p4);
var l4 = igeo.genLine(p4, p1);
var l5 = igeo.genLine(p5, p6);
var l6 = igeo.genLine(p6, p7);
var l7 = igeo.genLine(p7, p8);
var l8 = igeo.genLine(p8, p5);
var l9 = igeo.genLine(p1, p5);
var l10 = igeo.genLine(p2, p6);
var l11 = igeo.genLine(p3, p7);
var l12 = igeo.genLine(p4, p8);

// 创建4个面环（每个面由4条边组成）
var face1Loop = [l1, l2, l3, l4];
var face2Loop = [l5, l6, l7, l8];
var face3Loop = [l9, l10, l11, l12];
var face4Loop = [l1, l5, l10, l9];

// 创建4个面
var s1 = igeo.genSurface(face1Loop, 1);
var s2 = igeo.genSurface(face2Loop, 1);
var s3 = igeo.genSurface(face3Loop, 1);
var s4 = igeo.genSurface(face4Loop, 1);

// 创建面环（包围整个立方体）
var volumeLoop = [s1, s2, s3, s4];

// 创建三维实体体积
var vol = igeo.genVolume(volumeLoop, 1);

// 借助Gmsh进行三维网格剖分，生成名为"cubeMesh"的网格文件
imeshing.genMeshByGmsh(3, "cubeMesh");

// 将生成的网格导入到块体模块求解器中
GetMesh("cubeMesh.msh");

// 配置监测点位置（在立方体中心）
var monitorPoint = [length/2, width/2, height/2];
print("监测点已设置于: " + monitorPoint.join(", "));

// 输出仿真计算结果与日志信息
print("三维几何模型创建及网格剖分完成");
print("网格文件: cubeMesh.msh");
print("求解器已加载网格数据");
