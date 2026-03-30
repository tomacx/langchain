setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();

// ========== 1. 定义隧道几何参数 ==========
var TunnelRadius = 3.0;      // 隧道半径 (m)
var TunnelLength = 50.0;     // 隧道长度 (m)
var TunnelHeight = 20.0;     // 计算域高度 (m)
var TunnelWidth = 40.0;      // 计算域宽度 (m)

// 隧道中心位置
var TunnelCenterX = 50.0;
var TunnelCenterY = 10.0;
var TunnelCenterZ = 0.0;

// 网格划分参数
var MeshDivX = 20;           // X方向节点数
var MeshDivY = 15;           // Y方向节点数
var MeshDivZ = 10;           // Z方向节点数

// ========== 2. 创建三维圆柱形隧道主体 ==========
var CylinderID = igeo.genCylinder(TunnelRadius, TunnelLength, TunnelCenterX, TunnelCenterY, TunnelCenterZ);

// ========== 3. 设置计算域网格参数 ==========
skwave.DefMesh(3, [TunnelWidth, TunnelHeight, TunnelHeight], [MeshDivX, MeshDivY, MeshDivZ]);

// ========== 4. 对几何模型进行网格剖分 ==========
imeshing.genMeshByGmsh(3);

// ========== 5. 按隧道结构重新分组 ==========
var GroupID = imeshing.SetGroupByID(CylinderID);

// ========== 6. 配置监测点（隧道顶部、底部、中部） ==========
var MonitorPoint1 = [TunnelCenterX, TunnelCenterY + TunnelRadius, TunnelCenterZ];
var MonitorPoint2 = [TunnelCenterX, TunnelCenterY - TunnelRadius, TunnelCenterZ];
var MonitorPoint3 = [TunnelCenterX, TunnelCenterY, TunnelCenterZ + TunnelLength / 2.0];

// ========== 7. 配置求解器输出设置 ==========
var OutputDir = getSrcDir() + "/results";
var ResultFormat = "binary"; // 二进制格式存储结果

// ========== 8. 启动物理场求解器 ==========
skwave.Solve(1, 10000); // 时间步长1s，最大迭代10000步

// ========== 9. 输出监测数据与网格变形结果 ==========
print("隧道模型创建完成");
print("网格节点数: " + imeshing.GetNodeCount());
print("网格单元数: " + imeshing.GetElementCount());
print("分组ID: " + GroupID);
print("监测点位置: " + MonitorPoint1 + ", " + MonitorPoint2 + ", " + MonitorPoint3);

// 导出结果到指定目录
imeshing.ExportMesh(OutputDir + "/tunnel_mesh.vtk");
skwave.ExportResults(OutputDir + "/tunnel_results.dat", ResultFormat);

print("仿真计算完成，结果已导出至: " + OutputDir);
