setCurDir(getSrcDir());

// 初始化仿真环境参数
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 1000");
dyna.Set("Moniter_Iter 100");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Renew_Interval 10");
dyna.Set("Contact_Detect_Tol 2e-3");

// 创建圆形刚性面（圆心在原点，半径1m，网格尺寸0.05m）
var rigidFaceId = igeo.genCircleS(0.0, 0.0, 0.0, 1.0, 0.05, 1);

// 创建下落体部件（使用CrtPart创建刚体部件）
var partId = blkdyn.CrtPart(1, 1, 1, 1);

// 设置下落体材料属性（密度、弹性模量、泊松比等）
blkdyn.SetMat(partId, 2500.0, 3e8, 0.25, 1e6, 1e6, 40.0, 10.0);

// 设置刚性面材料属性（刚性面使用特殊材料参数）
blkdyn.SetMat(rigidFaceId, 7800.0, 2e11, 0.3, 1e9, 1e9, 50.0, 20.0);

// 设置接触模型为脆性断裂Mohr-Coulomb本构
blkdyn.SetIModel("brittleMC");

// 设置接触面材料参数（法向刚度、切向刚度、内摩擦角、粘聚力、抗拉强度）
blkdyn.SetIMat(5e10, 5e10, 10.0, 0.0, 0.0);

// 设置局部阻尼系数
blkdyn.SetLocalDamp(0.01);

// 设置时间步长
dyna.Set("Time_Step 2e-5");

// 设置刚性面法向计算模式（使用Z轴方向）
dyna.Set("Rdface_NormalDir_Option 3");
dyna.Set("Rdface_NormalX 0.0");
dyna.Set("Rdface_NormalY 0.0");
dyna.Set("Rdface_NormalZ 1.0");

// 设置下落体初始向下速度（模拟自由落体）
blkdyn.SetPartVel(partId, 0.0, 0.0, -5.0);

// 设置总计算时间（约2秒，对应10万步）
dyna.Set("Total_Time 2.0");

// 设置监测变量：接触力、位移、能量等
dyna.Monitor("block", "rg_bxForce", 0, 1.0, 0.0);
dyna.Monitor("block", "rg_byForce", 0, 1.0, 0.0);
dyna.Monitor("block", "rg_bzForce", 0, 1.0, 0.0);
dyna.Monitor("block", "rg_bmagForce", 0, 1.0, 0.0);

// 设置监测变量：刚性面位移
dyna.Monitor("block", "rg_xDis", 0, 1.0, 0.0);
dyna.Monitor("block", "rg_yDis", 0, 1.0, 0.0);
dyna.Monitor("block", "rg_zDis", 0, 1.0, 0.0);

// 设置监测变量：刚性面速度
dyna.Monitor("block", "rg_xVel", 0, 1.0, 0.0);
dyna.Monitor("block", "rg_yVel", 0, 1.0, 0.0);
dyna.Monitor("block", "rg_zVel", 0, 1.0, 0.0);

// 设置监测变量：系统能量
dyna.Monitor("block", "Kinetic_Energy", 0, 1.0, 0.0);
dyna.Monitor("block", "Potential_Energy", 0, 1.0, 0.0);
dyna.Monitor("block", "Internal_Energy", 0, 1.0, 0.0);

// 执行计算
dyna.Solve(100000);
