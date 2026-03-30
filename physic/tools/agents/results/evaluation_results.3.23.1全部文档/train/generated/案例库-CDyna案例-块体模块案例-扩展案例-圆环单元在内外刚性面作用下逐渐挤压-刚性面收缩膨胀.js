setCurDir(getSrcDir());

// 初始化全局仿真参数
dyna.Set("Large_Displace 1");
dyna.Set("Gravity 0 0 0");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Output_Interval 200");
dyna.Set("If_Virtural_Mass 0");

// 导入圆环单元网格
blkdyn.ImportGrid("gid", "annular.msh");

// 创建内外刚性面边界（基于节点组）
blkdyn.CrtBoundIFaceByGroup(1);

// 更新界面网格以确保接触表示准确
blkdyn.UpdateIFaceMesh();

// 设置块体模型为脆性断裂模型
blkdyn.SetModel("MC");

// 设置固体单元材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼
// 参数范围参考案例：密度2000-2500 kg/m³，弹性模量1e7-3e10 Pa，泊松比0.2-0.3
blkdyn.SetMat(2200, 3e8, 0.25, 1e4, 0.5e4, 20, 5);

// 设置界面模型为脆性断裂模型
blkdyn.SetIModel("brittleMC");

// 设置界面材料参数：密度、弹性模量、泊松比
blkdyn.SetIMat(1e8, 1e8, 10, 0, 0);

// 设置局部阻尼系数
blkdyn.SetLocalDamp(0.01);

// 导入刚性面边界文件
rdface.Import("gid", "bound.msh");

// 内侧刚性面施加向外的径向速度（膨胀）
rdface.ApplyRadialVelocity(1, 1, [0, 0, 0], [0, 0, 1], 0.01, 1, 1);

// 外侧刚性面施加向内的径向速度（收缩）
rdface.ApplyRadialVelocity(2, 1, [0, 0, 0], [0, 0, 1], -0.01, 2, 2);

// 设置时间步长修正因子
dyna.TimeStepCorrect(0.8);

// 执行求解计算
dyna.Solve(2000);

// 释放动态链接库以释放系统资源
dyna.FreeUDF();
