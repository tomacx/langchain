// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getCurDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置三个方向的重力加速度均为0
dyna.Set("Gravity 0.0 -9.8 0.0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置不平衡率为5e-4
dyna.Set("UnBalance_Ratio 5e-4");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 导入GiD格式的网格文件
blkdyn.ImportGrid("GiD", "example.msh");

// 设置实体单元为线弹性模型
blkdyn.SetModel("linear");

// 设置固体单元的材料参数，例如：密度、弹性模量、泊松比等
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e4, 1e4, 25.0, 10.0, 1);

// 对模型的底部及左右两侧进行法向约束
blkdyn.FixV("y", 0.0, "y", -0.01, 0.01);
blkdyn.FixV("x", 0.0, "x", -0.01, 0.01);
blkdyn.FixV("x", 0.0, "x", 29.99, 30.01);

// 设置局部阻尼为0.8
blkdyn.SetLocalDamp(0.8);

// 监测典型测点的竖向应力
dyna.Monitor("block", "syy", 15, 13, 0);
dyna.Monitor("block", "syy", 15, 16, 0);
dyna.Monitor("block", "syy", 15, 19, 0);

// 求解
dyna.Solve(100000);
