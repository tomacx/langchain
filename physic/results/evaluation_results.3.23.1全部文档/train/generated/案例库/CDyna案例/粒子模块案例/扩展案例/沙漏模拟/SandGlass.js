setCurDir(getSrcDir());

// 设置输出间隔为1000步
dyna.Set("Output_Interval 1000");

// 设置重力方向
dyna.Set("Gravity 0 -9.8 0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 设置计算时步为5e-5
dyna.Set("Time_Step 5e-5");

// 设置不平衡率为1e-3
dyna.Set("UnBalance_Ratio 1e-3");

// 设置颗粒计算类型为 mpm方法
dyna.Set("Particle_Cal_Type 4");

// 设置颗粒与刚性面接触模型采用全局参数
dyna.Set("If_Contact_Use_GlobMat 1 2 1e8 1e8 0.0 0.0 0.0");

// 创建规则的颗粒
pdyna.RegularCreateByCoord(1, 1, 0.005, 0, 1, 0, 2, 0.0, 0);

// 设置材料参数，依次为density, young, poisson, tension, cohesion, friction, localdamp, viscdamp
pdyna.SetMat(1000, 1e7, 0.35, 1e-3, 1e-3, 1e-3, 0.01, 0, 1);

// 创建mpm背景网格
mpm.SetBackGrid(2, 0.06, [-0.5, -0.5, 0], [100, 100, 0]);

// 设置mpm模型为线弹性模型
mpm.SetModelByGroup("DP", 1, 1);

// 创建刚性面
var fCoord = new Array();
fCoord[0] = [-0.005, -0.005, 0];
fCoord[1] = [5, -0.005, 0];
rdface.Create(1, 1, 2, fCoord);

fCoord[0] = [5, -0.005, 0];
fCoord[1] = [5, 5, 0];
rdface.Create(1, 1, 2, fCoord);

fCoord[0] = [-0.005, -0.005, 0];
fCoord[1] = [-0.005, 5, 0];
rdface.Create(1, 1, 2, fCoord);

// 求解50万步
dyna.DynaCycle(10);
