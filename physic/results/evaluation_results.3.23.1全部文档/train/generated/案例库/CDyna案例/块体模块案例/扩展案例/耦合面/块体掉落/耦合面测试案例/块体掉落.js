setCurDir(getSrcDir());

dyna.Set("Output_Interval 500");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");

blkdyn.ImportGrid("gid", "Model.msh");

blkdyn.SetModel("linear");

blkdyn.SetMat(2500, 3e9, 0.25, 3e4, 1e4, 15, 15);

blkdyn.SetLocalDamp(0.01);

// 固定底部边界
blkdyn.FixVByGroupInterface("xyz", 0.0, 1, 1);

// 创建耦合面
trff.CrtFace(2, 100);

// 设置耦合面模型为脆性断裂模型
trff.SetModel("brittleMC");

// 设置耦合参数
trff.SetMat(1e9, 1e9, 20, 0, 0, 1e8);

dyna.TimeStepCorrect(0.8);

// 添加重力
dyna.Set("Gravity 0 0 -9.8");

// 开始求解
dyna.Solve();
