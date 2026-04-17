setCurDir(getSrcDir());

// 初始化几何模型
igeo.GenerateCylinder([0, -0.1, 0], [0, 0.2, 0], [1, 0, 0], 0.1);

// 加载网格信息
igmesh.LoadFromGeo();

// 设置HJC材料参数
mat.SetMaterialParams('CONCRETE', {
    rho: 2400,
    E: 30000,
    nu: 0.2,
    sigmaY: 100,
    alphaM: 1.5,
    beta: 1.9,
    C3: 7.5e-4
});

// 应用HJC本构模型
mat.ApplyModel('HJC', 'CONCRETE');

// 设置边界条件
bc.SetDisplacement([0, -1, 0], [0, 0, 0]);
bc.ApplyVelocity([0, 1, 0], 10);

// 配置求解器参数
solver.SetTimeStep(1e-5);
solver.SetMaxIter(10000);
solver.SetOutputInterval(100);

// 输出注释
console.log('Simulation setup:');
console.log(`Material: HJC for CONCRETE`);
console.log(`Grid size: 100x100x200`);
console.log(`Boundary conditions:`);
console.log(`- Bottom: fixed displacement in Y direction`);
console.log(`- Top: constant velocity load in -Y direction`);

// 开始模拟
solver.RunSimulation();