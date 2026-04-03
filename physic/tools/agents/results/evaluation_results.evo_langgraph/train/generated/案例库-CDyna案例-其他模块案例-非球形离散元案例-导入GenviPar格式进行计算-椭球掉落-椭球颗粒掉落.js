setCurDir(getSrcDir());

// 仿真环境配置
dyna.Set("Output_Interval 1000");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0.0 0.0 -9.8");
dyna.Set("Contact_Detect_Tol 5e-3");
dyna.Set("GiD_Out 1");
dyna.Set("Time_Step 2e-4");

// 创建底部刚性面
rdface.Create(1, 1, 2, [-100.0, -100.0, -10.0, 100.0, 100.0, -10.0]);

// 导入GenviPar格式椭球颗粒
pdyna.ImportPartGenviPar("ellipsoid.gvpx");

// 设置材料参数
pdyna.SetPartMat(2500, 1e9, 0.25, 0, 0, 30, 0.01, 0.1, 0.1);

// 设置接触模型
pdyna.SetModel("brittleMC");

// 执行计算
dyna.Solve(50000);
