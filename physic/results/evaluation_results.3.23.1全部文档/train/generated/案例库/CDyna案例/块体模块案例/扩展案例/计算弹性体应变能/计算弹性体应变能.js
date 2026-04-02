setCurDir(getSrcDir());

// 设置计算参数
dyna.Set("Gravity 0.0 0.0 0.0");
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");

// 导入刚性面边界和颗粒
rdface.Import(2, "boundary.msh");
pdyna.CreateByCoord(5000, 1, 1, 0.05, 0.1, 0.05, [-3, 1], [0.1, 2.4], [0, 1]);

// 设置颗粒模型和材料参数
pdyna.SetModel("brittleMC");
pdyna.SetMat(2500, 1e7, 0.25, 0.0, 0.0, 25, 0.0, 0.3);

// 设置计算时步
dyna.Set("Time_Step 1e-4");

// 迭代1万步
dyna.Solve(10000);
