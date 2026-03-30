setCurDir(getSrcDir());

// 1. 初始化环境并加载模块
var imeshing = require("imeshing");
var CDyna = require("CDyna");

// 2. 创建参数化三维几何模型（多个砖块）
var Volume1 = igeo.genBrick3D(0, 0, 0, 5, 5, 5, 1);
var Volume2 = igeo.genBrick3D(6, 0, 0, 11, 5, 5, 2);
var Volume3 = igeo.genBrick3D(12, 0, 0, 17, 5, 5, 3);

// 创建圆柱体作为补充几何
var Volume4 = igeo.genCylinderV(20, 0, 0, 20, 0, 0, 5, 0, 1, 4);
var Volume5 = igeo.genCylinderV(30, 0, 0, 30, 0, 0, 4, 0, 0.8, 5);

// 组合几何体数组
var aVolumeList = [Volume1, Volume2, Volume3, Volume4, Volume5];

// 3. 定义计算域网格（三维，10m×10m×10m，每个方向分割10个点）
skwave.DefMesh(3, [10.0, 10.0, 10.0], [10, 10, 10]);

// 4. 执行网格剖分
imeshing.genMeshByGmsh(3);

// 5. 对已剖分的网格体积执行镜像移动操作
var Ope1 = igeo.mirrorMove("Volume", aVolumeList, -20, 0, 0, 0, 0, 50, -20, 10, 0);

// 6. 将移动后的网格单元按区域重新分组
SetGroupByID(1, "Group_Moved_Left");
SetGroupByID(2, "Group_Moved_Right");
SetGroupByID(3, "Group_Original");

// 7. 为分组后的网格单元分配材料参数及物理属性定义
CDyna.SetMaterial("Group_Moved_Left", {
    density: 2500.0,
    elasticModulus: 30e9,
    poissonRatio: 0.25,
    yieldStrength: 10e6
});

CDyna.SetMaterial("Group_Moved_Right", {
    density: 2400.0,
    elasticModulus: 28e9,
    poissonRatio: 0.25,
    yieldStrength: 8e6
});

CDyna.SetMaterial("Group_Original", {
    density: 2600.0,
    elasticModulus: 32e9,
    poissonRatio: 0.25,
    yieldStrength: 12e6
});

// 8. 在关键位置设置监测点以记录仿真过程中的应力或位移数据
var MonitorPoint1 = CDyna.SetMonitorPoint(1, [0, 0, 0], "Stress_X", "Displacement_Z");
var MonitorPoint2 = CDyna.SetMonitorPoint(2, [5, 0, 0], "Stress_Y", "Displacement_X");
var MonitorPoint3 = CDyna.SetMonitorPoint(3, [10, 0, 0], "Stress_Z", "Displacement_Y");

// 9. 配置输出文件路径并启动脚本执行进行数值计算求解
CDyna.SetOutputFile("results.dat");
CDyna.SetOutputDir("./output");

// 设置求解器参数
CDyna.SetSolverTimeStep(1e-6);
CDyna.SetSolverTotalSteps(10000);

// 启动求解
CDyna.Solve();

// 10. 读取并导出仿真结束后的结果文件与监测数据至指定目录
CDyna.ExportResults("output/results.dat");
CDyna.ExportMonitorData("output/monitor_data.dat");

print("Simulation completed successfully.");
