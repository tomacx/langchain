setCurDir(getSrcDir());

// 初始化：清除现有几何和网格信息
igeo.clear();
imeshing.clear();

// 步骤1: 设置三维计算域网格 (10m x 10m x 10m, 每个方向20个节点)
skwave.DefMesh(3, [10.0, 10.0, 10.0], [20, 20, 20]);

// 步骤2: 创建基础三维砖块几何体 (位于原点附近，尺寸 2m x 2m x 2m)
var Volume1 = igeo.genBrick3D(0, 0, 0, 2.0, 2.0, 2.0);

// 步骤3: 对几何模型进行网格剖分
imeshing.genMeshByGmsh(3);

// 步骤4: 执行镜像复制操作 (沿X轴方向镜像)
var Volume1_Mirror = igeo.mirror(Volume1, 2.0, 0, 0, "x");

// 步骤5: 对镜像体进行网格剖分
imeshing.genMeshByGmsh(3);

// 步骤6: 为原始体和镜像体分配材料组ID
SetGroupByID(Volume1, 1);
SetGroupByID(Volume1_Mirror, 2);

// 步骤7: 设置监测点输出配置 (在两个体的中心位置)
var MonitorPoint1 = [1.0, 1.0, 1.0]; // 原始体中心
var MonitorPoint2 = [3.0, 1.0, 1.0]; // 镜像体中心

// 设置监测点输出参数 (位移、应力等)
imeshing.setValue("MonitorType", "displacement_stress");
imeshing.setValue("MonitorPoints", [MonitorPoint1, MonitorPoint2]);

// 步骤8: 指定仿真结果日志与数据文件保存路径
setCurDir(getSrcDir());
var OutputPath = getSrcDir() + "/output_results";

// 步骤9: 设置求解器参数并启动计算
skwave.SetSolver("BlockDyna");
skwave.SetTimeStep(1e-6); // 时间步长 1微秒
skwave.SetTotalTime(0.1); // 总计算时间 0.1秒

// 步骤10: 导出监测结果并验证网格完整性
print("网格节点总数:", imeshing.GetNodeCount());
print("网格单元总数:", imeshing.GetElementCount());
print("材料组1节点数:", SetGroupByID(Volume1, 1));
print("材料组2节点数:", SetGroupByID(Volume1_Mirror, 2));

// 启动求解器执行物理场计算
skwave.RunSolver();

// 输出最终监测结果
print("仿真计算完成，结果已保存至:", OutputPath);
