setCurDir(getSrcDir());

// 初始化：清除几何和网格信息
igeo.clear();
imeshing.clear();

// 导入DXF文件（示例：导入多个DXF文件）
var dxfFiles = ["drawing1.dxf", "drawing2.dxf", "drawing3.dxf"];
for(var i = 0; i < dxfFiles.length; i++) {
    igeo.import("dxf", dxfFiles[i]);
}

// 线段求交（处理DXF中的交叉线）
igeo.lineInt();

// 自动产生面实体模型（最多由15条线组成）
igeo.genSurfAuto(15);

// 设置面尺寸参数（可选，根据实际需求调整）
igeo.setSize("surface", 10, 1, 111111);

// 等待gmsh.exe后台任务完成（约2-3秒）
sleep(3000);

// 配置网格剖分维度：2表示仅二维剖分
var iDim = 2;
var sFileName = "myMesh";

// 调用Gmsh进行网格剖分
imeshing.genMeshByGmsh(iDim, sFileName);

// 再次等待确保网格生成完成
sleep(3000);

// 导入生成的外部网格文件到求解器模块
ImportGrid(sFileName + ".msh");

// 设置监测点坐标（示例：在几何中心位置）
var monitorPoints = [
    [5.0, 5.0, 0.0],
    [10.0, 10.0, 0.0],
    [15.0, 15.0, 0.0]
];

// 设置需要输出的物理量变量列表
var outputVariables = ["stress", "strain", "displacement", "velocity"];

// 定义计算域边界条件（示例：固定边界）
var boundaryConditions = {
    "fixed": [[0, 0, 0]],
    "free": [[10, 10, 0]]
};

// 分配材料属性参数（示例：弹性材料）
var materialProperties = {
    "density": 2500.0,      // kg/m³
    "youngModulus": 30e9,   // Pa
    "poissonRatio": 0.25,
    "yieldStress": 10e6     // Pa
};

// 设置材料到网格单元
imeshing.setMaterial(materialProperties);

// 应用边界条件
imeshing.setBoundary(boundaryConditions);

// 设置监测点
for(var j = 0; j < monitorPoints.length; j++) {
    imeshing.addMonitorPoint(monitorPoints[j], outputVariables);
}

// 启动仿真计算进程
var calcParams = {
    "timeStep": 1e-6,
    "totalTime": 0.1,
    "outputInterval": 1e-5
};

// 执行计算并监控状态
var result = imeshing.runCalculation(calcParams);

// 导出最终网格文件、监测数据及结果报告
imeshing.exportGrid(sFileName + ".msh");
imeshing.exportMonitorData(monitorPoints, "monitor_results.dat");
imeshing.exportReport("calculation_report.txt");

print("仿真计算完成，结果已导出至当前目录");
