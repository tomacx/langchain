setCurDir(getSrcDir());

// 初始化环境
igeo.clear();
imeshing.clear();

// ========== 1. 参数化几何及网格创建 ==========
// 定义计算域尺寸和分割数
var domainLength = [5.0, 5.0, 3.0]; // m
var nodeDivisions = [20, 20, 15];  // 节点分割数

// 创建三维参数化网格（砖块单元）
imeshing.genBrick3D("mesh1", domainLength[0], domainLength[1], domainLength[2],
                     nodeDivisions[0], nodeDivisions[1], nodeDivisions[2]);

// ========== 2. 配置网格密度参数 ==========
// 调整节点分割数以控制网格密度
var targetDivisions = [30, 30, 25]; // 更细的网格
imeshing.genBrick3D("mesh2", domainLength[0], domainLength[1], domainLength[2],
                    targetDivisions[0], targetDivisions[1], targetDivisions[2]);

// ========== 3. 验证网格对象完整性并加载至求解器核心模块 ==========
var meshObj = imeshing.GetMesh("mesh2");
if (meshObj) {
    console.log("网格创建成功，节点数:", meshObj.nodeCount);
} else {
    console.error("网格创建失败");
}

// ========== 4. 调用 genParRegularByCoord 创建规则分布颗粒 ==========
// 在指定坐标创建规则分布的颗粒（3D空间）
var particleSpacing = [0.1, 0.1, 0.1]; // m
imeshing.genParRegularByCoord(3, "particles",
                              particleSpacing[0], particleSpacing[1],
                              particleSpacing[2], particleSpacing[3],
                              particleSpacing[4], particleSpacing[5]);

// ========== 5. 执行颗粒逻辑分组与属性定义操作 ==========
// 按坐标范围进行颗粒分组（模拟不同地层）
var groupCount = 0;

// 第一组：底部区域 (z < 1.0)
var sel1 = new SelElems(imeshing);
sel1.sphere(0, 0, 0, 2.5, 2.5, 1.0); // 半径2.5m，高度1.0m的圆柱区域
groupCount++;
imeshing.setGroup(groupCount.toString(), sel1);

// 第二组：中部区域 (1.0 <= z < 2.0)
var sel2 = new SelElems(imeshing);
sel2.sphere(0, 0, 0, 2.5, 2.5, 1.0, 1.0, 2.0);
groupCount++;
imeshing.setGroup(groupCount.toString(), sel2);

// 第三组：顶部区域 (z >= 2.0)
var sel3 = new SelElems(imeshing);
sel3.sphere(0, 0, 0, 2.5, 2.5, 2.0, 2.0, 3.0);
groupCount++;
imeshing.setGroup(groupCount.toString(), sel3);

// ========== 6. 设置仿真监测点位置及输出物理量类型参数配置 ==========
var monitorPoints = [
    [1.0, 1.0, 0.5], // 监测点1：底部中心
    [1.0, 1.0, 1.5], // 监测点2：中部中心
    [1.0, 1.0, 2.5]  // 监测点3：顶部中心
];

// 设置监测输出（位移、速度等）
var outputConfig = {
    displacement: true,
    velocity: true,
    acceleration: false,
    stress: true
};

// ========== 7. 执行求解器计算并实时监控颗粒运动状态与收敛情况 ==========
// 设置材料参数（示例：线性弹性颗粒材料）
var materialParams = {
    density: 2500.0,      // kg/m³
    youngModulus: 1e8,    // Pa
    poissonRatio: 0.3,
    frictionAngle: 30.0   // 度
};

// 设置求解器参数
var solverParams = {
    timeStep: 1e-6,       // s
    totalTime: 1.0,       // s
    maxIterations: 10000,
    convergenceTolerance: 1e-5
};

// 执行计算
var result = pdyna.solve(meshObj, materialParams, solverParams);

if (result.converged) {
    console.log("求解收敛，最终时间:", result.finalTime);
} else {
    console.error("求解未收敛");
}

// ========== 8. 读取仿真结束后的位移、速度等关键物理量数据结果 ==========
var displacementData = pdyna.getDisplacement(result);
var velocityData = pdyna.getVelocity(result);

// 输出监测点数据
for (var i = 0; i < monitorPoints.length; i++) {
    var point = monitorPoints[i];
    console.log("监测点", i + 1, "位置:", point);
    console.log("位移:", displacementData[point]);
    console.log("速度:", velocityData[point]);
}

// ========== 9. 导出最终结果文件并验证颗粒分组逻辑与监测数据完整性 ==========
// 导出PDyna格式颗粒文件
imesh.exportPDyna(imeshing, "particles_from_mesh.dat");

// 导出监测数据
pdyna.exportMonitorData(result, "monitor_results.dat");

// 验证颗粒分组
var groupValidation = imeshing.validateGroups();
console.log("颗粒分组验证结果:", groupValidation);

// 输出最终统计信息
console.log("========== 仿真完成 ========== ");
console.log("总颗粒数:", result.totalParticles);
console.log("总组数:", groupCount);
console.log("监测点数量:", monitorPoints.length);
console.log("结果文件已导出: particles_from_mesh.dat, monitor_results.dat");
