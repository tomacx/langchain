setCurDir(getSrcDir());

// ==================== 1. 初始化仿真环境 ====================
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0 0.0 0");
dyna.Set("Large_Displace 0");
dyna.Set("Output_Interval 200");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.5");
dyna.Set("UnBalance_Ratio 1e-4");
dyna.Set("If_Renew_Contact 0");
dyna.Set("Contact_Detect_Tol 0.0");

// ==================== 2. 裂隙渗流模块初始化 ====================
dyna.Set("Config_FracSeepage 1");
dyna.Set("FracSeepage_Cal 1");
dyna.Set("FS_MaxWid 2e-5");
dyna.Set("FS_Solid_Interaction 1");

// ==================== 3. 孔口压降计算开关 ====================
dyna.Set("BoreholePressureDrop_Cal 1");

// ==================== 4. 创建三维网格模型 ====================
// 创建包含井筒与裂缝区域的三维网格 (20m x 20m x 20m, 20x20x20单元)
blkdyn.GenBrick3D(20.0, 20.0, 20.0, 20, 20, 20, 1);

// ==================== 5. 设置材料属性 ====================
// 设定所有单元的本构为线弹性本构
blkdyn.SetModel("linear");

// 设定岩石基质材料参数 (密度, 弹性模量, 泊松比, 抗拉强度, 抗压强度, 内聚力, 摩擦角)
blkdyn.SetMat(2500, 5e10, 0.25, 10e6, 5e6, 40.0, 15.0, 1, 20);

// ==================== 6. 设置接触面本构 ====================
blkdyn.SetIModel("brittleMC");
blkdyn.SetIStrengthByElem();
blkdyn.SetIStiffByElem(20.0);

// ==================== 7. 初始化地应力 ====================
var stressValues = new Array(0.0, -15e6, -8e6); // X, Y, Z方向初始地应力
blkdyn.InitStressByCoord(stressValues, -100, 100, -100, 100, -100, 100);

// ==================== 8. 设置孔隙渗流参数 ====================
// 定义X、Y、Z三个方向的渗透系数 (m/s)
var arrayK = new Array(1e-12, 1e-12, 1e-12);

// 指定坐标控制范围内的孔隙渗流参数
// 密度, 体积模量, 饱和度, 孔隙率, 渗透系数, 比奥系数
poresp.SetPropByGroup(1810.0, 1e6, 0.0, 0.01, arrayK, 1.0, 1);

// ==================== 9. 设置孔口压降参数 ====================
// 设置射孔参数: 射孔数, 射孔直径(m), 流量系数, 压降系数, 压降指数
fracsp.SetBoreholePressureDropPropByCoord(1, 0.06, 0.8, 0.001, 2, -5, 5, -5, 5, -5, 5);

// ==================== 10. 初始化孔隙压力 ====================
// 初始化地层初始孔隙压力 (MPa)
poresp.InitConditionByCoord("pp", 1e7, new Array(0.0, 0.0, 0.0), -100, 100, -100, 100, -100, 100, false);

// ==================== 11. 设置边界条件 ====================
// 模型四周压力边界条件 (MPa)
poresp.ApplyConditionByCoord("pp", 5e5, new Array(0.0, 0.0, 0.0), -20, 20, -20, 20, -20, 20, true);

// ==================== 12. 设置监测点 ====================
// 在井筒位置设置压力监测点
dyna.Monitor("block", "fpp", 10, 5, 0); // X=10, Y=5, Z=0处的压力监测
dyna.Monitor("block", "fpp", 11, 5, 0); // X=10, Y=5, Z=10处的压力监测

// ==================== 13. 求解控制参数设置 ====================
dyna.Set("Time_Step 0.01");
dyna.Set("Moniter_Iter 100");
dyna.Set("Solver_MaxIter 1000");

// ==================== 14. 执行求解 ====================
// 迭代求解 (步数根据物理过程调整)
dyna.Solve(5000);

// ==================== 15. 输出结果 ====================
print("Solution Finished - Fracture Propagation Simulation Complete");
