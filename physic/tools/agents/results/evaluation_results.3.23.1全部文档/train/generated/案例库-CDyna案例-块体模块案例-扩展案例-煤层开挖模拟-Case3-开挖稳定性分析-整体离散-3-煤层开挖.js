setCurDir(getSrcDir());

// 清除模块数据
dyna.Clear();
doc.clearResult();

// 打开固体计算开关
dyna.Set("Mechanic_Cal 1");

// 设置系统不平衡率为1e-5
dyna.Set("UnBalance_Ratio 1e-5");

// 设置3个方向的重力加速度
dyna.Set("Gravity 0 -9.8 0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 500");

// 打开接触更新开关
dyna.Set("If_Renew_Contact 1");

// 创建二维网格，长400m，高200m，长度方向50个网格，高度方向25个网格，组号为1
blkdyn.GenBrick2D(400, 200, 50, 25, 1);

// 将设定范围内的单元变成组2（煤层区域），便于开挖
blkdyn.SetGroupByCoord(2, 80, 320, 24, 40, -1, 1);

// 接触面离散，全部单元离散
blkdyn.CrtIFace();

// 更新接触拓扑
blkdyn.UpdateIFaceMesh();

// 将单元模型设置为线弹性模型
blkdyn.SetModel("linear");

// 设置组1（围岩）及组2（煤层）的材料参数：密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角、组号
blkdyn.SetMat(2500, 1e10, 0.25, 1e6, 0.8e6, 40.0, 10.0, 1);
blkdyn.SetMat(1072, 0.06e9, 0.31, 57.8e3, 9.29e3, 17.7, 10, 2);

// 设置接触模型为线弹性
blkdyn.SetIModel("linear");

// 设置接触参数，从单元中继承
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();

// 模型底部施加全约束
blkdyn.FixV("y", 0.0, "y", -0.01, 0.01);

// 模型左右两侧施加法向约束
blkdyn.FixV("x", 0.0, "x", -0.01, 0.01);
blkdyn.FixV("x", 0.0, "x", 399.99, 401);

// 求解至稳定
dyna.Solve();

// 设置单元模型为Mohr-Coulomb模型（考虑塑性破坏）
blkdyn.SetModel("MC");

// 设置接触面软化系数，断裂时的临界位移
dyna.Set("Interface_Soften_Value 1e-3 1e-3");

// 设置接触模型为脆性断裂模型
blkdyn.SetIModel("brittle");

// 重新求解进行开挖破坏分析
dyna.Solve();

// 监测块体破坏度
dyna.Monitor("gvalue", "gv_block_broken_ratio");

// 监测竖直应力
dyna.Monitor("block", "syy", 200, 150, 0);

// 监测水平应力
dyna.Monitor("block", "sxx", 200, 150, 0);

// 监测位移
dyna.Monitor("block", "ux", 200, 150, 0);
dyna.Monitor("block", "uy", 200, 150, 0);

// 输出系统能量分布
doc.OutputEnergy();

// 输出单元损伤状态
doc.OutputDamage();

// 输出应力应变结果
doc.OutputStressStrain();
