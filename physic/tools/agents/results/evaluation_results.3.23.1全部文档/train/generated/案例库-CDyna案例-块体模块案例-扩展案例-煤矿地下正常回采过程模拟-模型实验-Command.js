setCurDir(getSrcDir());

// 初始化求解器参数
dyna.Set("Mechanic_Cal 1");
dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Output_Interval 100000");
dyna.Set("Moniter_Iter 100");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.4");
dyna.Set("Contact_Detect_Tol 0.0");

// 创建三维颗粒模型（模拟煤岩体）
blkdyn.CreateByCoord(0, 0, 0, 200, 100, 50, 30, 1);

// 设置接触面离散
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置模型为线弹性本构
blkdyn.SetModel("linear");

// 定义煤岩体材料参数（密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角、组号）
// 煤层材料
blkdyn.SetMat(1072, 0.06e9, 0.31, 57.8e3, 9.29e3, 17.7, 10, 2);

// 粉砂岩材料
blkdyn.SetMat(1742, 0.01e9, 0.26, 126e3, 37.5e3, 16.3, 10, 1);
blkdyn.SetMat(1742, 0.01e9, 0.26, 126e3, 37.5e3, 16.3, 10, 4);
blkdyn.SetMat(1742, 0.01e9, 0.26, 126e3, 37.5e3, 16.3, 10, 7);
blkdyn.SetMat(1742, 0.01e9, 0.26, 126e3, 37.5e3, 16.3, 10, 17);
blkdyn.SetMat(1742, 0.01e9, 0.26, 126e3, 37.5e3, 16.3, 10, 20);
blkdyn.SetMat(1742, 0.01e9, 0.26, 126e3, 37.5e3, 16.3, 10, 28);

// 泥岩材料
blkdyn.SetMat(1728, 0.03e9, 0.28, 55.1e3, 17.1e3, 14.5, 10, 3);
blkdyn.SetMat(1728, 0.03e9, 0.28, 55.1e3, 17.1e3, 14.5, 10, 8);

// 设置接触模型为线弹性
blkdyn.SetIModel("linear");

// 设置接触参数从单元继承
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();

// 设置边界条件 - 底部全约束
blkdyn.FixV("y", 0.0, "y", -0.01, 0.01);

// 设置左右两侧法向约束（模拟巷道围岩约束）
blkdyn.FixV("x", 0.0, "x", -0.01, 0.01);
blkdyn.FixV("x", 0.0, "x", 199.99, 201);

// 设置开挖区域（组号2）
blkdyn.SetGroupByCoord(2, 50, 150, 20, 80, -1, 1);

// 设置接触软化参数（断裂时的临界位移）
dyna.Set("Interface_Soften_Value 1e-5 3e-5");

// 设置局部阻尼
blkdyn.SetLocalDamp(0.8);

// 设置监测点 - 应力监测
dyna.Monitor("block", "sxx", 100, 1, 0);
dyna.Monitor("block", "syy", 100, 1, 0);
dyna.Monitor("block", "szz", 100, 1, 0);

// 设置监测点 - 位移监测
dyna.Monitor("block", "u_x", 50, 1, 0);
dyna.Monitor("block", "u_y", 50, 1, 0);

// 绘制监测点位置
dyna.DrawMonitorPos();

// 执行求解
dyna.Solve();

// 输出模型结果到Result文件夹
OutputModelResult();

// 生成云图可视化分析
Plot("block", "syy");
Plot("block", "u_y");
