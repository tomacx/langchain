setCurDir(getSrcDir());

// 初始化仿真环境
dyna.Clear();
imeshing.clear();

// 全局计算参数设置
dyna.Set("Time_Step 5e-3");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Output_Interval 200");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Renew_Interval 10");
dyna.Set("Block_Rdface_Contact_Scheme 3");

// 创建有限元土体几何模型（块体网格）
imeshing.genBrick3D("soil", 20, 1, 5, 80, 5, 20, -5, -1, -2.5);

// 获取土体网格到块体模块
blkdyn.GetMesh(imeshing);

// 创建接触面（轮胎与土体界面）
blkdyn.CrtIFaceByCoord(-100, 100, -0.001, 0.001, -100, 100);
blkdyn.UpdateIFaceMesh();

// 设置块体模型为Mohr-Coulomb本构
blkdyn.SetModel("MC");

// 设置土体材料参数：密度、弹性模量、泊松比、抗拉强度、抗压强度、内摩擦角、粘聚力
blkdyn.SetMat(1500, 1e7, 0.25, 1e4, 1e4, 20, 10);

// 设置接触面模型为脆性断裂Mohr-Coulomb本构
blkdyn.SetIModel("brittleMC");

// 设置接触面材料参数：法向刚度、切向刚度、内摩擦角、粘聚力、抗拉强度
// 弱强度参数设置，模拟界面破坏及滑移行为
blkdyn.SetIMat(1e10, 1e10, 26.0, 0, 0);

// 设置接触面单元刚度（单位面积切向刚度）
blkdyn.SetIStiffByElem(10.0);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.8);

// 约束土体边界条件，确保模型稳定性
// X方向约束
blkdyn.FixV("x", 0.0, "x", -6, -4.999);
blkdyn.FixV("x", 0.0, "x", 14.99, 15.1);

// Z方向约束（底部固定）
blkdyn.FixV("z", 0.0, "z", -2.6, -2.499);
blkdyn.FixV("z", 0.0, "z", 2.499, 2.6);

// Y方向约束（防止侧向位移）
blkdyn.FixV("xyz", 0, "y", -1.1, -0.99);

// 导入轮胎刚体网格
rdface.Import("gid", "wheel.msh");

// 创建刚体部分
rdface.CrtPart("feng");

// 设置轮胎刚体属性：密度、质心坐标、转动惯量
rdface.SetPartProp(1.9e+03, [-9.363010e-06, 4.997800e-01, 1.240097e-01],
                   [1.313625e+01, 1.315585e+01, 2.425868e+01, 0, 0, 0], "feng");

// 设置轮胎旋转速度（绕Y轴旋转）
rdface.SetPartRotaVel([0, 0, 0], [1, 1, 1]);

// 施加驱动力矩驱动轮胎旋转
rdface.SetPartForce([0, -20000, 0]);

// 设置刚体局部阻尼
rdface.SetPartLocalDamp(0.8, 0.8);

// 设置重力加速度（Z方向向下）
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置接触容差
dyna.Set("Contact_Detect_Tol 5e-3");

// 设置监测点：记录轮胎位移和应力演化
dyna.Monitor("rdface", "rg_xDis", 1, 1, 1);
dyna.Monitor("rdface", "rg_yDis", 1, 1, 1);
dyna.Monitor("rdface", "rg_zDis", 1, 1, 1);

// 设置土体监测点：记录关键区域应力和位移
dyna.Monitor("block", "sxx", 0, 0.5, 0);
dyna.Monitor("block", "syy", 0, 0.5, 0);
dyna.Monitor("block", "szz", 0, 0.5, 0);
dyna.Monitor("block", "ux", 0, 0.5, 0);
dyna.Monitor("block", "uy", 0, 0.5, 0);

// 执行仿真计算
dyna.Solve(100000);
