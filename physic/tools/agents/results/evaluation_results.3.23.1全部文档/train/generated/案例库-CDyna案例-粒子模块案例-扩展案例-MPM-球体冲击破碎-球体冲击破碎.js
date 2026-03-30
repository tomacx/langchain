setCurDir(getSrcDir());

// 仿真环境初始化
dyna.Set("Output_Interval 200");
dyna.Set("Gravity  0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Time_Step 5e-6");
dyna.Set("UnBalance_Ratio 1e-3");
dyna.Set("Particle_Cal_Type 4");
dyna.Set("Block_Soften_Value 1e-1 3e-1");

// 设置颗粒与刚性面接触模型采用全局参数
dyna.Set("If_Contact_Use_GlobMat 1 2 5e9 5e9 0.0 0.0 0.0");

// 导入球体颗粒簇
pdyna.Import("gid", "BallD0.4.msh");

// 初始化球体冲击速度（-50m/s沿Y方向）
pdyna.InitCondByGroup("velocity", [0, -50.0, 0], 1, 100);

// 设置颗粒材料参数：density, young, poisson, tension, cohesion, friction, localdamp, viscdamp
pdyna.SetMat(2000, 1e9, 0.35, 10e6, 10e6, 30.0, 0.01, 0);

// 创建MPM背景网格
mpm.SetBackGrid(3, 0.025, [-1, -0.6, -1], [80, 40, 80]);

// 设置MPM模型为Mohr-Coulomb应变软化模型
mpm.SetModelByGroup("MC", 1, 2);

// 创建三维刚性面（承载结构）
var fCoord = new Array();
fCoord[0] = new Array(-1.0, -0.5, -1);
fCoord[1] = new Array(1, -0.5, -1);
fCoord[2] = new Array(1, -0.5, 1);
fCoord[3] = new Array(-1, -0.5, 1);
rdface.Create(2, 2, 4, fCoord);

// 设置刚性面材料参数（高刚度）
pdyna.SetMat(7800, 2e11, 0.3, 1e9, 1e9, 50.0, 0.0, 0);

// 计算颗粒与块体接触力
pdyna.CalPBContact();

// 计算颗粒间接触力
pdyna.CalPPContact();

// 配置应力、应变及损伤变量历史输出监测
dyna.Monitor("stress", "strain", "damage");

// 执行仿真计算循环（4000步）
dyna.Solve(4000);

// 导出结果数据
doc.ExportResult();
