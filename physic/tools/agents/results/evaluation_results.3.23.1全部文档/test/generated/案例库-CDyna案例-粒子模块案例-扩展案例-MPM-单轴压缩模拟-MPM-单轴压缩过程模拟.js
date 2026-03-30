setCurDir(getSrcDir());

// ==================== 初始化设置 ====================
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 0.0 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("Moniter_Iter 10");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.4");
dyna.Set("SaveFile_Out 1");

// ==================== 创建几何与颗粒 ====================
// 创建规则颗粒（压缩试样）
pdyna.RegularCreateByCoord(0.1, 0.1, 0.005, 0, 0.1, 0, 0.1, 0.0, 0);

// 设置组1为固体材料参数
pdyna.SetGroupByCoord(1, 0, 0.1, 0, 0.1, -1, 1);

// 设置材料参数：density, young, poisson, tension, cohesion, friction, localdamp, viscdamp
pdyna.SetMat(2500, 3e10, 0.25, 1e6, 1e6, 30.0, 0.0, 0.1, 1);

// ==================== MPM背景网格设置 ====================
// 创建MPM背景网格（2D平面应变）
mpm.SetBackGrid(2, 0.005, [-0.05, -0.05, 0], [100, 100, 0]);

// 设置MPM模型为DP模型（适用于压缩模拟）
mpm.SetModelByGroup("DP", 1, 1);

// ==================== 边界条件设置 ====================
// Y方向底部法向约束（固定）
blkdyn.FixV("y", 8e-8, "y", -0.001, 0.001);

// Y方向顶部施加准静态竖直向下的速度载荷（压缩）
blkdyn.FixV("y", -8e-8, "y", 0.2, 0.25);

// ==================== 沙漏阻尼设置 ====================
// 设置局部阻尼系数（参考技术手册，虚质量取0.15）
blkdyn.SetLocalDamp(0.15);

// ==================== 应力监测设置 ====================
// 监测试样中部Y方向应力
dyna.Monitor("block", "syy", 0.0, 0.1, 0);
dyna.Monitor("block", "syy", 0.05, 0.1, 0);

// 监测X方向应变（横向变形）
dyna.Monitor("block", "exx", 0.0, 0.1, 0);

// ==================== 求解设置 ====================
// 设置计算时步
dyna.Set("Time_Step 1e-6");

// 求解（根据压缩过程设定步数）
dyna.Solve(50000);

// ==================== 清理资源 ====================
dyna.FreeUDF();
