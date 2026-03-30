setCurDir(getSrcDir());

// 初始化环境
dyna.Clear();
doc.clearResult();

// 加载自定义材料库
dyna.LoadUDF("CustomModel");

// 设置计算参数
dyna.Set("Particle_Renew_Interval 1");
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Contact_Detect_Tol 0.0");
dyna.Set("Large_Displace 1");

// 设置全局重力加速度 (m/s^2)
dyna.Set("Gravity 0.0 -9.8 0.0");

// 创建颗粒群
var xRange = [-1.4, 1.4];
var yRange = [0, 1.8];
var zRange = [-1, 1];
pdyna.CreateByCoord(5000, 1, 1, 0.05, 0.05, 0.0, xRange, yRange, zRange);

// 设置颗粒材料参数 (密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼)
pdyna.SetMat(2500, 1e8, 0.2, 0.0, 0.0, 20, 0.0, 0.2);

// 设置颗粒接触模型为脆性断裂Mohr-Coulomb模型
pdyna.SetModel("brittleMC");

// 创建底部刚性面 (矩形边界)
var acoord = new Array();
acoord[0] = [-1.5, -0.5, 0];
acoord[1] = [1.5, -0.5, 0];
rdface.Create(1, 1, 2, acoord);

// 创建顶部刚性面
acoord[0] = [-1.5, 2, 0];
acoord[1] = [1.5, 2, 0];
rdface.Create(1, 1, 2, acoord);

// 创建左侧刚性面
acoord[0] = [-1.5, -0.5, 0];
acoord[1] = [-1.5, 2, 0];
rdface.Create(1, 1, 2, acoord);

// 创建右侧刚性面
acoord[0] = [1.5, -0.5, 0];
acoord[1] = [1.5, 2, 0];
rdface.Create(1, 1, 2, acoord);

// 设置刚性面材料属性 (密度、弹性模量、泊松比)
rdface.SetMat(7850, 2e11, 0.3);

// 设置刚性面边界约束 (固定底部)
rdface.FixNodeByGroup(1, 1, 1, 1, 1, 1);

// 时间步长设置
dyna.Set("Time_Step 2e-4");

// 求解计算
dyna.TimeStepCorrect(0.8);
dyna.Solve(100000);

// 释放自定义材料库
dyna.FreeUDF();
