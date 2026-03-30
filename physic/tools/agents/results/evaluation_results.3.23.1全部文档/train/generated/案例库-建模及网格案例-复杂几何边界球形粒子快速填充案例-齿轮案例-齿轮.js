setCurDir(getSrcDir());

// 1. 初始化仿真环境并定义齿轮几何边界坐标范围
var msh1 = imesh.importStl("gear1.stl");
var msh2 = imesh.importStl("gear2.stl");
var msh3 = imesh.importStl("gear3.stl");

// 添加几何边界约束
pargen.addBound(msh1, msh2, msh3);

// 2. 设置球形粒子的半径参数及空腔填充标志位
// 齿轮案例粒子半径设为0.0002m (0.2mm)
var particleRadius = 0.0002;
pargen.gen(particleRadius);

// 3. 配置接触模型参数并加载自定义本构关系接口
// 设置颗粒材料属性（密度、弹性模量等）
pcmm.SetModelByGroup(1, "Linear_Elastic");
pcmm.SetKGVByGroup(1, [2700.0, 75e9, 30e9]); // 密度(kg/m^3), 体积模量(Pa), 剪切模量(Pa)

// 4. 设置仿真时间步长及总迭代次数控制参数
var dt = 1e-7; // 时间步长 (s)
var totalSteps = 10000; // 总迭代次数

// 5. 启动求解器循环以进行粒子动力学计算
for (var step = 0; step < totalSteps; step++) {
    // 6. 在每一迭代步开始时重新执行格子映射以确保接触检测
    pdyna.CellMapping();

    // 7. 执行时间步进（自定义求解逻辑）
    dyna.TimeStep(dt);
}

// 8. 配置输出文件路径并开启颗粒力链与位置监测功能
pcmm.SetOutputFile("particle_output.dat");
pcmm.EnableForceChainMonitor(true);
pcmm.EnablePositionMonitor(true);

// 9. 完成仿真后导出最终粒子分布图及监测数据结果
var results = pcmm.ExportResults();
console.log("仿真完成，结果已导出至:", results.path);
