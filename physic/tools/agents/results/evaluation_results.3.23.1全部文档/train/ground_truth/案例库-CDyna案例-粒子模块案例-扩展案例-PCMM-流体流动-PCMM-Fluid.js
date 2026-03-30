//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//清除GDEM-dyna计算核心中的内存数据
dyna.Clear();

//清除Genvi平台中的结果数据
doc.clearResult();

//设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//打开虚拟质量开关
dyna.Set("If_Virtural_Mass 1");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//设置虚拟质量为0.3
dyna.Set("Virtural_Step 0.3");

//设置3个方向重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

//设置PCMM颗粒的接触容差
dyna.Set("PCMM_Elem_Tol 1e-3");

//设置颗粒的计算模式为2-PCMM颗粒模式
dyna.Set("Particle_Cal_Type 2");

//创建左刚性面
var fCoord = new Array();
fCoord[0]=new Array(0.0,0.0,0.0);
fCoord[1]=new Array(0.0,0.4,0.0);
rdface.Create (1, 1, 2, fCoord);

//创建底部刚性面
fCoord[0]=new Array(0.0,0.0,0.0);
fCoord[1]=new Array(0.2,0.0,0.0);
rdface.Create (1, 2, 2, fCoord);

//创建右部刚性面
fCoord[0]=new Array(0.2,0.0,0.0);
fCoord[1]=new Array(0.2,0.4,0.0);
rdface.Create (1, 3, 2, fCoord);

//创建规律排布的颗粒
//pdyna.RegularCreateByCoord(1,1,0.1,0,10,0,10,0,0);

//产生半径下限为0.05m，半径上限为0.1m，组号为1的10000个随机分布的颗粒
var x = new Array(0.01, 0.1);
var y = new Array(0.01, 0.1);
var z = new Array(0.0, 0.0);
//pdyna.CreateByCoord(1000, 1, 1, 0.001, 0.005, 0 ,x,y,z);
//pdyna. AdvCreateByCoord (<TotalNo, GroupNo, type, RandomName, pra1, pra2,embed, x[2], y[2], z[2]>);
//pdyna. AdvCreateByCoord (10000, 1, 1, "normal", 0.001 , 1e-4, 0.0, x, y, z);
pdyna. CrossCreateByCoord (1, 1, 0.001, 0.001, 0.1, 0.001, 0.1, 0.0, 0.0);

//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）

pdyna.SetModel("brittleMC");


pdyna.SetMat(1000, 2.1e6, 0.45, 0, 0, 0, 0.8, 0.0);

//设置pcmm模型为线弹性模型
pcmm.SetModelByGroup("linear",1,11);

//固定底部pcmm颗粒三个方向的速度
//pdyna.FixV("xyz",0.0, "y", -1, 0.1);

//求解至稳定
dyna.Solve();

//设置pcmm模型为线弹性模型
//pcmm.SetModelByGroup("MC",1,11);



//设置pcmm模型为应变软化模型
pcmm.SetModelByGroup("ViscMC",1,11);

//组号在1-11之间的颗粒设定体积模量、剪切模量及动力粘度
pcmm.SetKGVByGroup(2.1e6, 0.0, 1e-3, 1,11);

//设置局部阻尼为0.01
pdyna.SetSingleMat("LocalDamp",0.01);

dyna.Set("If_Virtural_Mass 0");

dyna.TimeStepCorrect(0.5);


//求解1万步
dyna.Solve(150000);
