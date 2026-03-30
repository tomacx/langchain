setCurDir(getSrcDir());

// 初始化环境
igeo.clear();
imeshing.clear();

// 创建二维计算流体域（10m x 10m，每个方向50个节点）
skwave.DefMesh(2, [10.0, 10.0], [50, 50]);

// 创建参数化几何模型 - 生成矩形区域
var id = igeo.genRectS(0, 0, 0, 10, 10, 0, 0.1, 1);

// 设置二维网格划分方式为Frontal（6代表Frontal）
imeshing.setValue("MeshType2D", 6);

// 借助Gmsh剖分网格
imeshing.genMeshByGmsh(2);

// 将剖分后的网格单元按ID进行分组管理
SetGroupByID([1, 2, 3, 4, 5], "group1");
SetGroupByID([6, 7, 8, 9, 10], "group2");

// 设置特定节点监测点（记录位移、应力及速度）
var monitorNode = imeshing.SetMonitorPoint(25, ["disp", "stress", "vel"]);

// 配置输出结果参数
imeshing.setValue("OutputDisplacement", true);
imeshing.setValue("OutputStress", true);
imeshing.setValue("OutputVelocity", true);
imeshing.setValue("OutputTimeStep", 1e-6);

// 执行求解器计算
skwave.Solve();

// 导出生成的网格文件和监测结果至指定路径
imeshing.ExportMesh("./output/mesh_result.dat");
imeshing.ExportMonitor("./output/monitor_result.dat");

// 检查脚本执行日志确认无错误
print("Script execution completed successfully.");
