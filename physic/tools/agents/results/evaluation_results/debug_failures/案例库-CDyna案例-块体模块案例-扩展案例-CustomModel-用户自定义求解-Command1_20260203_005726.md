# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-CustomModel-用户自定义求解-Command1.js

## Query
请生成一个CDyna案例的脚本，功能是块体模块案例-扩展案例-CustomModel-用户自定义求解-Command1

## Generated Code
```javascript
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
```

## Ground Truth
```javascript
//设置当前目录为JS脚本文件所在目录
setCurDir(getSrcDir());

//设置3个方向的重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

//创建三维方块网格
blkdyn.GenBrick3D(10,10,10,20,20,20,1);

//设置单元的模型为线弹性模型
blkdyn.SetModel("linear");

//设置材料参数
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 40, 15);

//固定底部3个方向的速度为0
blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);

//设置Y方向的3个监测点
dyna.Monitor("block","ydis", 5.0, 10.0, 5.0);
dyna.Monitor("block","ydis", 5.0, 6.0, 5.0);
dyna.Monitor("block","ydis", 5.0, 2.0, 5.0);


//计算前初始haul
dyna.BeforeCal();

//循环1万步
for(var i = 0; i < 10000; i++)
{

//集成核心计算
//var unbal = blkdyn.Solver();

//计算单元变形力
blkdyn.CalBlockForce();

//计算节点运动
var unbal = blkdyn.CalNodeMovement();

//输出监测信息
dyna.OutputMonitorData();

//每隔100步推送信息
if(i != 0 && i % 100 == 0)
{
      //推送文本信息
	print("不平衡率：" + unbal);

      //推送结果信息至平台
	dyna.PutStep(1,i,0.1);
}

}

```
