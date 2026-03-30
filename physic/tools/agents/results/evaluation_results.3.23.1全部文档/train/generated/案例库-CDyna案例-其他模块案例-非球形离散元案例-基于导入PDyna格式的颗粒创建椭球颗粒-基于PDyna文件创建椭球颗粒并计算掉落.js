setCurDir(getSrcDir());

// 配置仿真输出间隔并关闭虚拟质量开关
dyna.Set("Output_Interval 1000");
dyna.Set("If_Virtural_Mass 0");

// 设置重力加速度参数以模拟掉落场景
dyna.Set("Gravity 0.0 0.0 -9.8");

// 设置接触容差
dyna.Set("Contact_Detect_Tol 0.0");

// 启用GiD输出
dyna.Set("GiD_Out 1");

// 设置底部刚性面（创建边界）
var fCoord = [-1.0, 0.0, 0.0, 2.0, 0.0, 0.0];
rdface.Create(1, 1, 2, fCoord);

var fCoord2 = [-1.0, 0.0, 0.0, -1.0, 2.0, 0.0];
var fCoord3 = [2.0, 0.0, 0.0, 2.0, 2.0, 0.0];
rdface.Create(1, 1, 2, fCoord2);
rdface.Create(1, 1, 2, fCoord3);

// 导入PDyna格式的颗粒并创建椭球（从文件导入）
pdyna.CrtEllipsoidPartFromFile("ellipsoid.dat", "uniform", 0.8, 1, "uniform", 0.2, 1, "uniform", 0.0, 360.0, 12, 12);

// 设置颗粒的材料参数
// 依次为：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部平动阻尼、局部转动阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetPartMat(2500, 5e7, 0.25, 1e6, 5e6, 30, 0.01, 0.1, 0.1);

// 设置颗粒接触模型为考虑应变软化的Mohr-Coulomb模型
pdyna.SetModel("brittleMC");

// 设置动态计算时步
dyna.Set("Time_Step 2e-4");

// 执行仿真计算
dyna.Solve(100000);

// 后处理输出结果
pdyna.PostProcess();
