setCurDir(getSrcDir());

// 初始化仿真环境参数
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 1e-2");
dyna.Set("Time_Step 2e-5");

// 导入几何模型（球体与靶板）
blkdyn.ImportGrid("gmsh", "BallImpact2D.msh");

// 创建接触面并更新网格
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置块体单元本构模型为脆性断裂Mohr-Coulomb模型
blkdyn.SetIModel("brittleMC");

// 设置靶板材料参数（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼）
blkdyn.SetMat(2500, 1e8, 0.2, 3e7, 6e7, 36, 0.0, 0.1);

// 设置球体材料参数（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼）
blkdyn.SetMat(2500, 1e6, 0.2, 3e4, 6e4, 25, 0.0, 0.1);

// 设置接触面材料参数（法向刚度、切向刚度、摩擦系数等）
blkdyn.SetIMat(5e9, 5e9, 15, 0, 0);

// 在靶板区域内生成随机节理网络
var jointBounds = new Array(-10.0, 10.0, -10.0, 10.0, -10.0, 10.0);
dyna.GenRandomJoints2D(jointBounds, "uniform", [5.0, 10.0], "uniform", [0.5, 2.0], "uniform", [-45.0, 45.0], "uniform", [1.0, 3.0], [0.0, 0.0]);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.02);

// 为下落球体设置初始垂直速度（模拟自由落体）
var velocity = new Array(0.0, -50.0, 0.0);
blkdyn.InitConditionByGroup("velocity", velocity, [0, 0, 0, 0, 0, 0, 0, 0, 0], 1, 100);

// 施加边界约束条件（固定计算域边缘）
blkdyn.FixV("x", -10.0, "x", 10.0, -1, 1);
blkdyn.FixV("y", -10.0, "y", 10.0, -1, 1);

// 时间步长修正
dyna.TimeStepCorrect(0.8);

// 求解计算（根据物理过程设定分析时长）
dyna.Solve(20000);

// 输出结果信息
print("Solution is ok!");
