// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置三个方向的重力加速度均为0
dyna.Set("Gravity 0.0 -9.8 0.0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置不平衡比
dyna.Set("UnBalance_Ratio 5e-4");

// 设置是否更新接触检测
dyna.Set("If_Renew_Contact 1");

// 设置接触检测容差
dyna.Set("Contact_Detect_Tol 0.0")

// 设置计算结果的输出间隔为100步
dyna.Set("Output_Interval 5000");

// 设置监测信息输出时步为10步
dyna.Set("Moniter_Iter 10");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 设置颗粒的计算模式为4-MPM颗粒模式
dyna.Set("Particle_Cal_Type 4");

// 常规有限元设置
dyna.Set("MPM_Cal_Mode 2");

// 导入颗粒模型数据
pdyna.Import("pdyna", "ParticleFromBlock.dat");

// 设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetModel("brittleMC");

// 指定组1的材料参数，水
pdyna.SetMat(1000, 2.18e9, 0.25, 8e6, 16e6, 40, 0.02, 0.0, 1);
pdyna.SetMatByCoord(1000, 2.18e9, 0.25, 8e6, 16e6, 40, 0.8, 0.0, [-1e5, 0.3],[-1e5, 1e5],[-1e5, 1e5]);
pdyna.SetMatByCoord(1000, 2.18e9, 0.25, 8e6, 16e6, 40, 0.8, 0.0, [1.3, 1e5],[-1e5, 1e5],[-1e5, 1e5]);
pdyna.SetMatByCoord(1000, 2.18e9, 0.25, 8e6, 16e6, 40, 0.8, 0.0, [-1e5, 1e5],[-1e5, 0.2],[-1e5, 1e5]);

// 指定组2的材料参数，炸药
pdyna.SetMat(1630, 1e9, 0.25, 1e6, 3e6, 15, 0.02, 0.0, 2);

// 设定TNT爆源参数
var apos = [0.8, 0.6-0.09, 0.0];
pdyna.SetJWLSource(1, 1630, 7e9, 371.2e9, 3.2e9, 4.2, 0.95, 0.3, 20e9, 6930.0, apos, 0.0, 10.0);
pdyna.BindJWLSource(1, 2, 2);

// 创建mpm背景网格
var x1 = -0.3;
var y1 = -0.3;
var NoX = (1.6+0.3 - x1) / 0.015 + 1;
var NoY = (1.6+0.3 - y1) / 0.015 + 20;

mpm.SetBackGrid(NoX, NoY, [x1, y1], [1.6+0.3, 1.6+0.3]);

// 设置计算时步为1e-6
dyna.Set("Time_Step 1e-6");

// 求解7000步
dyna.Solve(7000);
