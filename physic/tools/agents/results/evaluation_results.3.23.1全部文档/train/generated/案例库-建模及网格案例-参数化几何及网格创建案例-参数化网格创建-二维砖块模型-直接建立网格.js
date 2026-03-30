setCurDir(getSrcDir());

// 初始化环境
igeo.clear();
imeshing.clear();

// ========== 1. 定义二维砖块网格参数 ==========
var sGroup = "rock";           // 组名
var fLX = 2.0;                 // X方向长度 (m)
var fLY = 1.5;                 // Y方向长度 (m)
var iNX = 20;                  // X方向网格数
var iNY = 15;                  // Y方向网格数
var fOriginX = 0.0;            // 原点X坐标 (m)
var fOriginY = 0.0;            // 原点Y坐标 (m)

// ========== 2. 创建二维砖块网格 ==========
var retCode = imeshing.genBrick2D(sGroup, fLX, fLY, iNX, iNY, fOriginX, fOriginY);
if (retCode !== 0) {
    print("网格生成失败，返回码: " + retCode);
} else {
    print("网格创建成功");
}

// ========== 3. 分配岩石材料属性 ==========
var density = 2650;            // 密度 (kg/m³)
var elasticModulus = 25e9;     // 弹性模量 (Pa)
var poissonRatio = 0.25;       // 泊松比

// 设置材料参数（假设通过组名访问）
setMaterialProperty(sGroup, "density", density);
setMaterialProperty(sGroup, "elasticModulus", elasticModulus);
setMaterialProperty(sGroup, "poissonRatio", poissonRatio);

// ========== 4. 设置边界条件与约束 ==========
// 固定底部节点 (Y=0)
var bottomNodes = getNodesByCoord(0, fOriginY, 0.1);
if (bottomNodes && bottomNodes.length > 0) {
    for (var i = 0; i < bottomNodes.length; i++) {
        setNodeConstraint(bottomNodes[i], "ux", true);
        setNodeConstraint(bottomNodes[i], "uy", true);
    }
}

// 固定左侧节点 (X=0)
var leftNodes = getNodesByCoord(fOriginX, 0.1, 0);
if (leftNodes && leftNodes.length > 0) {
    for (var i = 0; i < leftNodes.length; i++) {
        setNodeConstraint(leftNodes[i], "ux", true);
        setNodeConstraint(leftNodes[i], "uy", true);
    }
}

// ========== 5. 配置仿真输出请求 ==========
var outputRequests = [];

// 位移监测
outputRequests.push({
    type: "displacement",
    variables: ["Ux", "Uy"],
    frequency: 100,
    filePrefix: "disp_"
});

// 应力监测
outputRequests.push({
    type: "stress",
    variables: ["S11", "S22", "S12"],
    frequency: 50,
    filePrefix: "stress_"
});

// 设置输出请求
setOutputRequests(outputRequests);

// ========== 6. 提交计算任务至求解器引擎 ==========
var solverConfig = {
    solverType: "explicit",      // 显式动力学分析
    timeStep: 1e-7,              // 时间步长 (s)
    totalTime: 0.1,              // 总仿真时间 (s)
    outputInterval: 50           // 输出间隔
};

var jobHandle = submitJob(solverConfig);

// ========== 7. 监控求解器运行状态 ==========
while (jobHandle.isRunning()) {
    var status = jobHandle.getStatus();
    if (status === "completed") {
        print("计算完成");
        break;
    } else if (status === "error") {
        print("计算出错: " + jobHandle.getErrorMessage());
        break;
    }
    sleep(100);
}

// ========== 8. 读取并导出最终仿真结果数据 ==========
var resultFiles = getOutputFiles();
if (resultFiles && resultFiles.length > 0) {
    print("输出文件列表:");
    for (var i = 0; i < resultFiles.length; i++) {
        print("  - " + resultFiles[i]);
    }
}

print("仿真脚本执行完毕");
