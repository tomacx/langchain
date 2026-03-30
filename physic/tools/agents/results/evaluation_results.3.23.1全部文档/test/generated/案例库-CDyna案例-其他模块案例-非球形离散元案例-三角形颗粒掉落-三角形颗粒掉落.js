setCurDir(getSrcDir());

// 设置求解器基本参数
dyna.Set("Output_Interval 1000");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Contact_Detect_Tol 5e-3");
dyna.Set("GiD_Out 1");

// 创建底部刚性面约束区域
var fCoord = [-2.0, 0.0, 0.0, 2.0, 0.0, 0.0];
rdface.Create(1, 1, 2, fCoord);

var fCoord2 = [-2.0, 0.0, 0.0, -2.0, 2.0, 0.0];
var fCoord3 = [2.0, 0.0, 0.0, 2.0, 2.0, 0.0];
rdface.Create(1, 1, 2, fCoord2);
rdface.Create(1, 1, 2, fCoord3);

// 创建三角形颗粒体系（从PDyna格式文件导入）
pdyna.CrtPolygonPartFromFile("triangle-1m.dat", "uniform", 0.8, 1, "uniform", 0.2, 1, "uniform", 0.0, 360.0, 12);

// 设置颗粒材料参数（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部平动阻尼、局部转动阻尼、粘性阻尼系数）
pdyna.SetPartMat(2500, 5e7, 0.25, 1e6, 5e6, 30, 0.01, 0.1, 0.1);

// 设置颗粒接触模型为考虑应变软化的Mohr-Coulomb模型
pdyna.SetModel("brittleMC");

// 设置动态计算时步
dyna.Set("Time_Step 2e-4");

// 求解并输出结果
dyna.Solve(100000);
