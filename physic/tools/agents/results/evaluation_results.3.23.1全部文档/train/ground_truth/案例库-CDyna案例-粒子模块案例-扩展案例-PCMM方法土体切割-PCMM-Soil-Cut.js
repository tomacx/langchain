//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());


//设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//打开虚拟质量开关
dyna.Set("If_Virtural_Mass 1");

dyna.Set("Virtural_Step 0.3");

//打开大变形计算开关
dyna.Set("Large_Displace 1");


//设置3个方向重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

//设置PCMM颗粒的接触容差
dyna.Set("PCMM_Elem_Tol 0.08");

dyna.Set("Contact_Detect_Tol 1e-3");

//设置颗粒的计算模式为2-PCMM颗粒模式
dyna.Set("Particle_Cal_Type 2");


//创建刚性面1
var fCoord=new Array();
fCoord[0]=new Array(-0.1,1.2,0);
fCoord[1]=new Array(-2.1,0.9,0.0);
rdface.Create(1, 1, 2, fCoord);

//创建刚性面2
var fCoord1=new Array();
fCoord1[0]=new Array(-0.1,1.2,0);
fCoord1[1]=new Array(-2.1,3.3,0.0);
rdface.Create(1, 1, 2, fCoord1);


//创建规律排布的颗粒
pdyna.RegularCreateByCoord(1,1,0.05,0,10,0,2,0,0);

//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2200, 1e7, 0.25, 3e4, 3e4, 25, 0.8, 0.0);


//设置pcmm模型为线弹性模型
pcmm.SetModelByGroup("linear",1,11);

//固定底部pcmm颗粒三个方向的速度
pdyna.FixV("xyz",0.0, "y", -1, 0.05);
pdyna.FixV("xyz",0.0, "x", 9.95,11);

//求解至稳定
dyna.Solve();

//设置pcmm模型为应变软化模型
pcmm.SetModelByGroup("MC",1,11);

//求解至稳定
dyna.Solve();

var fvalue = new Array(0.0, 0.0, 0.0);
pdyna.InitCondByGroup ("displace", fvalue, 1,100);


dyna.Set("If_Virtural_Mass 0");

//设置局部阻尼为0.01
pdyna.SetSingleMat("LocalDamp",0.1);


//刚性面的平动速度施加
var FixV=[1.0,0.0,0.0];
rdface.ApplyVelocityByGroup (FixV, 1,5);

//刚性面与颗粒接触参数
dyna.Set("If_Contact_Use_GlobMat 1 2 3e8 3e8 0 0 15");

//求解1万步
dyna.Solve(30000);
