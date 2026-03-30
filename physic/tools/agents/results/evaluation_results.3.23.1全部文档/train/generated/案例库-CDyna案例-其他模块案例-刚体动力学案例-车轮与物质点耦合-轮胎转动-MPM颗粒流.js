setCurDir(getSrcDir());

// 清除内存数据
dyna.Clear();

// 设置输出间隔为1000步
dyna.Set("Output_Interval 1000");

// 时程数据的监测步长
dyna.Set("Moniter_Iter 100");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置接触容差为0.001m
dyna.Set("Contact_Detect_Tol 1e-3");

// 执行计算前，是否自动修正接触容差
dyna.Set("If_ContTol_Auto_C 1");

// 设置颗粒的计算模式为4---mpm
dyna.Set("Particle_Cal_Type 4");

// MPM计算模式：2-常规FEM
dyna.Set("MPM_Cal_Mode 2");

// 是否计算接触更新
dyna.Set("If_Renew_Contact 1");

// 块体、颗粒接触搜索模式：1-九宫格法
dyna.Set("Contact_Search_Method 1");

// 设置三个方向的重力加速度
dyna.Set("Gravity 0.0 0.0 -9.8");

// 耦合刚度采用全局的值：线弹性模型
dyna.Set("If_Contact_Use_GlobMat 1 2 2e8 2e8 0 0 5.0");

// 颗粒与块体单元间的接触搜索采用高级模式
dyna.Set("If_Search_PBContact_Adavance 1");

// 创建刚性车轮几何体（导入或生成）
var wheelRadius = 0.3;
var wheelWidth = 0.2;
var wheelHeight = 0.4;

// 使用rdface模块创建车轮块体
rdface.Import("gid", "wheel.msh");

// 创建车轮部件
rdface.CrtPart("wheel_part");

// 设置车轮部件属性：密度、初始位置、尺寸
rdface.SetPartProp(1900, [0.0, 0.0, 0.0], [wheelRadius, wheelWidth, wheelHeight], "wheel_part");

// 设置车轮转动速度（绕Y轴旋转）
rdface.SetPartRotaVel([0, 0, 0], [0, 1, 0]);

// 设置车轮局部阻尼
rdface.SetPartLocalDamp(0.8, 0.8);

// 创建颗粒体系
var ParRad = 0.02;
var XMin = -1.5;
var XMax = 1.5;
var YMin = -wheelRadius - ParRad;
var YMax = wheelRadius + ParRad;
var ZMin = -1.42 - ParRad;
var ZMax = -0.62 - ParRad;

pdyna.RegularCreateByCoord(1, 2, ParRad, XMin, XMax, YMin, YMax, ZMin, ZMax);

// 导出颗粒数据（可选）
// pdyna.Export("soil.dat");

// 设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

// 设置颗粒材料参数：density, young, poisson, tension, cohesion, friction, localdamp, viscdamp
pdyna.SetMat(2200, 5e7, 0.25, 0.0, 0.0, 0.0001, 0.01, 0);

// 设置MPM背景网格
mpm.SetBackGrid(3, 0.5, [-0.5, -0.5, -0.5], [62, 42, 22]);

// 设置MPM本构模型
mpm.SetModelByGroup("DP", 1, 2);

// 设置车轮与颗粒的接触关系
pdyna.SetContact("wheel_part", "all", 1);

// 设定颗粒初始条件（位移和速度）
InitCondByGroup(0, 0, 0, 0, 0, 0);

// 设置求解时间步长
dyna.Set("Time_Step 2.0e-4");

// 监测车轮位移
dyna.Monitor("rdface", "rg_xDis", 1, 1, 1);
dyna.Monitor("rdface", "rg_yDis", 1, 1, 1);
dyna.Monitor("rdface", "rg_zDis", 1, 1, 1);

// 设置求解时间（20秒）
dyna.DynaCycle(20);

// 释放动态链接库资源
dyna.FreeUDF();
