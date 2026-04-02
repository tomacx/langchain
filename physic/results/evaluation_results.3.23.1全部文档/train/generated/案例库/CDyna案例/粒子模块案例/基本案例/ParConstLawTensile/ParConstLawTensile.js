// 设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 设置输出间隔为500步
dyna.Set("Output_Interval 500");

// 设置重力加速度为零，即无重力环境
dyna.Set("Gravity 0.0 0.0 0.0");

// 设置接触容差为0.001m
dyna.Set("Contact_Detect_Tol 0.001");

// 导入gid格式的刚性面边界
rdface.Import(2,"boundary.msh");

// 定义颗粒创建范围
var x = [-3, 1];
var y = [0.1, 2.4];
var z = [0, 1];

// 创建5000个颗粒，半径为0.05m至0.1m之间随机分布
pdyna.CreateByCoord(5000, 1, 1, 0.05, 0.1, 0.05, x, y, z);

// 设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

// 设置材料参数，包括密度、弹性模量等
pdyna.SetMat(2500, 1e7, 0.25, 0.0, 0.0, 25, 0.0, 0.3);

// 设置计算时步为1e-4秒
dyna.Set("Time_Step 1e-4");

// 迭代求解至稳定状态，共迭代1万步
dyna.Solve(10000);
