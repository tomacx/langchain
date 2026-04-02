setCurDir(getSrcDir());

// 设置重力加速度为0（无重力环境）
dyna.Set("Gravity 0.0 0.0 0.0");

// 设置输出间隔为500步
dyna.Set("Output_Interval 500");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 设置接触检测容差为0.001m
dyna.Set("Contact_Detect_Tol 0.001");

// 创建颗粒系统，指定密度、弹性模量等材料参数
pdyna.CreateByCoord(5000, 1, 1, 0.05, 0.1, 0.05, [-3, 1], [0.1, 2.4], [0, 1]);

// 设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

// 设置材料参数，包括密度、弹性模量等
pdyna.SetMat(2500, 1e7, 0.25, 0.0, 0.0, 25, 0.0, 0.3);

// 导入刚性面边界
rdface.Import("gid", "boundary.msh");

// 设置计算时间步长为1e-4秒
dyna.Set("Time_Step 1e-4");

// 迭代1万步进行模拟
dyna.Solve(10000);
