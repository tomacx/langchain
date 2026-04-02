setCurDir(getSrcDir());

// 设置大变形计算开关
dyna.Set("Large_Displace 1");

// 关闭重力影响
dyna.Set("Gravity 0 0 0");

// 开启接触更新
dyna.Set("If_Renew_Contact 1");

// 设置输出间隔为200步
dyna.Set("Output_Interval 200");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 导入网格文件
blkdyn.ImportGrid("gid","annular.msh");

// 创建边界界面并更新网格
blkdyn.CrtBoundIFaceByGroup(1);
blkdyn.UpdateIFaceMesh();

// 设置材料模型为MC（Mohr-Coulomb）
blkdyn.SetModel("MC");
blkdyn.SetMat(1900, 3e7, 0.25, 1e4, 0.5e4, 20, 5);

// 设置接触模型
blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(1e8, 1e8, 10, 0, 0);

// 设置局部阻尼为0.01
blkdyn.SetLocalDamp(0.01);

// 导入刚性面网格文件
rdface.Import("gid","bound.msh");

// 内侧刚性面施加向外的径向速度
rdface.ApplyRadialVelocity(1, 1, [0,0,0], [0,0,1], 0.01, 1, 1);

// 外测刚性面施加向内的径向速度
rdface.ApplyRadialVelocity(2, 1, [0,0,0], [0,0,1], -0.01, 2, 2);

// 调整时间步长以确保计算稳定
dyna.TimeStepCorrect(0.8);

// 求解指定的步数
dyna.Solve(2000);
