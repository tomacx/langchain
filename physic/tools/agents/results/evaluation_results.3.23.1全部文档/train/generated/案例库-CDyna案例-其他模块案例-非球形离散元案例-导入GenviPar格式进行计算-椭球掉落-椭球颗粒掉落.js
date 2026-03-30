setCurDir(getSrcDir());

// 初始化仿真环境
dyna.Set("Output_Interval 1000");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0.0 0.0 -9.8");
dyna.Set("Contact_Detect_Tol 5e-3");
dyna.Set("Time_Step 2e-4");

// 导入底部刚性面（用于支撑颗粒）
rdface.Import("gid", "20m-20m-bound.msh");

// 导入主体椭球颗粒文件
pdyna.ImportPartGenviPar("main_ellipsoid.gvpx");

// 导入床层颗粒文件
pdyna.ImportPartGenviPar("particle_bed.gvpx");

// 设置主体椭球的材料参数（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数）
pdyna.SetPartMat(2500, 1e9, 0.25, 0, 0, 30, 0.01, 0.1, 0.1);

// 设置床层颗粒的材料参数（与主体相同或根据需求调整）
pdyna.SetPartMat(2500, 1e9, 0.25, 0, 0, 30, 0.01, 0.1, 0.1);

// 设置颗粒接触模型为考虑应变软化的Mohr-Coulomb模型
pdyna.SetModel("brittleMC");

// 设置主体椭球的初始速度（向下掉落）
var mainVel = [0.0, 0.0, -5.0];
pdyna.SetPartVel(mainVel, [0, 0, 0], 1);

// 设置床层颗粒的初始状态（静止）
var bedVel = [0.0, 0.0, 0.0];
pdyna.SetPartVel(bedVel, [0, 0, 0], 2);

// 设置床层颗粒固定底部（防止穿透）
var afValue = [0, 0, 0];
var abFixFlag = [1, 1, 1];
pdyna.SetPartVel(afValue, abFixFlag, 2);

// 自动计算时步
dyna.TimeStepCorrect(0.3);

// 执行求解（根据物理过程调整步数）
dyna.Solve(50000);

// 导出结果文件
pdyna.ExportPartGenviPar("result_export.gvpx");
