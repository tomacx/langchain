setCurDir(getSrcDir());

// 设置大位移分析模式
dyna.Set("Large_Displace 1");

// 关闭重力影响
dyna.Set("Gravity 0 0 0");

// 开启接触更新
dyna.Set("If_Renew_Contact 1");

// 输出间隔设置为200步
dyna.Set("Output_Interval 200");

// 禁用虚拟质量
dyna.Set("If_Virtural_Mass 0");

// 导入圆环单元网格数据
blkdyn.ImportGrid("gid", "annular.msh");

// 创建边界接触面
blkdyn.CrtBoundIFaceByGroup(1);
blkdyn.UpdateIFaceMesh();

// 设置材料模型为MC（Mohr-Coulomb）
blkdyn.SetModel("MC");
// 设置材料参数：密度、弹性模量、泊松比、抗剪强度、粘聚力、抗拉强度
blkdyn.SetMat(1900, 3e7, 0.25, 1e4, 0.5e4, 20, 5);
// 设置接触模型为脆性MC（Mohr-Coulomb）
blkdyn.SetIModel("brittleMC");
// 设置接触面材料参数：法向刚度、切向刚度、内摩擦角
blkdyn.SetIMat(1e8, 1e8, 10, 0, 0);
// 设置局部阻尼系数为0.01
blkdyn.SetLocalDamp(0.01);

// 导入刚性面网格数据
rdface.Import("gid", "bound.msh");

// 对内侧刚性面施加向外的径向速度
rdface.ApplyRadialVelocity(1, 1, [0, 0, 0], [0, 0, 1], 0.01, 1, 1);

// 对外测刚性面施加向内的径向速度
rdface.ApplyRadialVelocity(2, 1, [0, 0, 0], [0, 0, 1], -0.01, 2, 2);

// 时间步长校正，系数为0.8
dyna.TimeStepCorrect(0.8);

// 执行计算，共2000步
dyna.Solve(2000);
