setCurDir(getSrcDir());

// 设置仿真全局参数
dyna.Set("Output_Interval 1000");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("GiD_Out 1");
dyna.Set("Contact_Detect_Tol 0.0");

// 创建底部刚性面（容器边界）
var fCoord = [-1.0, 0.0, 0.0, 2.0, 0.0, 0.0];
rdface.Create(1, 1, 2, fCoord);

var fCoord2 = [-1.0, 0.0, 0.0, -1.0, 2.0, 0.0];
var fCoord3 = [2.0, 0.0, 0.0, 2.0, 2.0, 0.0];
rdface.Create(1, 1, 2, fCoord2);
rdface.Create(1, 1, 2, fCoord3);

// 导入PDyna格式的颗粒并创建椭圆形颗粒
pdyna.CrtEllipsePartFromFile("1m-1m-ball.dat", "uniform", 0.8, 1, "uniform", 0.2, 1, "uniform", 0.0, 360.0, 12);

// 设置颗粒材料参数（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数）
pdyna.SetPartMat(2500, 5e7, 0.25, 0.0, 0.0, 10, 0.01, 0.1, 0.1);

// 设置接触模型为考虑应变软化的Mohr-Coulomb模型
pdyna.SetModel("brittleMC");

// 设置动态计算时步
dyna.Set("Time_Step 1e-5");

// 执行仿真计算
dyna.Solve(100000);

// 后处理与数据导出
pdyna.PostProcess();
