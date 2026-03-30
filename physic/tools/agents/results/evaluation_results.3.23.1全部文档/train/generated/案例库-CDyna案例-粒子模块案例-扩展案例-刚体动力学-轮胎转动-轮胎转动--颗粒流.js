setCurDir(getSrcDir());

// ========== 1. 初始化仿真全局参数 ==========
dyna.Set("Time_Step 5e-3");
dyna.Set("Output_Interval 200");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Renew_Interval 10");
dyna.Set("Contact_Search_Method 2");
dyna.Set("Virtural_Step 0.1");
dyna.Set("If_Particle_Cal_Rolling 0");

// ========== 2. 导入轮胎刚体模型与创建颗粒网格 ==========
rdface.Import("gid", "wheel.msh");

rdface.CrtPart("feng");

rdface.SetPartProp(1.9e+03, [-9.363010e-06, 4.997800e-01, 1.240097e-01], [1.313625e+01, 1.315585e+01, 2.425868e+01, 0, 0, 0], "feng");

// 创建颗粒模型
var ParRad = 0.02;
var XMin = -1.6;
var XMax = 1.6;
var YMin = -1;
var YMax = 10;
var ZMin = -1.42 - ParRad;
var ZMax = -0.62 - ParRad;

pdyna.RegularCreateByCoord(10, 2, ParRad, XMin, XMax, YMin, YMax, ZMin, ZMax);
pdyna.Export("soil.dat");

// ========== 3. 定义接触关系及接触算法参数 ==========
dyna.Set("If_Contact_Use_GlobMat 1 2 2e8 2e8 0 0 5.0");
dyna.Set("If_Search_PBContact_Adavance 1");
dyna.Set("Contact_Detect_Tol 1e-3");
dyna.Set("If_ContTol_Auto_C 1");

// ========== 4. 施加重力载荷并设定初始位移速度条件 ==========
dyna.Set("Gravity 0.0 0.0 -9.8");

// ========== 5. 配置轮胎转动约束 ==========
rdface.SetPartRotaVel([0, 0, 0], [1, 1, 1]);
rdface.SetPartForce([0, -20000, 0]);
rdface.SetPartLocalDamp(0.8, 0.8);

// ========== 6. 执行第一阶段轮胎转动计算并监测节点运动轨迹 ==========
dyna.Monitor("rdface", "rg_xDis", 1, 1, 1);
dyna.Monitor("rdface", "rg_yDis", 1, 1, 1);
dyna.Monitor("rdface", "rg_zDis", 1, 1, 1);

// ========== 7. 调整接触搜索方法以优化颗粒流阶段的计算效率 ==========
dyna.Set("Contact_Search_Method 1");

// ========== 8. 解除部分颗粒转动速度约束以模拟自由流动状态 ==========
pdyna.SetModel("brittleMC");
FreeRotaV("xyz", 0.0, "y", -1e5, -0.29);
FreeRotaV("x", 0.0, "x", -1e5, -0.47);
FreeRotaV("x", 0.0, "x", 2.97, 1e5);
FreeRotaV("z", 0.0, "z", -1e5, -0.77);
FreeRotaV("z", 0.0, "z", 0.77, 1e5);

// ========== 9. 开启应力、应变及能量分布的时程监测变量输出 ==========
dyna.Monitor("pdyna", "stress_xx", 1, 1, 1);
dyna.Monitor("pdyna", "strain_xx", 1, 1, 1);
dyna.Monitor("pdyna", "energy_kinetic", 1, 1, 1);

// ========== 10. 运行完整仿真流程并导出最终结果文件 ==========
dyna.Solve();
