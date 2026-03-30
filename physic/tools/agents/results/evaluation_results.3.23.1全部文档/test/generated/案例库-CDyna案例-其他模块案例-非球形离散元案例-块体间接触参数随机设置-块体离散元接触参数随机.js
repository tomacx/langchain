setCurDir(getSrcDir());

// 设置全局仿真参数
dyna.Set("Output_Interval 1000");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Contact_Detect_Tol 5e-3");
dyna.Set("Time_Step 2e-4");

// 创建底部刚性面边界
var fCoord = [-10.0, -2.0, 0.0, 10.0, -2.0, 0.0];
rdface.Create(1, 1, 2, fCoord);

var fCoord2 = [-10.0, -2.0, 0.0, -10.0, 8.0, 0.0];
var fCoord3 = [10.0, -2.0, 0.0, 10.0, 8.0, 0.0];
rdface.Create(1, 1, 2, fCoord2);
rdface.Create(1, 1, 2, fCoord3);

// 创建多边形颗粒组（块体）
var fpoly1 = [0, 0, 2, 1, 1, 1.5];
var fpoly2 = [3, 1, 6, 2, 5, 3, 4, 3];
var fpoly3 = [-1, 2, 2, 3, 1, 4, 0, 3, -0.5, 2.5];
var fpoly4 = [0, 4, 3, 5, 4, 6, 2, 5];

pdyna.CrtPolygonPart(1, fpoly1, 0.1);
pdyna.CrtPolygonPart(2, fpoly2, 0.1);
pdyna.CrtPolygonPart(3, fpoly3, 0.1);
pdyna.CrtPolygonPart(4, fpoly4, 0.1);

// 设置颗粒材料属性（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼）
pdyna.SetPartMat(2500, 1e9, 0.25, 1e6, 5e6, 30, 0.01, 0.1, 0.1);

// 设置接触模型为考虑应变软化的Mohr-Coulomb模型
pdyna.SetModel("brittleMC");

// 随机化颗粒组1-4的摩擦角参数（均匀分布，期望值25度，标准差5度）
pdyna.RandomizePartMat("friction", "uniform", 20, 30, 1, 4);

// 设置结果输出监测变量
dyna.Set("Auto_Put_Data_To_Host 1");

// 求解计算
dyna.Solve(50000);

// 释放动态链接库资源
dyna.FreeUDF();
