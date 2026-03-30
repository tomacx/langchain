setCurDir(getSrcDir());

// 1. 初始化仿真环境并使用DefMesh接口定义三维计算流体域网格尺寸与分割数
skwave.DefMesh(3, [5.0, 2.5, 2.0], [20, 10, 8]);

// 2. 设置汽车几何边界条件 - 导入STL格式的几何边界文件
var msh1 = imesh.importStl("qiche1.stl");
var msh2 = imesh.importStl("qiche2.stl");
var msh3 = imesh.importStl("qiche3.stl");
var msh4 = imesh.importStl("qiche4.stl");
var msh5 = imesh.importStl("qiche5.stl");
var msh6 = imesh.importStl("qiche6.stl");

// 加载所有边界到模型中
pargen.addBound(msh1, msh2, msh3, msh4, msh5, msh6);

// 设置优化位置选项以改善颗粒填充质量
pargen.setValue("OptiPosOption", 1);

// 3. 配置球形颗粒的材料属性、初始粒径及填充密度
var parmsh = pargen.gen(0.005); // 粒子半径为5mm

// 设置颗粒材料参数（通过Set UserDefValue指定）
setUserDefValue("Particle_Density", 2700.0); // 铝合金密度 kg/m³
setUserDefValue("Particle_Elastic_Modulus", 70e9); // 弹性模量 Pa
setUserDefValue("Particle_Poisson_Ratio", 0.33); // 泊松比
setUserDefValue("Particle_Friction_Coefficient", 0.4); // 颗粒间摩擦系数

// 4. 在每一迭代步开始时调用CellMapping函数将颗粒映射到背景格子上
var step = 1;
while (step <= getTotalSteps()) {
    pdyna.CellMapping();
    step++;
}

// 5. 使用CustomModel_Particle接口定义颗粒接触本构模型参数
setUserDefValue("Contact_Stiffness", 1e8); // 接触刚度 N/m
setUserDefValue("Contact_Damping_Ratio", 0.1); // 阻尼比
setUserDefValue("Contact_Failure_Criterion", "Mohr-Coulomb"); // 破坏准则

// 6. 施加初始速度场或压力驱动源 - 设置颗粒向车体内部填充的初始条件
setUserDefValue("Initial_Velocity_X", 0.0);
setUserDefValue("Initial_Velocity_Y", 0.0);
setUserDefValue("Initial_Velocity_Z", 5.0); // 向下填充速度 m/s

// 7. 设置关键监测点以记录颗粒位移、速度及接触力历史数据
var monitorPoint1 = [1.2, 1.0, 0.5];
var monitorPoint2 = [2.0, 1.5, 0.8];
var monitorPoint3 = [3.5, 0.5, 1.2];

// 添加监测点并配置输出频率
setMonitor(monitorPoint1, "Displacement", "Velocity", "ContactForce");
setMonitor(monitorPoint2, "Displacement", "Velocity", "ContactForce");
setMonitor(monitorPoint3, "Displacement", "Velocity", "ContactForce");

// 8. 配置输出文件路径与格式
setOutputPath("output/");
setOutputFormat("vtk", "csv");
setOutputFrequency(10); // 每10个时间步输出一次

// 9. 启动求解器循环执行物理计算
var totalTime = 2.0; // 总仿真时间 s
var dt = 1e-6; // 时间步长 s
var endTime = getTotalTime();

while (getTotalTime() < endTime) {
    pdyna.SolveStep(dt);
}

// 10. 分析仿真结果并生成可视化报告
setOutputReport("filling_analysis_report.txt");
setPlotSetting("ParticleDisplay", "ForceChain"); // 设置颗粒力链显示
generateVisualizationReport();

// 输出最终状态信息
console.log("汽车案例球形粒子填充仿真完成");
console.log("总时间: " + getTotalTime() + " s");
console.log("颗粒数量: " + getParticleCount());
