setCurDir(getSrcDir());

// 全局仿真设置
dyna.Set("Large_Displace 1");
dyna.Set("Gravity 0 0 0");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Output_Interval 200");
dyna.Set("If_Virtural_Mass 0");

// 导入圆环几何并建立接触面
blkdyn.ImportGrid("gid","annular.msh");
blkdyn.CrtBoundIFaceByGroup(1);
blkdyn.UpdateIFaceMesh();

// 设置块体材料参数（密度，弹性模量，泊松比，粘聚力，抗拉强度，内摩擦角，剪胀角）
blkdyn.SetModel("MC");
blkdyn.SetMat(2000, 3e7, 0.25, 1e4, 0.5e4, 20, 5);

// 设置脆性断裂本构与内聚力参数
blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(1e8, 1e8, 10, 0, 0);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.01);

// 导入刚性面边界
rdface.Import("gid","bound.msh");

// 施加径向速度：内刚性面膨胀，外刚性面收缩
rdface.ApplyRadialVelocity(1, 1, [0,0,0], [0,0,1], 0.01, 1, 1);
rdface.ApplyRadialVelocity(2, 1, [0,0,0], [0,0,1], -0.01, 2, 2);

// 时间步长控制
dyna.TimeStepCorrect(0.8);

// 输出结果：块度分布曲线、应力、应变、速度
blkdyn.ExportGradationCurveByGroup(1, 1);
blkdyn.ExportElemResult("Stress", 1);
blkdyn.ExportElemResult("Strain", 1);
blkdyn.ExportElemResult("Vel", 1);

// 求解计算
dyna.Solve(2000);
