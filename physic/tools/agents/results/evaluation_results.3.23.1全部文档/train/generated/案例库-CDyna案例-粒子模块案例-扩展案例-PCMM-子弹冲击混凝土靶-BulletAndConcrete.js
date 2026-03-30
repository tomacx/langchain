setCurDir(getSrcDir());

// 设置计算环境参数
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Large_Displace 1");
dyna.Set("Virtural_Step 0.3");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("PCMM_Elem_Tol 0.0018");
dyna.Set("Particle_Cal_Type 2");

// 创建子弹弹头（钨合金）
pdyna.RegularCreateByCoord(1, 1, 0.001, -0.02, 0, -0.005, 0.005, 0, 0);

// 创建混凝土靶板
pdyna.RegularCreateByCoord(2, 1, 0.001, 0.01, 0.031, -0.15, 0.15, 0, 0);

// 设置材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数
pdyna.SetMat(19220, 7.1e11, 0.23, 1e9, 1e9, 0, 0.005, 0.0, 1); // 钨弹头
pdyna.SetMat(2550, 3e10, 0.25, 5e6, 5e6, 35, 0.005, 0.0, 2); // 混凝土

// 初始化子弹速度（沿X方向）
var fvalue = new Array(100.0, 0.0, 0.0);
pdyna.InitCondByGroup("velocity", fvalue, 1, 1);

// 设置PCMM本构模型为Mohr-Coulomb
pcmm.SetModelByGroup("MC", 1, 11);

// 固定混凝土靶板底部边界条件
pdyna.FixV("xyz", 0.0, "y", -0.16, -0.149);
pdyna.FixV("xyz", 0.0, "y", 0.149, 0.16);

// 设置时间步长（高速冲击需要较小步长）
dyna.Set("Time_Step 2e-8");

// 计算颗粒与块体接触力
pdyna.CalPBContact();

// 求解仿真
dyna.Solve(30000);

// 输出穿透监测信息
pfly.ExportPeneTargetInfo(60.0, 1e9, 1e9);
