//设置工作路径为脚本文件所在路径
setCurDir(getSrcDir());

//设置输出间隔为200步
dyna.Set("Output_Interval 200");

//设置重力方向
dyna.Set("Gravity  0 0.0 0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//打开虚拟质量开关
dyna.Set("If_Virtural_Mass 0");


//设置颗粒计算类型为 mpm方法
dyna.Set("Particle_Cal_Type 4");

//设置断裂应变
dyna.Set("Block_Soften_Value 5e-3 15e-3");

//创建1m×1m规则颗粒
pdyna.RegularCreateByCoord(1,1,0.005,0,1, 0,1, 0.0, 0);

//0.4-0.6区域的颗粒设置为组2
pdyna.SetGroupByCoord(2, 0.4, 0.6, 0.4, 0.6, -1, 1);

//组1设置固体参数，依次为density, young, poisson, tension, cohesion, friction, localdamp, viscdamp
pdyna.SetMat(2500,3e10,0.25, 1e6, 1e6, 30.0, 0.0, 0.1, 1);

//组2设置高压气体参数，强度参数为0
pdyna.SetMat(900,1e9,0.25, 0, 0, 0.0, 0.0, 0.1, 2);

//创建mpm背景网格
mpm.SetBackGrid(2,0.025,  [-1,-1, 0], [120, 120, 0]);

//设置组1的mpm模型为mohr-coulomb应变软化模型
mpm.SetModelByGroup("SoftenMC",1,1);

//设置组2的mpm模型为自定义模型
mpm.SetModelByGroup("Custom",2, 2);

dyna.LoadUDF("CustomModel.dll");

//设置自定义值，第一个数为初始压力, 第二个数为绝热指数
dyna.SetUDFValue([10e6, 1.33]);

//设置计算时步为1e-6
dyna.Set("Time_Step 1e-6");

//求解7000步
dyna.Solve(7000);

dyna.FreeUDF();
