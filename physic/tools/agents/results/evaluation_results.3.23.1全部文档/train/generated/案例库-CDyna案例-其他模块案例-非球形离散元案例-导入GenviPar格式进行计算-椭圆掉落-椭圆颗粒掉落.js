setCurDir(getSrcDir());

// 设置计算参数
dyna.Set("Output_Interval 1000");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Contact_Detect_Tol 5e-3");
dyna.Set("Time_Step 2e-4");

// 创建底部刚性面（支撑平面）
var fCoord = [-15.0, -2.0, 0.0, 15.0, -2.0, 0.0];
rdface.Create(1, 1, 2, fCoord);

var fCoord2 = [-15.0, -2.0, 0.0, -15.0, 8.0, 0.0];
var fCoord3 = [15.0, -2.0, 0.0, 15.0, 8.0, 0.0];
rdface.Create(1, 1, 2, fCoord2);
rdface.Create(1, 1, 2, fCoord3);

// 导入椭圆颗粒网格文件
pdyna.ImportPartGenviPar("ellipse.gvpx");

// 设置颗粒材料参数（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数）
pdyna.SetPartMat(2500, 1e9, 0.25, 1e6, 5e6, 30, 0.01, 0.1, 0.1);

// 设置颗粒接触模型为Mohr-Coulomb模型
pdyna.SetModel("brittleMC");

// 导出当前状态结果
pdyna.ExportPartGenviPar("export.gvpx");

// 执行求解计算
dyna.Solve(10000);

// 导出最终结果
pdyna.ExportPartGenviPar("export2.gvpx");
