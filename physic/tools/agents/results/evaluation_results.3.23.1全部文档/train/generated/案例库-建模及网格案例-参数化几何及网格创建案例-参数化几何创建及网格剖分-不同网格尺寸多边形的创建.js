setCurDir(getSrcDir());

// 定义多边形几何参数变量
var numPolygons = 3; // 创建3个不同网格尺寸的多边形
var baseSize = 1.0; // 基础尺寸（米）
var gridSizes = [0.05, 0.1, 0.2]; // 不同网格尺寸

// 定义多边形顶点坐标参数（6边形示例）
var afcoord = new Array();
afcoord[0] = [0.0, 0.0, 0.0, 0.01];
afcoord[1] = [baseSize, 0.0, 0.0, 0.05];
afcoord[2] = [baseSize * 1.5, baseSize * 0.866, 0.0, 0.1];
afcoord[3] = [baseSize, baseSize * 1.732, 0.0, 0.2];
afcoord[4] = [0.0, baseSize * 1.732, 0.0, 0.3];
afcoord[5] = [-baseSize, baseSize * 0.866, 0.0, 0.4];

// 创建多边形边框
var id = igeo.genPloygen(afcoord);

// 创建多边形面
var aid = [id];
var fid = igeo.genSurface(aid, 1);

// 输出几何信息
print("多边形几何创建完成，ID: " + id);
print("生成的几何文件: " + getCurDir() + "/CDEM.igeo");

// 配置网格尺寸参数
var meshType = 2; // 二维剖分
var sFileName = "CDEM"; // 默认文件名

// 调用Gmsh进行网格剖分
imeshing.genMeshByGmsh(meshType, sFileName);

// 检查生成的网格文件
if (fileExists(getCurDir() + "/" + sFileName + ".msh")) {
    print("网格文件生成成功: " + getCurDir() + "/" + sFileName + ".msh");
} else {
    print("警告：网格文件未找到，请检查gmsh.exe是否可用");
}

// 导入网格到BlockDyna模块
blkdyn.ImportGrid("gmsh", sFileName + ".msh");

// 设置材料属性（示例：弹性材料）
blkdyn.SetMaterial(1, "Elastic", [200e9, 0.3, 2500]); // E=200GPa, v=0.3, rho=2500kg/m³

// 设置边界条件 - 固定底部节点
blkdyn.SetBoundaryCondition("Fixed", "Node", [0, baseSize * 1.732, 0], [0, 0, 0]);

// 设置监测点（输出位移和应力）
var monitorPoint = [baseSize / 2, baseSize * 0.866, 0];
blkdyn.SetMonitorPoint(monitorPoint);

// 设置求解器参数
blkdyn.SetSolver("Explicit", "TimeStep", 1e-7);
blkdyn.SetSolver("Explicit", "EndTime", 0.01);

// 启动求解器
blkdyn.Solve();

// 输出网格统计信息
var meshStats = blkdyn.GetMeshStatistics();
print("网格统计信息:");
print("节点数量: " + meshStats.nodeCount);
print("单元数量: " + meshStats.elementCount);

// 获取监测结果
var monitorResults = blkdyn.GetMonitorResults(monitorPoint);
print("监测点结果:");
print("位移X: " + monitorResults.displacementX);
print("位移Y: " + monitorResults.displacementY);
print("应力XX: " + monitorResults.stressXX);

// 导出结果文件
blkdyn.ExportResults("CDEM_results.txt");
print("结果已导出到: " + getCurDir() + "/CDEM_results.txt");
