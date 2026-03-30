setCurDir(getSrcDir());

// 创建第一个网格对象 - 使用Genvi格式导入示例
var oMesh1 = imesh.importGenvi("mesh1.gvx");

// 创建第二个网格对象 - 使用Gid格式导入示例
var oMesh2 = imesh.importGid("mesh2.msh");

// 将两个网格组装到新的几何网格中
var oMeshCombined = imesh.assemble(oMesh1, oMesh2);

// 验证新组装网格的节点数量
var nodeCount = oMeshCombined.getNodeCount();
console.log("合并后网格节点数量: " + nodeCount);

// 定义位移监测点 - 在合并网格上设置监测位置
var monitorPoint1 = [0.5, 0.5, 0];
var monitorPoint2 = [0.5, 0.5, 0.5];

// 配置求解器参数 - 时间步长设置
var solverParams = {
    timeStep: 1e-6,
    totalTime: 0.1,
    outputInterval: 1e-4
};

// 定义应力监测点
var stressMonitorPoints = [
    [0.25, 0.25, 0],
    [0.75, 0.25, 0],
    [0.5, 0.5, 0]
];

// 执行仿真计算
var result = pdyna.solve(solverParams);

// 更新网格状态
oMeshCombined.updateState();

// 将最终合并网格的计算结果导出到指定文件路径
imesh.exportGenvi(oMeshCombined, "merged_result.gvx");

// 输出监测点数据
console.log("位移监测点1: " + monitorPoint1);
console.log("位移监测点2: " + monitorPoint2);
console.log("应力监测点数量: " + stressMonitorPoints.length);

// 记录脚本执行完成状态
console.log("网格合并仿真计算完成，结果已导出到 merged_result.gvx");

// 释放相关资源
oMesh1.release();
oMesh2.release();
oMeshCombined.release();
