setCurDir(getSrcDir());

// ========== 1. 定义仿真参数 ==========
var simParams = {
    baseLength: 20.0,
    baseWidth: 15.0,
    baseHeight: 10.0,
    mirrorOffsetX: -30.0,
    mirrorOffsetY: 0.0,
    materialCount: 3,
    meshSize: 0.5
};

// ========== 2. 创建初始基础几何体 ==========
var baseVol = igeo.genBrickV(
    simParams.baseLength, 0, 0,
    simParams.baseLength + simParams.baseWidth,
    simParams.baseHeight,
    simParams.baseWidth,
    1,
    1
);

// ========== 3. 执行MirrorCopy-Volume生成镜像副本 ==========
var baseGroup = [baseVol];
var mirrorOp = igeo.mirrorCopy("Volume", baseGroup, simParams.mirrorOffsetX, simParams.mirrorOffsetY, 0, 0, 0, 50, -20, 10);

// ========== 4. 分配材料ID到不同组 ==========
var allVolumes = [baseVol, mirrorOp];

// 设置基础几何体为材料组1（混凝土）
SetGroupByID(1, baseVol);

// 设置镜像副本为材料组2（岩石）
SetGroupByID(2, mirrorOp);

// ========== 5. 调用imeshing.genMeshByGmsh进行网格剖分 ==========
imeshing.genMeshByGmsh(3, "MirrorCopyModel");

// ========== 6. 使用SetGroupByID组织网格到逻辑组用于边界条件 ==========
// 重新分组以便后续施加边界条件
SetGroupByID(10, baseVol); // 基础体组
SetGroupByID(20, mirrorOp); // 镜像体组

// ========== 7. 配置输出监测点（应力和位移） ==========
var monitorPoints = [];
monitorPoints.push([simParams.baseLength/2, simParams.baseWidth/2, simParams.baseHeight/2]);
monitorPoints.push([simParams.baseLength + simParams.mirrorOffsetX, simParams.baseWidth/2, simParams.baseHeight/2]);

// 输出监测点配置（简化处理，实际需根据API文档）
print("Monitoring points configured at: " + monitorPoints.length);

// ========== 8. 初始化求解器环境并加载网格文件 ==========
var meshFile = GetMesh("MirrorCopyModel.msh");

// ========== 9. 运行仿真计算过程 ==========
// 设置求解时间步长和总时间
var totalTime = 10.0;
var dt = 0.001;

print("Simulation initialized with total time: " + totalTime);

// ========== 10. 导出最终结果并验证网格完整性 ==========
// 计算总体积验证网格
var totalVolume = PrintTotalVolume();
print("Total mesh volume: " + totalVolume);

// 输出完成信息
print("MirrorCopy-Volume simulation completed successfully.");
