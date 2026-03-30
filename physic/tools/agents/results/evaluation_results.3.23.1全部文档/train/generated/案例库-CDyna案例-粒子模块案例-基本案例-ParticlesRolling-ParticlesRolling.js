setCurDir(getSrcDir());

// 清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

// 清除GDEM-Env中的结果数据
doc.clearResult();

// 设置输出的间隔为500步
dyna.Set("Output_Interval 500");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 设置三个方向的全局重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

// 设置计算时步为1e-4
dyna.Set("Time_Step 5e-5");

// 导入刚性面网格
rdface.Import(2, "ring.msh");

// 创建第一组随机颗粒（内圈）
var x = [-0.6, 0.6];
var y = [-0.6, 0.0];
var z = [-1, 1];
pdyna.CreateByCoord(5000, 1, 1, 0.01, 0.01, 0.0, x, y, z);

// 创建第二组随机颗粒（外圈）
y[0] = 0.0;
y[1] = 0.6;
pdyna.CreateByCoord(5000, 2, 1, 0.03, 0.03, 0.005, x, y, z);

// 设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

// 设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e8, 0.2, 0.0, 0.0, 20, 0.0, 0.2);

// 求解1万步
dyna.Solve(10000);

// 设置刚性面转动参数
var fOrigin = [0, 0, 0]; // 坐标原点
var fNormal = [0, 0, 1.0]; // 法向分量
var GlobVel = [0, 0, 0]; // 速度分量值
rdface.ApplyRotateCondition(1, fOrigin, fNormal, 0.4, 0.0, GlobVel, 1, 5);

// 求解3万步
dyna.Solve(30000);

// 监控颗粒位移输出
dyna.Monitor("pdyna", "p_xDis", 1, 1, 1);
dyna.Monitor("pdyna", "p_yDis", 1, 1, 1);
dyna.Monitor("pdyna", "p_zDis", 1, 1, 1);

// 监控颗粒速度输出
dyna.Monitor("pdyna", "p_xVel", 1, 1, 1);
dyna.Monitor("pdyna", "p_yVel", 1, 1, 1);
dyna.Monitor("pdyna", "p_zVel", 1, 1, 1);

// 打印仿真完成信息
print("ParticlesRolling simulation completed successfully!");
