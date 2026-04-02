//设置工作路径为脚本文件所在路径
setCurDir(getSrcDir());


//设置输出间隔为200步
dyna.Set("Output_Interval 200");

//设置重力方向
dyna.Set("Gravity  0 -9.8 0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//设置计算时步为1e-5
dyna.Set("Time_Step 5e-6");

//设置不平衡率为1e-3
dyna.Set("UnBalance_Ratio 1e-3");

//设置颗粒计算类型为 mpm方法
dyna.Set("Particle_Cal_Type 4");

dyna.Set("Block_Soften_Value 1e-1 3e-1");

//设置颗粒与刚性面接触模型采用全局参数
dyna.Set("If_Contact_Use_GlobMat 1 2 5e9 5e9  0.0 0.0 0.0");

//导入gid格式的球体颗粒簇
pdyna.Import("gid","BallD0.4.msh");

//初始化球体运动速度为-50m/s
pdyna.InitCondByGroup ("velocity", [0,-50.0,0], 1,100);

//设置材料参数，依次为density, young, poisson, tension, cohesion, friction, localdamp, viscdamp
pdyna.SetMat(2000,1e9,0.35, 10e6, 10e6, 30.0, 0.01,0);
//创建mpm背景网格
mpm.SetBackGrid(3,0.025, [-1,-0.6, -1], [80, 40, 80]);

//设置mpm模型为mohr-coulomb应变软化模型
mpm.SetModelByGroup("MC",1,2);

//创建三维刚性面
var fCoord=new Array();
fCoord[0]=new Array(-1.0,-0.5,-1)
fCoord[1]=new Array(1,-0.5,-1)
fCoord[2]=new Array(1,-0.5,1)
fCoord[3]=new Array(-1,-0.5,1)
rdface.Create (2, 2, 4, fCoord);


//求解4000步
dyna.Solve(4000);
