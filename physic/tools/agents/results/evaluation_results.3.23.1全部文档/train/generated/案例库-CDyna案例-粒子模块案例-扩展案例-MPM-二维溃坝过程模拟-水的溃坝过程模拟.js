setCurDir(getSrcDir());

// 设置输出间隔为1000步
dyna.Set("Output_Interval 1000");

// 设置重力方向
dyna.Set("Gravity  0 -9.8 0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 设置计算时步为5e-5
dyna.Set("Time_Step 5e-5");

// 设置不平衡率为1e-3
dyna.Set("UnBalance_Ratio 1e-3");

// 设置颗粒计算类型为MPM方法(4)
dyna.Set("Particle_Cal_Type 4");

// 设置颗粒与刚性面接触模型采用全局参数
dyna.Set("If_Contact_Use_GlobMat 1 2 1e8 1e8 0.0 0.0 0.0");

// 创建水颗粒(密度1000kg/m³, 弹性模量1e7Pa, 泊松比0.35)
pdyna.RegularCreateByCoord(1, 1, 0.005, -0.5, 2.5, -0.5, 2.5, 0.0, 0);

// 设置水材料参数: density, young, poisson, tension, cohesion, friction, localdamp, viscdamp
pdyna.SetMat(1000, 1e7, 0.35, 1e-3, 1e-3, 1e-3, 0.01, 0, 1);

// 创建MPM背景网格(2D, 网格尺寸0.06)
mpm.SetBackGrid(2, 0.06, [-0.5, -0.5, 0], [42, 42, 0]);

// 设置MPM模型为线弹性模型
mpm.SetModelByGroup("DP", 1, 1);

// 创建溃坝刚性边界(底部和两侧)
var fCoord = new Array();

// 底部刚性面
fCoord[0] = new Array(-0.5, -0.5, 0);
fCoord[1] = new Array(2.5, -0.5, 0);
rdface.Create(1, 1, 2, fCoord);

// 左侧刚性面
fCoord[0] = new Array(-0.5, -0.5, 0);
fCoord[1] = new Array(-0.5, 2.5, 0);
rdface.Create(1, 1, 2, fCoord);

// 右侧刚性面
fCoord[0] = new Array(2.5, -0.5, 0);
fCoord[1] = new Array(2.5, 2.5, 0);
rdface.Create(1, 1, 2, fCoord);

// 执行计算(根据时步5e-5和输出间隔1000，运行约10秒)
dyna.DynaCycle(10);

// 释放动态链接库
dyna.FreeUDF();
