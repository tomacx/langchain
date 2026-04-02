setCurDir(getSrcDir());

// 设置重力加速度
dyna.Set("Gravity", 0, -9.8, 0);

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass", 0);

// 设置接触检测容差为0
dyna.Set("Contact_Detect_Tol", 0.0);

// 设置输出间隔为500步
dyna.Set("Output_Interval", 500);

// 设置接触搜索方法为2
dyna.Set("Contact_Search_Method", 2);

// 设置粒子更新间隔为1
dyna.Set("Particle_Renew_Interval", 1);

// 关闭优化单元长度开关
dyna.Set("If_Opti_Cell_Length", 0);

// 设置最小单元长度为4.0
dyna.Set("Min_Cell_Length", 4.0);

// 设置OpenMP子块数量为136
dyna.Set("OpenMP_SubBlock_No", 136);

// 导入颗粒数据
pdyna.Import("pdyna","OriginPar.dat");

// 设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

// 设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e8, 0.25, 0, 0, 0, 0, 0.1);

// 导入刚性面数据
rdface.Import("gid","bound.msh");

// 时间步长校正
dyna.TimeStepCorrect(0.3);

// 求解时间步数为30000
dyna.Solve(30000);
