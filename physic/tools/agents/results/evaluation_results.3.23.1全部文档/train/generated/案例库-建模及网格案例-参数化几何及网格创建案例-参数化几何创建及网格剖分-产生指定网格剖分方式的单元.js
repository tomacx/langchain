setCurDir(getSrcDir());

// 初始化环境
igeo.clear();
imeshing.clear();

// 定义三维计算域：10m×10m×10m，每个方向分割20个节点
skwave.DefMesh(3, [10.0, 10.0, 10.0], [20, 20, 20]);

// 创建参数化三维砖块几何模型（尺寸与计算域一致）
var brickId = igeo.GenBrick3D([0, 0, 0], [10, 10, 10], 0.5);

// 设置网格剖分维度为3（三维）
imeshing.setValue("MeshType3D", 3);

// 借助Gmsh进行自动网格剖分
imeshing.genMeshByGmsh(3);

// 将生成的网格加载至求解器
blkdyn.GetMesh();

// 对网格单元进行分组（按ID范围分组，便于后续处理）
blkdyn.SetGroupByID(1, 1000);
blkdyn.SetGroupByID(1001, 2000);
blkdyn.SetGroupByID(2001, 3000);

// 定义监测点位置（在计算域中心及边界）
var monitorPoint1 = [5.0, 5.0, 5.0];
var monitorPoint2 = [0.0, 5.0, 5.0];
var monitorPoint3 = [5.0, 0.0, 5.0];
var monitorPoint4 = [5.0, 5.0, 0.0];

// 配置结果输出文件路径及格式参数
blkdyn.SetOutputFile("results.txt");
blkdyn.SetOutputFormat("csv");
blkdyn.SetMonitorPoints([monitorPoint1, monitorPoint2, monitorPoint3, monitorPoint4]);

// 执行脚本并验证网格剖分
print("网格剖分完成，单元数量:", blkdyn.GetMeshCount());
print("监测点设置完成，共", blkdyn.GetMonitorPointCount(), "个");
