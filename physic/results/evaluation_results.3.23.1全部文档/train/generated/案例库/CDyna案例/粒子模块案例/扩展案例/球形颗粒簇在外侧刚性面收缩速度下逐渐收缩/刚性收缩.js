setCurDir(getSrcDir());

// 设置大位移开关
dyna.Set("Large_Displace 1");

// 关闭重力影响
dyna.Set("Gravity 0 0 0");

// 开启接触更新
dyna.Set("If_Renew_Contact 1");

// 设置输出间隔为200步
dyna.Set("Output_Interval 200");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 导入gid格式的颗粒模型
pdyna.Import("gid", "sphere.msh");

// 设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

// 设置材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2000, 1e8, 0.2, 0, 0, 10, 0.0, 0.1);

// 导入gid格式的刚性面边界
rdface.Import("gid", "sphere-bound.msh");

// 设置外侧刚性面向内施加径向速度，模式为2（法向不起作用），球形收缩
rdface.ApplyRadialVelocity(1, 2, [0, 0, 0], [0, 0, 1], -1, 2, 2);

// 设置时间步长修正系数
dyna.TimeStepCorrect(0.8);

// 迭代求解，总时间为2000秒
dyna.Solve(2000);
