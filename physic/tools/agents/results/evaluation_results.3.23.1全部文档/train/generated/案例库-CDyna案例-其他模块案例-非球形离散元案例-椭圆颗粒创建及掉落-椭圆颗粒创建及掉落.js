setCurDir(getSrcDir());

// 初始化仿真环境
dyna.Set("Output_Interval 1000");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Contact_Detect_Tol 5e-3");
dyna.Set("Time_Step 2e-4");

// 创建底部刚性面（边界条件）
var fCoord = [-15.0, -2.0, 0.0, 15.0, -2.0, 0.0];
rdface.Create(1, 1, 2, fCoord);

var fCoord2 = [-15.0, -2.0, 0.0, -15.0, 8.0, 0.0];
var fCoord3 = [15.0, -2.0, 0.0, 15.0, 8.0, 0.0];
rdface.Create(1, 1, 2, fCoord2);
rdface.Create(1, 1, 2, fCoord3);

// 创建多个椭圆颗粒实例
pdyna.CrtEllipsePart(1, 0, 2, 0, 1, 2, 30, 50);
pdyna.CrtEllipsePart(1, 0, 7, 0, 3, 1, 10, 50);
pdyna.CrtEllipsePart(1, 5, 5, 0, 2, 3, 30, 50);
pdyna.CrtEllipsePart(1, 10, 5, 0, 2, 1, 40, 50);
pdyna.CrtEllipsePart(1, 8, 12, 0, 4, 1, 10, 50);

// 设置颗粒材料参数（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部平动阻尼、局部转动阻尼、粘性阻尼系数）
pdyna.SetPartMat(2500, 1e9, 0.25, 1e6, 5e6, 30, 0.01, 0.1, 0.1);

// 设置接触模型为考虑应变软化的Mohr-Coulomb模型
pdyna.SetModel("brittleMC");

// 启用重力场（已通过Gravity设置）
// 初始速度为零（默认）

// 运行求解器进行计算
dyna.Solve(100000);
