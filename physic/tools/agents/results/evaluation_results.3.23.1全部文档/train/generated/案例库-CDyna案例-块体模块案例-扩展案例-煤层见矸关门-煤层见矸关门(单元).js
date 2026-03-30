setCurDir(getSrcDir());

// 清除dyna模块数据
dyna.Clear();

// 清除平台结果模块数据
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

// 保存文件输出
dyna.Set("SaveFile_Out 1");

// 打开接触更新开关
dyna.Set("If_Renew_Contact 1");

// 创建煤层网格，长20m，高3m，长度方向20个网格，高度方向15个网格，组号为1
blkdyn.GenBrick2D(20, 3, 20, 15, 1);

// 将设定范围内的单元变成组2（矸石门区域）
blkdyn.SetGroupByCoord(2, 18, 20, 0.5, 3, -1, 1);

// 接触面离散，组1与组2之间离散
blkdyn.CrtIFace(1, 2);

// 更新接触拓扑
blkdyn.UpdateIFaceMesh();

// 将单元模型设置为线弹性模型
blkdyn.SetModel("linear");

// 设置组1（煤层）的材料参数：密度、弹性模量、泊松比、剪切模量、体积模量、屈服应力、屈服应变
blkdyn.SetMat(2500, 3e8, 0.25, 1e6, 1e6, 35, 15);

// 设置组2（矸石门）的材料参数（更硬的材料）
blkdyn.SetIMat(5e9, 5e9, 10, 0, 0);

// 设置接触模型为线弹性
blkdyn.SetIModel("linear");

// 设置接触参数，从单元中继承刚度
blkdyn.SetIStiffByElem(1);

// 设置接触强度继承
blkdyn.SetIStrengthByElem();

// 模型底部施加全约束
blkdyn.FixV("y", 0.0, "y", -0.01, 0.01);

// 模型左右两侧施加法向约束
blkdyn.FixV("x", 0.0, "x", -0.01, 0.01);
blkdyn.FixV("x", 0.0, "x", 19.99, 20.01);

// 设置监测点：监测块体破坏度
dyna.Monitor("gvalue", "gv_block_broken_ratio");

// 监测竖直应力
dyna.Monitor("block", "syy", 10, 1.5, 0);

// 监测水平位移
dyna.Monitor("block", "ux", 10, 1.5, 0);

// 求解至稳定
dyna.Solve();

// 输出模型结果
OutputModelResult();

// 输出监测数据
OutputMonitorData();
