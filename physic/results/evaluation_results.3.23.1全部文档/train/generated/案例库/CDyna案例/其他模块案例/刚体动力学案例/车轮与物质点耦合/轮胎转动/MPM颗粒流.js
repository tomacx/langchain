setCurDir(getSrcDir());

// 设置计算参数
dyna.Set("Time_Step", 5e-3);
dyna.Set("If_Virtural_Mass", 1);
dyna.Set("Output_Interval", 200);
dyna.Set("Large_Displace", 1);
dyna.Set("If_Renew_Contact", 1);
dyna.Set("Renew_Interval", 10);
dyna.Set("Contact_Search_Method", 2);

// 创建规则颗粒
pdyna.RegularCreateByCoord(1, 2, 0.01, -0.5, 3, -0.31, 0.0, -0.8, 0.8);

// 设置材料参数
pdyna.SetMat(2000, 5e8, 0.25, 1e4, 3e4, 30, 0.8, 0.0);
pdyna.SetModel("brittleMC");

// 固定颗粒边界条件
pdyna.FixV("xyz", 0.0, "y", -1e5, -0.29);
pdyna.FixV("x", 0.0, "x", -1e5, -0.47);
pdyna.FixV("x", 0.0, "x", 2.97, 1e5);
pdyna.FixV("z", 0.0, "z", -1e5, -0.77);
pdyna.FixV("z", 0.0, "z", 0.77, 1e5);

// 导入刚性面
rdface.Import("gid", "wheel.msh");
rdface.CrtPart("feng");

// 设置刚性面属性
rdface.SetPartProp(1.9e+03, [-9.363010e-06, 4.997800e-01, 1.240097e-01], [1.313625e+01, 1.315585e+01, 2.425868e+01, 0, 0, 0], "feng");

// 设置刚性面旋转速度和局部阻尼
rdface.SetPartRotaVel([0, 0, 0], [1, 1, 1]);
rdface.SetPartForce([0, -20000, 0]);
rdface.SetPartLocalDamp(0.8, 0.8);

// 监控刚性面位移
dyna.Monitor("rdface", "rg_xDis", 1, 1, 1);
dyna.Monitor("rdface", "rg_yDis", 1, 1, 1);
dyna.Monitor("rdface", "rg_zDis", 1, 1, 1);

// 设置虚拟质量
dyna.Set("If_Virtural_Mass", 0);

// 调整时间步长
dyna.TimeStepCorrect(0.5);

// 求解
dyna.Solve();
