//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

//设置输出的间隔为500步
dyna.Set("Output_Interval 1000");

//时程数据的监测步长
dyna.Set("Moniter_Iter 100");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

//不平衡率
dyna.Set("UnBalance_Ratio 0.5");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//耦合刚度采用全局的值1-线弹性模型，2-脆断模型，3-理想弹塑性模型。
/////法向刚度、切向刚度、抗拉强度、粘聚力、摩擦角
dyna.Set("If_Contact_Use_GlobMat 1 2 2e8 2e8 0 0 5.0");

//颗粒与块体单元间的接触搜索采用高级模式
dyna.Set("If_Search_PBContact_Adavance 1");

//设置三个方向的重力加速度
dyna.Set("Gravity 0.0  0.0  -9.8");

//设置接触容差为0.001m
dyna.Set("Contact_Detect_Tol 1e-3");

//执行计算前，是否自动修正接触容差，0-不修正，1-修正。
dyna.Set("If_ContTol_Auto_C 1");

//设置颗粒的计算模式为4---mpm
dyna.Set("Particle_Cal_Type 4");

//1-简单有限体积法（单点积分）；2-常规FEM。
dyna.Set("MPM_Cal_Mode 2");

//是否计算接触更新，0-不计算，1-计算。
dyna.Set("If_Renew_Contact 1");

//块体、颗粒接触搜索模式。1-九宫格法，2-单格法。
dyna.Set("Contact_Search_Method 1");

//生成颗粒///////////////////////////////////////////////////////////////////
//14R20 		x	y	z
//min	-0.204237974	-0.625043091	-0.625135565
//max	0.204237978	0.625043091	0.625135565
var ParRad = 0.02;
var XMin = -1.6;
var XMax = 1.6;
var YMin = -1;
var YMax  = 10;
var ZMin = -1.42-ParRad;
var ZMax = -0.62-ParRad;

pdyna.RegularCreateByCoord (10, 2, ParRad, XMin, XMax, YMin, YMax, ZMin, ZMax);
pdyna.Export("soil.dat");

//pdyna.Import(1,"soil.dat")

//设置颗粒模型
pdyna.SetModel("brittleMC");

//设置颗粒的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(1800, 3e6, 0.3, 9.65e3, 9.65e3, 20.0, 0.01, 0.0);

//创建mpm背景网格
var cellLength = ParRad * 8.0;
var MinC = [XMin - 2.0 * cellLength, YMin - 2.0 * cellLength, ZMin - 2.0 * cellLength];
var MaxC = [XMax + 2.0 * cellLength, YMax + 2.0 * cellLength, ZMax + 6.0 * cellLength];
var NoXYZ = new Array(3);

pdyna.FixV("xyz", 0, "x",  XMin - 1.0 * cellLength, XMin + 1.0 * cellLength);
pdyna.FixV("xyz", 0, "x",  XMax - 1.0 * cellLength, XMax + 1.0 * cellLength);
pdyna.FixV("xyz", 0, "y",  YMin - 1.0 * cellLength, YMin + 1.0 * cellLength);
pdyna.FixV("xyz", 0, "y",  YMax - 1.0 * cellLength, YMax + 1.0 * cellLength);
pdyna.FixV("xyz", 0, "z",  ZMin - 1.0 * cellLength, ZMin + 1.0 * cellLength);

for(var i = 0; i < 3; i++)
{
 NoXYZ[i] = Math.round ( (MaxC[i] - MinC[i]) / cellLength);
print(NoXYZ[i] );
}

mpm.SetBackGrid(3, cellLength, MinC ,  NoXYZ);
//////////////////////////////////////////////////////////////////////////////

//组号在1-11之间的颗粒对应的本构模型设定为线弹性模型
mpm.SetModelByGroup("MC", 1,111);

pdyna.SetSingleMat("LocalDamp",0.8);

dyna.Set("Virtural_Step 0.6");

dyna.Solve();

dyna.Save("initialMC.sav");

//dyna.Restore("initial.sav");

//////////////////////清除初始位移////////////////////////////
//定义三个方向基础值
var values = new Array(0.0,0.0, 0);
//定义变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
//将控制范围内的位移与速度清零
blkdyn.InitConditionByCoord("displace", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
blkdyn.InitConditionByCoord("velocity", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

//导入车轮模型
//14R20 		x	y	z
//min	-0.204237974	-0.625043091	-0.625135565
//max	0.204237978	0.625043091	0.625135565
//中心点	0	0	0
//总体积	0.449248 m?	
//Density:1.000000e+03	 Volume: 4.274345e-02	 Mass:  4.274345e+01
//Centroid: -2.996559e-03	-4.641531e-03	-8.786243e-03
//Inertia matrix: 
//1.096892e+01	4.572729e-02	-3.944841e-02
//4.572729e-02	6.178217e+00	6.804939e-02
//-3.944841e-02	6.804939e-02	6.014346e+00
rdface.Import(1,"14R20-12K.dat");

//创建刚体部件
rdface.CrtPart("14R20");

//rdface.SetPartProp(质量, 刚体质心坐标[3], 刚体转动惯量的分量[6],11,22,33,12,23,13nPartId>);
rdface.SetPartProp(4.274345e+01, [-2.996559e-03,-4.641531e-03,-8.786243e-03], [1.096892e+01,6.178217e+00,6.014346e+00,4.572729e-02,6.804939e-02,-3.944841e-02], "14R20");

/////////////////轮土接触///////////////////////////////
//刚体部件转动速度
rdface.SetPartForce([0,0,-30000]);

rdface.SetPartRotaVel([0,0,0],[1,1,1]);

rdface.SetPartLocalDamp(0.1, 0.1);

dyna.Set("If_Virtural_Mass 0");

dyna.Set("Time_Step 1e-6");

dyna.TimeStepCorrect(0.2);

dyna.Solve(4000);

dyna.Save("initialII.sav");

//dyna.Restore("initialII.sav");

////////////////////////////////////////转速////////////////////////////////
var carVel = 30*1e3/3600.0;

var Ttime = YMax*0.9/carVel

var wheelDiameter = 1.24964711907;

var ArcL = wheelDiameter * Math.PI;

var OneCircleTime =  ArcL /  carVel;

var RotaSpeed = 1.0 / OneCircleTime;

rdface.SetPartRotaVel([-RotaSpeed,0,0],[1,1,1]);

dyna.Set("If_Virtural_Mass 0");
////////////////////////监测信息///////////////////////////////
dyna.Monitor("rdface","rg_yDis",1,1000,1);
dyna.Monitor("rdface","rg_zDis",1,1000,1);
dyna.Monitor("rdface","rg_pyForce",1,1000,1);
dyna.Monitor("rdface","rg_pzForce",1,1000,1);
dyna.Monitor("rdface","rg_pmagForce",1,1000,1);
dyna.RegionMonitor("particle","pa_syz", 1, 2, 1, [-10, 10, 15, 15.6, -0.3, 0]);
dyna.RegionMonitor("particle","pa_szz", 1, 2, 1, [-10, 10, 15, 15.6, -0.3, 0]);

//////////////////////////////滚动计算////////////////
dyna.Set("Time_Now 0");
blkdyn.SetLocalDamp(0.1);
rdface.SetPartLocalDamp(0.2, 0.5);
dyna.TimeStepCorrect(0.2);

dyna.Set("Output_Interval 200");

//dyna.Solve(8000);
//计算到100s
dyna.DynaCycle(Ttime);
//dyna.Restore("test.sav")
