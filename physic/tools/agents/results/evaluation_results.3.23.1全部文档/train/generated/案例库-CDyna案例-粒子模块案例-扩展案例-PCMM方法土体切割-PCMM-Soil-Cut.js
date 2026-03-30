setCurDir(getSrcDir());

// 清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

// 清除平台结果数据
doc.clearResult();

// 设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

// 打开虚拟质量开关
dyna.Set("If_Virtural_Mass 1");

// 设置虚拟质量为0.3
dyna.Set("Virtural_Step 0.3");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置单元接触更新开关
dyna.Set("If_Renew_Contact 1");

// 设置接触容差为1e-3
dyna.Set("Contact_Detect_Tol 1e-3");

// 设置计算时步为0.3ms
dyna.Set("Virtural_Step 0.3");

// 设置3个方向重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置PCMM颗粒的接触容差
dyna.Set("PCMM_Elem_Tol 0.08");

// 设置颗粒的计算模式为2-PCMM颗粒模式
dyna.Set("Particle_Cal_Type 2");

// 创建土体块（规则排布的颗粒）
var soilWidth = 10.0;
var soilHeight = 5.0;
var soilDepth = 10.0;
var particleSize = 0.1;

pdyna.RegularCreateByCoord(1, 1, particleSize, 0, soilWidth, 0, soilHeight, 0, soilDepth);

// 设置颗粒材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数
pdyna.SetMat(2200, 1e7, 0.25, 3e4, 3e4, 25, 0.8, 0.0);

// 设置pcmm模型为考虑粘性效应的Mohr-Coulomb模型 (ViscMC)
pcmm.SetModelByGroup("ViscMC", 1, 11);

// 固定底部颗粒三个方向的速度（y方向）
pdyna.FixV("xyz", 0.0, "y", -1, soilHeight * 0.95);

// 创建切割工具刚性面（顶部边界）
var fCoord = new Array();
fCoord[0] = new Array(0, soilHeight + 0.2, 0);
fCoord[1] = new Array(-soilWidth / 2, soilHeight + 0.2, 0);
rdface.Create(1, 1, 2, fCoord);

var fCoord1 = new Array();
fCoord1[0] = new Array(0, soilHeight + 0.2, 0);
fCoord1[1] = new Array(soilWidth / 2, soilHeight + 0.2, 0);
rdface.Create(1, 1, 2, fCoord1);

// 设置刚性面模型为线弹性
rdface.SetModelByGroup(0, 1, 11);

// 设置MPM背景网格（用于ViscMC模型的独立模量设置）
mpm.SetBackGrid(3, particleSize * 2, [-soilWidth / 2 - 0.5, -soilHeight / 2 - 0.5, -soilDepth / 2 - 0.5], [soilWidth + 1, soilHeight + 1, soilDepth + 1]);

// 设置MPM本构模型参数（体积模量、剪切模量、动力粘度）
mpm.SetKGVByGroup(2e9, 1e7, 1e5, 1, 1);

// 初始化切割工具位移条件
var fvalue = new Array(0.0, 0.0, 0.0);
pdyna.InitCondByGroup("displace", fvalue, 1, 2);

// 求解至稳定（初始平衡）
dyna.Solve();

// 设置切割工具向下运动速度
var cutVelocity = new Array(0.0, -0.5, 0.0);
rdface.ApplyVelocityByGroup(cutVelocity, 1, 2);

// 求解切割过程（10000步）
dyna.Solve(10000);

// 输出应力监测点数据
var stressPoints = new Array();
stressPoints[0] = new Array(soilWidth / 4, soilHeight / 2, soilDepth / 4);
stressPoints[1] = new Array(-soilWidth / 4, soilHeight / 2, soilDepth / 4);

// 设置结果输出路径
dyna.Set("Result_Path ./results/");

// 求解完成后输出状态
var finalTime = dyna.Get("Current_Time");
console.log("Simulation completed at time: " + finalTime);
