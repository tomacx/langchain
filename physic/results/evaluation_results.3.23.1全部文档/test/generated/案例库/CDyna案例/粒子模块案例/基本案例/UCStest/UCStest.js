// 设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

// 设置输出间隔为500步
dyna.Set("Output_Interval 500");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 设置三个方向的重力加速度
dyna.Set("Gravity 0.0  0.0 -9.8");

// 设置接触容差为0.001m
dyna.Set("Contact_Detect_Tol 0.001");

// 导入gid格式的刚性面边界
rdface.Import(2,"bound-mesh.msh");

// 导入gid格式的颗粒
pdyna.Import("gid","particle-coarse.msh");

// 设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

// 设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e8, 0.25, 0.0, 0.0, 25, 0.0, 0.3);

// 设置计算时步
dyna.Set("Time_Step 5e-3");

// 迭代1万步
dyna.Solve(10000);
