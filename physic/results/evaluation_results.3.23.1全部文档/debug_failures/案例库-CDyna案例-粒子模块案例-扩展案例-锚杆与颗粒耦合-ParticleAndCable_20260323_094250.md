# Failure Analysis: 案例库-CDyna案例-粒子模块案例-扩展案例-锚杆与颗粒耦合-ParticleAndCable.js

## Query
请编写一个CDyna仿真脚本，实现扩展案例-锚杆与颗粒耦合-ParticleAndCable，并输出必要的结果与监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// 设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 设置接触检测容差
dyna.Set("Contact_Detect_Tol 1e-4");

// 导入刚性面
rdface.Import ("ansys","plate.dat");

// 设置材料参数
rdface.SetDeformMat(0.01, 2500, 3e9, 0.25, 3e6, 1e6, 35, 0.01);

// 设置边界条件
rdface.SetVelocityByCoord(0.0, 0.0, 0.0, 1, 1, 1, -0.01, 0.01, -1e5, 1e5, -1e5, 1e5);
rdface.SetVelocityByCoord(0.0, 0.0, 0.0, 1, 1, 1, 10-0.01, 10+0.01, -1e5, 1e5, -1e5, 1e5);
rdface.SetVelocityByCoord(0.0, 0.0, 0.0, 1, 1, 1,  -1e5, 1e5,-0.01, 0.01, -1e5, 1e5);
rdface.SetVelocityByCoord(0.0, 0.0, 0.0, 1, 1, 1,  -1e5, 1e5, 10-0.01, 10+0.01,-1e5, 1e5);

// 创建随机分布的颗粒
var x = new Array(4.5, 5.5);
var y = new Array(4.5, 5.5);
var z = new Array(0.2, 1);
pdyna.CreateByCoord(3000, 1, 2, 0.1, 0.1, 0.1, x,y,z);

// 设定颗粒模型为脆断模型
pdyna.SetModel("brittleMC");

// 设定颗粒接触材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 5e8, 0.25, 0.0, 0.0, 0.0, 0.0, 0.05);

// 设置动态计算时步为1e-4秒
dyna.Set("Time_Step 2e-4");

// 开始模拟
dyna.Solve(8000);
```

## Ground Truth
```javascript
//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//打开虚拟质量开关
dyna.Set("If_Virtural_Mass 1");

//设置3个方向的重力加速度均为0
dyna.Set("Gravity 0.0 -9.8 0.0");

//设置接触容差为2e-4
dyna.Set("Contact_Detect_Tol 2e-3");

//dyna.Set("Large_Displace 1");

//打开杆件计算开关
dyna.Set("If_Cal_Bar 1");

dyna.Set("Bar_Out 1");


//导入gid格式的颗粒
pdyna.Import("gid","1m1m.msh");

//设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

//设置可材料，依次为依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 3e8, 0.25, 1e7, 5e7, 30, 0.8, 0.0);


//设置一道斜裂缝，并施加参数
var coord1 = [-0.1,0.5,0];
var coord2 = [1.1,0.5,0];
pdyna.SetICMatByLine(-1,-1,0.0,0.0,0.0, coord1, coord2);

pdyna.FixV("xyz",0.0,"y", 0.98,1.1);



for(var i = 0; i < 5; i++)
{

var coord1 = new Array(0.1 + i * 0.2, 0.3, 0);
var coord2 = new Array(0.1 + i * 0.2, 0.7, 0);
bar.CreateByCoord("cable", coord1, coord2, 20);

}



//定义两种锚索材料
var BarProp1 = [0.02, 7800.0, 1e11, 0.25, 235e6, 235e6, 1e7, 35, 1e11, 0.8, 0.0];

bar.SetPropByID(BarProp1, 1, 5, 1, 200);

dyna.Monitor("particle","pa_ydis",0,0,0);
dyna.Monitor("particle","pa_ydis",0.5,0,0);
dyna.Monitor("particle","pa_ydis",1,0,0);

//计算4千步
dyna.Solve(10000);
```

## Unified Diff
```diff
--- 案例库-CDyna案例-粒子模块案例-扩展案例-锚杆与颗粒耦合-ParticleAndCable.js (ground_truth)
+++ 案例库-CDyna案例-粒子模块案例-扩展案例-锚杆与颗粒耦合-ParticleAndCable.js (generated)
@@ -1,64 +1,43 @@
-//设置当前路径为JavaScript脚本所在的路径
 setCurDir(getSrcDir());
 
-//设置结果的输出间隔为500步
+// 设置重力加速度
+dyna.Set("Gravity 0.0 -9.8 0.0");
+
+// 设置结果的输出间隔为500步
 dyna.Set("Output_Interval 500");
 
-//打开虚拟质量开关
-dyna.Set("If_Virtural_Mass 1");
+// 关闭虚拟质量开关
+dyna.Set("If_Virtural_Mass 0");
 
-//设置3个方向的重力加速度均为0
-dyna.Set("Gravity 0.0 -9.8 0.0");
+// 设置接触检测容差
+dyna.Set("Contact_Detect_Tol 1e-4");
 
-//设置接触容差为2e-4
-dyna.Set("Contact_Detect_Tol 2e-3");
+// 导入刚性面
+rdface.Import ("ansys","plate.dat");
 
-//dyna.Set("Large_Displace 1");
+// 设置材料参数
+rdface.SetDeformMat(0.01, 2500, 3e9, 0.25, 3e6, 1e6, 35, 0.01);
 
-//打开杆件计算开关
-dyna.Set("If_Cal_Bar 1");
+// 设置边界条件
+rdface.SetVelocityByCoord(0.0, 0.0, 0.0, 1, 1, 1, -0.01, 0.01, -1e5, 1e5, -1e5, 1e5);
+rdface.SetVelocityByCoord(0.0, 0.0, 0.0, 1, 1, 1, 10-0.01, 10+0.01, -1e5, 1e5, -1e5, 1e5);
+rdface.SetVelocityByCoord(0.0, 0.0, 0.0, 1, 1, 1,  -1e5, 1e5,-0.01, 0.01, -1e5, 1e5);
+rdface.SetVelocityByCoord(0.0, 0.0, 0.0, 1, 1, 1,  -1e5, 1e5, 10-0.01, 10+0.01,-1e5, 1e5);
 
-dyna.Set("Bar_Out 1");
+// 创建随机分布的颗粒
+var x = new Array(4.5, 5.5);
+var y = new Array(4.5, 5.5);
+var z = new Array(0.2, 1);
+pdyna.CreateByCoord(3000, 1, 2, 0.1, 0.1, 0.1, x,y,z);
 
-
-//导入gid格式的颗粒
-pdyna.Import("gid","1m1m.msh");
-
-//设置颗粒模型为脆性断裂模型
+// 设定颗粒模型为脆断模型
 pdyna.SetModel("brittleMC");
 
-//设置可材料，依次为依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
-pdyna.SetMat(2500, 3e8, 0.25, 1e7, 5e7, 30, 0.8, 0.0);
+// 设定颗粒接触材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
+pdyna.SetMat(2500, 5e8, 0.25, 0.0, 0.0, 0.0, 0.0, 0.05);
 
+// 设置动态计算时步为1e-4秒
+dyna.Set("Time_Step 2e-4");
 
-//设置一道斜裂缝，并施加参数
-var coord1 = [-0.1,0.5,0];
-var coord2 = [1.1,0.5,0];
-pdyna.SetICMatByLine(-1,-1,0.0,0.0,0.0, coord1, coord2);
-
-pdyna.FixV("xyz",0.0,"y", 0.98,1.1);
-
-
-
-for(var i = 0; i < 5; i++)
-{
-
-var coord1 = new Array(0.1 + i * 0.2, 0.3, 0);
-var coord2 = new Array(0.1 + i * 0.2, 0.7, 0);
-bar.CreateByCoord("cable", coord1, coord2, 20);
-
-}
-
-
-
-//定义两种锚索材料
-var BarProp1 = [0.02, 7800.0, 1e11, 0.25, 235e6, 235e6, 1e7, 35, 1e11, 0.8, 0.0];
-
-bar.SetPropByID(BarProp1, 1, 5, 1, 200);
-
-dyna.Monitor("particle","pa_ydis",0,0,0);
-dyna.Monitor("particle","pa_ydis",0.5,0,0);
-dyna.Monitor("particle","pa_ydis",1,0,0);
-
-//计算4千步
-dyna.Solve(10000);
+// 开始模拟
+dyna.Solve(8000);
```
