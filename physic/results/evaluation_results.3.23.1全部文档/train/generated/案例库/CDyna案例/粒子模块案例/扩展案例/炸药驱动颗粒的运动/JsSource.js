// 设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

// 设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置3个方向重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

// 创建规则排布的颗粒，组1，矩形弹头
pdyna.RegularCreateByCoord(1,1,0.001,-0.02,0,-0.005,0.005,0,0);

// 创建规则排布的颗粒，组2，30cm混凝土板
pdyna.RegularCreateByCoord(2,1,0.001,0.01,0.031,-0.15,0.15,0,0);

// 设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 7e10, 0.25, 20e6, 40e6, 35, 0.01, 0);

// 初始化速度等
var fvalue = new Array(100.0, 0.0, 0.0);
pdyna.InitCondByGroup("velocity", fvalue, 1,1);

// 设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

// 固定底部pcmm颗粒三个方向的速度
pdyna.FixV("xyz",0.0, "y", -0.16,-0.149);
pdyna.FixV("xyz",0.0, "y", 0.149,0.16);

// 设置计算时步
dyna.Set("Time_Step 2e-8");

// 求解1万步
dyna.Solve(30000);
