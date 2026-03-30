setCurDir(getSrcDir());

// 清除GDEM-dyna计算核心中的内存数据
dyna.Clear();

// 清除Genvi平台中的结果数据
doc.clearResult();

// 设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置重力加速度（z方向向下）
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置PCMM颗粒的接触容差
dyna.Set("PCMM_Elem_Tol 1e-3");

// 设置颗粒的计算模式为2-PCMM颗粒模式
dyna.Set("Particle_Cal_Type 2");

// 创建流体流动计算域 - 左边界刚性面
var fCoord = new Array();
fCoord[0] = new Array(0.0, 0.0, 0.0);
fCoord[1] = new Array(0.0, 0.5, 0.0);
rdface.Create(1, 1, 2, fCoord);

// 创建流体流动计算域 - 底部刚性面
fCoord[0] = new Array(0.0, 0.0, 0.0);
fCoord[1] = new Array(1.0, 0.0, 0.0);
rdface.Create(1, 2, 2, fCoord);

// 创建流体流动计算域 - 右边界刚性面
fCoord[0] = new Array(1.0, 0.0, 0.0);
fCoord[1] = new Array(1.0, 0.5, 0.0);
rdface.Create(1, 3, 2, fCoord);

// 创建流体流动计算域 - 顶部刚性面
fCoord[0] = new Array(0.0, 0.5, 0.0);
fCoord[1] = new Array(1.0, 0.5, 0.0);
rdface.Create(1, 4, 2, fCoord);

// 创建流体颗粒 - 在计算域内均匀分布
pdyna.CrossCreateByCoord(1, 1, 0.001, 0.001, 0.5, 0.001, 0.5, 0.0, 0.0);

// 设置流体材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数
pdyna.SetMat(1000, 1e7, 0.35, 1e-3, 1e-3, 1e-3, 0.01, 0);

// 设置流体颗粒的体积模量、剪切模量及动力粘度（组号1）
mpm.SetKGVByGroup(2e6, 0.0, 1e-4, 1, 1);

// 设置PCMM本构模型为流体模型
SetModelByGroup("Fluid", 1, 1);

// 对左右边界施加静态约束（无反射）
ApplyQuietBoundByCoord(1, 1, 0.0, 0.5, 0.0);
ApplyQuietBoundByCoord(1, 3, 1.0, 0.5, 0.0);

// 对底部边界施加静态约束（无反射）
ApplyQuietBoundByCoord(1, 2, 0.0, 0.0, 0.0);

// 设置颗粒与刚性面接触模型采用全局参数
dyna.Set("If_Contact_Use_GlobMat 1 2 1e8 1e8 0.0 0.0 0.0");

// 设置监测点 - 监测流体中部节点的位移和速度
dyna.Monitor("Point", 0.5, 0.25, 0.0);

// 求解计算（运行10个循环）
dyna.DynaCycle(10);
