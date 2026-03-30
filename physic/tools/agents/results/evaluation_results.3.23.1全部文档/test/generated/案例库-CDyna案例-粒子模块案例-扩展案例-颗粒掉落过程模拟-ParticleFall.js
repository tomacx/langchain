setCurDir(getSrcDir());

// 初始化求解器环境
dyna.Set("Output_Interval 1000");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Contact_Detect_Tol 0.0");
dyna.Set("Time_Step 2e-4");

// 创建容器底板（刚性面）
var bottomCoord = [-1.5, 0.0, 0.0, 1.5, 0.0, 0.0];
rdface.Create(1, 1, 2, bottomCoord);

// 创建容器侧壁（4个侧面）
var wall1Coord = [-1.5, -1.5, 0.0, -1.5, 1.5, 0.0];
var wall2Coord = [1.5, -1.5, 0.0, 1.5, 1.5, 0.0];
var wall3Coord = [-1.5, 1.5, 0.0, 1.5, 1.5, 0.0];
var wall4Coord = [-1.5, -1.5, 0.0, -1.5, 1.5, 0.0];

rdface.Create(1, 1, 2, wall1Coord);
rdface.Create(1, 1, 2, wall2Coord);
rdface.Create(1, 1, 2, wall3Coord);
rdface.Create(1, 1, 2, wall4Coord);

// 创建颗粒体系（在容器域内随机分布）
pdyna.RegularCreateByCoord(1, 2, 0.05, 0.05, -1.0, 0.05, 1.0, 0.05, 0.9);

// 设置颗粒材料参数（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼）
pdyna.SetPartMat(2500, 5e7, 0.25, 1e6, 5e6, 30, 0.01, 0.1);

// 设置颗粒接触模型为Mohr-Coulomb模型
pdyna.SetModel("brittleMC");

// 设置刚性面与颗粒的接触参数（全局参数）
dyna.Set("If_Contact_Use_GlobMat 1 2 1e9 1e9 0.0 0.0 0.0");

// 执行求解计算
dyna.Solve(50000);
