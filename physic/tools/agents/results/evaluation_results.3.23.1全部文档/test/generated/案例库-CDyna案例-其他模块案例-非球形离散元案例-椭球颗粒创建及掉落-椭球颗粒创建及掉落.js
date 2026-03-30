setCurDir(getSrcDir());

// 配置仿真环境参数
dyna.Set("Output_Interval 1000");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Contact_Detect_Tol 5e-3");
dyna.Set("GiD_Out 1");

// 创建底部刚性面（20m x 20m）
var fCoord = [-10.0, -10.0, 0.0, 10.0, -10.0, 0.0];
rdface.Create(1, 1, 2, fCoord);

var fCoord2 = [-10.0, -10.0, 0.0, -10.0, 10.0, 0.0];
rdface.Create(1, 1, 2, fCoord2);

var fCoord3 = [10.0, -10.0, 0.0, 10.0, 10.0, 0.0];
rdface.Create(1, 1, 2, fCoord3);

var fCoord4 = [-10.0, 10.0, 0.0, -10.0, 10.0, 0.0];
rdface.Create(1, 1, 2, fCoord4);

// 创建多个椭球颗粒（不同位置和尺寸）
pdyna.CrtEllipsoidPart(1, [0.0, 5.0, 10.0], 0.5, 0.8, 0.6, [], 0.0, 12, 12);
pdyna.CrtEllipsoidPart(1, [2.0, 3.0, 12.0], 0.4, 0.6, 0.5, [], 0.0, 12, 12);
pdyna.CrtEllipsoidPart(1, [-2.0, 8.0, 8.0], 0.6, 0.7, 0.5, [], 0.0, 12, 12);
pdyna.CrtEllipsoidPart(1, [5.0, -3.0, 15.0], 0.5, 0.5, 0.4, [], 0.0, 12, 12);
pdyna.CrtEllipsoidPart(1, [-5.0, 2.0, 6.0], 0.7, 0.9, 0.6, [], 0.0, 12, 12);

// 设置颗粒材料参数（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部平动阻尼、局部转动阻尼、粘性阻尼系数）
pdyna.SetPartMat(2500, 5e7, 0.25, 1e6, 5e6, 30, 0.01, 0.1, 0.1);

// 设置接触模型为考虑应变软化的Mohr-Coulomb模型
pdyna.SetModel("brittleMC");

// 设置动态计算时步
dyna.Set("Time_Step 2e-4");

// 执行求解（3万步）
dyna.Solve(100000);

// 释放动态链接库
dyna.FreeUDF();
