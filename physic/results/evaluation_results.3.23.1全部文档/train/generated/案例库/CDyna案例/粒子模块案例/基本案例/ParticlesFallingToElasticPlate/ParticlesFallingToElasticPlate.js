// 设置当前路径为JavaScript脚本所在的路径
setCurDir(getScriptPath());

// 清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

// 清除GDEM-Env中的结果数据
doc.clearResult();

// 设置输出的间隔为500步
dyna.Set("Output_Interval 500");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 设置全局重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

// 设置计算时步为1e-4秒
dyna.Set("Time_Step 5e-5");

// 创建随机分布的颗粒
var x = [-0.6, 0.6];
var y = [-0.6, 0.0];
var z = [-1, 1];
pdyna.CreateByCoord(5000, 1, 1, 0.01, 0.01, 0.0, x, y, z);

// 创建另一组随机分布的颗粒
y[0] = 0.0;
y[1] = 0.6;
pdyna.CreateByCoord(5000, 2, 1, 0.03, 0.03, 0.005, x, y, z);

// 设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

// 设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e8, 0.2, 0.0, 0.0, 20, 0.0, 0.2);

// 求解1万步
dyna.Solve(10000);
