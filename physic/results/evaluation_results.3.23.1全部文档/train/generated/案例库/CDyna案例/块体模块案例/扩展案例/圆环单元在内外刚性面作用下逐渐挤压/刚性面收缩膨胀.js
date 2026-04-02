setCurDir(getSrcDir());

dyna.Set("Large_Displace", 1);
dyna.Set("Gravity", [0, 0, 0]);
dyna.Set("If_Renew_Contact", 1);
dyna.Set("Output_Interval", 200);
dyna.Set("If_Virtural_Mass", 0);

// 导入圆环单元网格模型
blkdyn.ImportGrid("gid","annular.msh");

// 创建内外刚性面边界条件
rdface.Import("gid","bound.msh");

// 内测刚性面施加向外的径向速度
rdface.ApplyRadialVelocity(1, 1, [0,0,0], [0,0,1], 0.01, 1, 1);

// 外测刚性面施加向内的径向速度
rdface.ApplyRadialVelocity(2, 1, [0,0,0], [0,0,1], -0.01, 2, 2);

// 设置模型和材料参数
blkdyn.SetModel("MC");
blkdyn.SetMat(1900, 3e7, 0.25, 1e4, 0.5e4, 20, 5);
blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(1e8, 1e8, 10, 0, 0);
blkdyn.SetLocalDamp(0.01);

// 时间步长修正
dyna.TimeStepCorrect(0.8);

// 求解
dyna.Solve(2000);
