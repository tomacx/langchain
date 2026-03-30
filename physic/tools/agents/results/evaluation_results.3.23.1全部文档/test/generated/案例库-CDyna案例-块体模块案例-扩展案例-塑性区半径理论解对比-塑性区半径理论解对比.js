setCurDir(getSrcDir());

// ========== 1. 初始化CDyna仿真环境并配置求解器基本设置 ==========
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0.0 0.0 -9.8");
dyna.Set("Contact_Detect_Tol 0.0");
dyna.Set("Time_Step 2e-4");
dyna.Set("HourGlass_Damp_Factor 0.15");
dyna.Set("Large_Displace 1");

// ========== 2. 定义材料本构模型（Drucker-Prager参数） ==========
// 弹性参数：E=5e7 Pa, mu=0.25
// Drucker-Prager强度参数：C=5e6 Pa, T=1e6 Pa, FaiA=30度, DiaA=0度
// 材料参数顺序：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部平动阻尼、局部转动阻尼、粘性阻尼系数
pdyna.SetMat(2500, 5e7, 0.25, 1e6, 5e6, 30, 0.01, 0.1, 0.1);

// ========== 3. 生成计算域颗粒系统 ==========
// 创建球形颗粒系统，半径范围0.8-1.0m，分段数12x12
pdyna.CrtEllipsoidPartFromFile("Rad4m.dat", "uniform", 0.8, 1, "uniform", 0.2, 1, "uniform", 0.2, 1.0, 12, 12);

// ========== 4. 施加边界条件与重力载荷 ==========
// 导入底部刚性面约束颗粒运动
rdface.Import("gid", "boundary.msh");

// ========== 5. 配置颗粒间接触模型参数 ==========
pdyna.SetModel("brittleMC");

// ========== 6. 设置特定监测点（中心区域） ==========
// 通过RunUDFCmdAdv调用自定义函数获取塑性区半径
var fDist = dyna.RunUDFCmdAdv("CalPlasticRadius", [0, 0, 0]);

// ========== 7. 定义输出请求（已包含在Output_Interval中） ==========
// 记录指定监测点的应力、应变及塑性状态变量数据

// ========== 8. 调整沙漏阻尼系数等求解控制参数 ==========
dyna.Set("HourGlass_Damp_Factor 0.15");
dyna.Set("DP_Model_Option 1");
dyna.Set("UnBalance_Ratio 1e-3");

// ========== 9. 执行求解器命令运行仿真 ==========
// 计算3万步，达到收敛条件或总时间步长限制
dyna.Solve(30000);

// ========== 10. 处理输出数据文件（通过RunUDFCmdAdv调用后处理函数） ==========
var fResult = dyna.RunUDFCmdAdv("PostProcessPlasticZone", [0, 0, 0]);
