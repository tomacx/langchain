setCurDir(getSrcDir());

// 初始化环境
dyna.Clear();
doc.clearResult();

// 设置计算参数
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Contact_Detect_Tol 5e-3");
dyna.Set("Time_Step 5e-5");

// 创建底部刚性面（圆形边界）
var fCoord = new Array();
fCoord[0] = new Array(-4.0, -2.0, 0.0);
fCoord[1] = new Array(4.0, -2.0, 0.0);
rdface.Create(1, 1, 2, fCoord);

// 创建圆形颗粒（使用genCircle API）
var circleID = igeo.genCircle(0.0, 0.0, 0.5, 1.0, 0.05);

// 设置颗粒模型为脆性断裂Mohr-Coulomb模型
pdyna.SetModel("brittleMC");

// 设置颗粒材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数
pdyna.SetMat(2500, 1e8, 0.25, 1e6, 5e6, 30, 0.0, 0.1);

// 设置接触模型为考虑应变软化的Mohr-Coulomb模型
pdyna.SetModel("SSMC");

// 计算循环
dyna.Solve(10000);
