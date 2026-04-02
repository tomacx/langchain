// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置三个方向的重力加速度，均为0
dyna.Set("Gravity 0 -9.8 0");

// 关闭大变形计算开关
dyna.Set("Large_Displace 1");

// 设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 500");

// 打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 设置满足稳定条件的系统不平衡率
dyna.Set("UnBalance_Ratio 1e-4");

// 关闭接触更新计算开关
dyna.Set("If_Renew_Contact 1");

// 设置接触容差为0.005m
dyna.Set("Contact_Detect_Tol 0.005");

// 导入gid格式的刚性面边界
rdface.Import(2,"bound.msh");

// 导入gid格式的块体数据
blkdyn.ImportGrid("gid","RockSlope.msh");

// 组号1,2之前切割形成接触面
blkdyn.CrtIFace(1, 2);

// 更新接触面网格
blkdyn.UpdateIFaceMesh();

// 设定所有单元的本构为线弹性本构
blkdyn.SetModel("linear");

// 设定组号为1-100之间的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼系数
blkdyn.SetMat(2500, 5e10, 0.25, 3e6, 1e6, 30.0, 15.0);

// 设定所有接触面的本构为线弹性模型
blkdyn.SetIModel("linear");

// 设置接触面材料参数，依次为法向刚度、切向刚度、内摩擦角、粘聚力
blkdyn.SetIMat(5e11, 5e11, 35, 3e6, 1e6);

// 设定全部节点的局部阻尼系数为0.8
blkdyn.SetLocalDamp(0.8);

// 固定模型四周的法向速度，为0.0
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 19.99, 20.01);
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// 设置计算时步
dyna.Set("Time_Step 5e-4");

// 自动优化计算时间步长
dyna.TimeStepCorrect(0.8);

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 求解至稳定
dyna.Solve();

// 设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

// 设置颗粒的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼系数
pdyna.SetMat(2500, 1e8, 0.25, 1e4, 1e4, 20, 0.8);

// 迭代3万步
dyna.Solve(30000);
