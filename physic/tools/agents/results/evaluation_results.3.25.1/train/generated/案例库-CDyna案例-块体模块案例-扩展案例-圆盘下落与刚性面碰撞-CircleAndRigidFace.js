setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置三个方向的重力加速度
dyna.Set("Gravity 0 -9.8 0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 1000");

//设置监测信息输出时步为100步
dyna.Set("Moniter_Iter 100");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

//打开接触更新计算开关
dyna.Set("If_Renew_Contact 1");

//设置子空间更新时步为100步
dyna.Set("Renew_Interval 10");

//设置接触容差为1mm
dyna.Set("Contact_Detect_Tol 2e-3");

//创建圆盘
var fCoord=new Array();
fCoord[0]=new Array(0, 0, 0);
fCoord[1]=new Array(1, 0, 0);
igeo.genCircleS(0, 0, 0, 1, 0.01, 1, fCoord);

//创建刚性面
var fCoord=new Array();
fCoord[0]=new Array(0, 0, 0);
fCoord[1]=new Array(1, 0, 0);
rdface.Create (1, 1, 2, fCoord);

//设置计算时步
dyna.Set("Time_Step 2e-5");

//计算5万步
dyna.Solve(50000);
