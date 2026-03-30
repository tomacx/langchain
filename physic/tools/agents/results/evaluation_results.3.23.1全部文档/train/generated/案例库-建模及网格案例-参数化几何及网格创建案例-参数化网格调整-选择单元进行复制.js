setCurDir(getSrcDir());

// ========== 1. 初始化与参数设置 ==========
var params = {
    width: 10.0,
    height: 5.0,
    depth: 3.0,
    cellSize: 0.5,
    materialName: "砂岩",
    outputDir: "./results"
};

// ========== 2. 创建参数化几何网格 ==========
igeo.genBrick3D(params.materialName, params.width, params.height, params.depth,
                Math.floor(params.width / params.cellSize),
                Math.floor(params.height / params.cellSize),
                Math.floor(params.depth / params.cellSize));

// ========== 3. 网格剖分与导入 ==========
imeshing.genMeshByGmsh(3);

// ========== 4. 参数化网格调整 - 选择特定区域单元 ==========
var esel = new SelElems(imeshing);

// 选择中间区域的单元（x方向0-5，y方向1-3）
var nSelected = esel.box(0, 1, 0, 5, 3, 2);
print("选中单元数量: " + nSelected);

// ========== 5. 单元复制操作 ==========
// 在选中的单元基础上复制一份，位置偏移量为(6, 0, 0)
imeshing.copy(6, 0, 0, 1, esel);

// 重新选择新复制的单元进行验证
var nCopied = esel.box(6, 1, 0, 11, 3, 2);
print("复制后单元数量: " + nCopied);

// ========== 6. 设置材料属性与边界条件 ==========
// 定义材料参数（密度、弹性模量、泊松比）
var matParams = {
    density: 2700.0,      // kg/m³
    elasticModulus: 25e9, // Pa
    poissonsRatio: 0.25,
    frictionAngle: 30.0   // 度
};

// 设置材料属性（简化处理，实际需根据单元ID逐个赋值）
var mat = new Material(imeshing);
mat.setDensity(matParams.density);
mat.setElasticModulus(matParams.elasticModulus);
mat.setPoissonsRatio(matParams.poissonsRatio);

// 设置边界条件 - 固定底部
var bc = new BoundaryCondition(imeshing);
bc.fixBottom();

// ========== 7. 配置输出与监测变量 ==========
var outputConfig = {
    pressureFile: "./results/pressure.dat",
    velocityFile: "./results/velocity.dat",
    stressFile: "./results/stress.dat",
    timeStep: 1e-6,
    totalTime: 0.5
};

// 设置输出路径
setCurDir(outputConfig.outputDir);

// ========== 8. DEM求解器组装与接触检测 ==========
pdyna.CellMapping();

// ========== 9. 初始化求解器与循环执行 ==========
var solver = new Solver(imeshing);
solver.initSolver();

// 执行求解循环（简化示意）
for (var t = 0; t < outputConfig.totalTime; t += outputConfig.timeStep) {
    solver.step(t, outputConfig.timeStep);
}

// ========== 10. 导出结果与清理 ==========
solver.exportResults(outputConfig.pressureFile);
solver.exportResults(outputConfig.velocityFile);
solver.exportResults(outputConfig.stressFile);

print("仿真完成，结果已导出至: " + outputConfig.outputDir);
