setCurDir(getSrcDir());

// ==================== 1. 初始化仿真环境 ====================
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 0.0 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Output_Interval 500");
dyna.Set("Time_Step 1e-5");
dyna.Set("UnBalance_Ratio 1e-4");

// ==================== 2. 创建计算域几何 ====================
igeo.clear();
var domain = igeo.genBox(0, 0, 0, 10, 10, 10);
var rock = igeo.genBox(0.5, 0.5, 0.5, 9.5, 9.5, 9.5);

// ==================== 3. 网格划分 ====================
imeshing.clear();
imeshing.genMeshByGmsh("rock", rock);
blkdyn.GetMesh(imeshing);

// ==================== 4. 创建裂隙单元 ====================
fracsp.CreateGridFromBlock(2);

// ==================== 5. 设置材料参数 ====================
blkdyn.SetModel("MC");
blkdyn.SetMatByGroup(2500, 6.5e9, 0.25, 3e6, 3e6, 30.0, 10.0, 1);

// 裂隙渗流参数：密度、体积模量、渗透系数、初始开度
fracsp.SetPropByGroup(1000.0, 1e7, 1e-14, 1e-8, 1, 1);

// ==================== 6. 设置接触面本构 ====================
blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(9e9, 9e9, 30, 3e6, 3e6, 1);
blkdyn.SetIStiffByElem(1.0);

// ==================== 7. 设置局部阻尼 ====================
blkdyn.SetLocalDamp(0.05);

// ==================== 8. 施加初始围压条件 ====================
// 通过坐标对岩体单元初始化压力（围压）
InitConditionByCoord("pressure", [1e6], [0, 0, 0], [9.5, 9.5, 9.5]);

// ==================== 9. 设置JWL爆源参数 ====================
var pos = new Array(3);
pos[0] = [2, 2, 2];
pos[1] = [4, 2, 2];
pos[2] = [6, 2, 2];

// 设置JWL爆源：ID, 密度, C1, C2, C3, R1, R2, V0, P0, D0, 位置数组, 时间下限, 时间上限
blkdyn.SetJWLSource(1, 1630, 7.0e9, 371.2e9, 3.2e9, 4.2, 0.95, 0.30, 21e9, 6930, pos, 0.0, 15e-3);

// ==================== 10. 设置气体泄漏衰减特性 ====================
// 特征时间、特征指数、爆源ID范围
blkdyn.SetJWLGasLeakMat(5e-4, 1.2, 1, 10);

// ==================== 11. 定义监测靶板 ====================
// 靶板中心坐标，半径，角度范围，高程上下限
pfly.CrtPeneCircleTarget(3.0, 3.0, 5.0, 2.0, 60, 0.0, 2.0);

// ==================== 12. 施加动态裂隙渗流边界条件 ====================
ApplyConditionByGroup("inlet_pressure", [1e5], [1, 1]);
ApplyConditionByGroup("outlet_pressure", [0], [1, 1]);

// ==================== 13. 设置求解参数 ====================
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 0.001");
dyna.Set("Particle_Renew_Interval 1");

// ==================== 14. 执行求解 ====================
dyna.Solve(5000);

// ==================== 15. 导出监测结果 ====================
pfly.ExportPeneCircleTargetInfo();

blkdyn.ExportGradationCurveByGroup(1, 1);
