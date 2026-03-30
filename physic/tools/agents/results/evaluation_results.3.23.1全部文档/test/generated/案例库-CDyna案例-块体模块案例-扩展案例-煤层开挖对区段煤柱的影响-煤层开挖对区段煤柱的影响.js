setCurDir(getSrcDir());

// 初始化环境
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

// 创建网格，长400m，高200m，长度方向50个网格，高度方向25个网格，组号为1
blkdyn.GenBrick2D(400, 200, 50, 25, 1);

// 将设定范围内的单元变成组2（煤层区域），便于开挖
blkdyn.SetGroupByCoord(2, 80, 320, 24, 40, -1, 1);

// 创建接触面，全部单元离散
blkdyn.CrtIFace();

// 更新接触拓扑
blkdyn.UpdateIFaceMesh();

// 将单元模型设置为线弹性模型
blkdyn.SetModel("linear");

// 设置材料参数：密度、弹性模量、泊松比、剪切模量、屈服强度、断裂能
blkdyn.SetMat(2500, 1e10, 0.25, 1e6, 0.8e6, 40.0, 10.0);

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

// 监测块体破坏度
dyna.Monitor("gvalue", "gv_block_broken_ratio");

// 监测竖直应力
dyna.Monitor("block", "syy", 200, 150, 0);

// 监测水平应力
dyna.Monitor("block", "sxx", 200, 150, 0);

// 监测Y方向位移
dyna.Monitor("block", "dis_y", 200, 150, 0);

// 设置数据输出文件路径与格式
dyna.Set("SaveFile_Out 1");

// 求解至稳定
dyna.Solve();

// 绘制云图分析开挖对煤柱稳定性的影响
blkdyn.Plot("syy", "竖直应力分布");
blkdyn.Plot("sxx", "水平应力分布");
blkdyn.Plot("dis_y", "竖向位移分布");
blkdyn.Plot("broken_ratio", "破坏度分布");
