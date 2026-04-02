# Failure Analysis: 案例库-CDyna案例-粒子模块案例-基本案例-SlopeFailure-particle-fracture.js

## Query
请编写一个CDyna仿真脚本，实现SlopeFailure-particle-fracture，并输出必要的结果与监测。

## Generated Code
```javascript
// 设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 设置三个方向的重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置接触容差为0.001m
dyna.Set("Contact_Detect_Tol 0.001");

// 设置颗粒超出范围后清除颗粒
dyna.Set("Particle_Out_Kill 1 -3 3 -0.1 3 -3 3 0");

// 导入gid格式的刚性面边界
rdface.Import(2,"boundary.msh");

// 导入gid格式的颗粒
pdyna.Import("gid","particle.msh");

// 根据颗粒的ID号重新设置颗粒的组号
pdyna.SetGroupByID(3,1,1111111);

// 设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

// 设置颗粒的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e7, 0.25, 0.0, 0.0, 25, 0.0, 0.3);

// 设置计算时步
dyna.Set("Time_Step 1e-4");

// 迭代1万步
dyna.Solve(10000);
```

## Ground Truth
```javascript
//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//清除GDEM-Pdyna计算核心中的内存数据
//dyna.Clear();
//清除GDEM-Env中的结果数据
//doc.ClearResult();

//设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//打开虚拟质量开关
dyna.Set("If_Virtural_Mass 1");

//设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

//设置接触容差（该容差较大，便于找到紧密接触，形成致密连续介质颗粒体系）
dyna.Set("Contact_Detect_Tol 1e-1");


//设置求解不平衡率
dyna.Set("UnBalance_Ratio 5e-4");

//导入gid格式的颗粒
//pdyna.Import("gid","slope.msh");

//创建全局的Table
//var coord = new Array( [20.2073,72.7751,0],  [22.3172,54.7233,0],  [27.006,38.5469,0],  [38.9624,25.4183,0],  [60.3594,12.3325,0], [57.4832,77.4639,0] );
//dyna.CreateTable (1, "table1",6, coord);

//重新分组，将table1指定的范围设定的组2
//pdyna.SetGroupByTable (2, "table1");

pdyna.Import("pdyna", "par.dat");

//设置颗粒接触模型为线弹性模量
pdyna.SetModel("linear");

//设置组1及组2的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e10, 0.25, 1e6,1e6, 35, 0.8, 0.0, 1);
pdyna.SetMat(2500, 1e9, 0.25, 1e4, 1e4, 10, 0.8, 0.0, 2);

//模型左右两侧及底部法向约束
pdyna.FixV("xyz",0.0,"x", -2,3.0);
pdyna.FixV("xyz",0.0,"x", 117,121);
pdyna.FixV("xyz",0.0,"y", -3,3);


//监测典型颗粒的水平位移
dyna.Monitor("particle","pa_xdis",32.3547,65.9723,0);
dyna.Monitor("particle","pa_xdis",39.0829,52.8447,0);
dyna.Monitor("particle","pa_xdis",42.4554,44.3844,0);
dyna.Monitor("particle","pa_xdis",52.9724, 23.6007, 0);
dyna.Monitor("particle","pa_xdis",60.3594,12.3325,0);
dyna.Monitor("particle","pa_xdis",76.3853,8.8268,0);

//求解至稳定
//dyna.Solve();

//设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

//独立设置局部阻尼及粘性阻尼系数
pdyna.SetSingleMat("LocalDamp", 0.0);
pdyna.SetSingleMat("ViscDamp", 0.2);

//设置颗粒的接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

//求解30000步
//dyna.Solve(30000);

```

## Unified Diff
```diff
--- 案例库-CDyna案例-粒子模块案例-基本案例-SlopeFailure-particle-fracture.js (ground_truth)
+++ 案例库-CDyna案例-粒子模块案例-基本案例-SlopeFailure-particle-fracture.js (generated)
@@ -1,72 +1,35 @@
-//设置当前路径为JavaScript脚本所在的路径
+// 设置当前路径为JavaScript脚本所在的路径
 setCurDir(getSrcDir());
 
-//清除GDEM-Pdyna计算核心中的内存数据
-//dyna.Clear();
-//清除GDEM-Env中的结果数据
-//doc.ClearResult();
+// 关闭虚质量计算开关
+dyna.Set("If_Virtural_Mass 0");
 
-//设置结果的输出间隔为500步
-dyna.Set("Output_Interval 500");
-
-//打开虚拟质量开关
-dyna.Set("If_Virtural_Mass 1");
-
-//设置重力加速度
+// 设置三个方向的重力加速度
 dyna.Set("Gravity 0.0 -9.8 0.0");
 
-//设置接触容差（该容差较大，便于找到紧密接触，形成致密连续介质颗粒体系）
-dyna.Set("Contact_Detect_Tol 1e-1");
+// 设置接触容差为0.001m
+dyna.Set("Contact_Detect_Tol 0.001");
 
+// 设置颗粒超出范围后清除颗粒
+dyna.Set("Particle_Out_Kill 1 -3 3 -0.1 3 -3 3 0");
 
-//设置求解不平衡率
-dyna.Set("UnBalance_Ratio 5e-4");
+// 导入gid格式的刚性面边界
+rdface.Import(2,"boundary.msh");
 
-//导入gid格式的颗粒
-//pdyna.Import("gid","slope.msh");
+// 导入gid格式的颗粒
+pdyna.Import("gid","particle.msh");
 
-//创建全局的Table
-//var coord = new Array( [20.2073,72.7751,0],  [22.3172,54.7233,0],  [27.006,38.5469,0],  [38.9624,25.4183,0],  [60.3594,12.3325,0], [57.4832,77.4639,0] );
-//dyna.CreateTable (1, "table1",6, coord);
+// 根据颗粒的ID号重新设置颗粒的组号
+pdyna.SetGroupByID(3,1,1111111);
 
-//重新分组，将table1指定的范围设定的组2
-//pdyna.SetGroupByTable (2, "table1");
-
-pdyna.Import("pdyna", "par.dat");
-
-//设置颗粒接触模型为线弹性模量
-pdyna.SetModel("linear");
-
-//设置组1及组2的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
-pdyna.SetMat(2500, 1e10, 0.25, 1e6,1e6, 35, 0.8, 0.0, 1);
-pdyna.SetMat(2500, 1e9, 0.25, 1e4, 1e4, 10, 0.8, 0.0, 2);
-
-//模型左右两侧及底部法向约束
-pdyna.FixV("xyz",0.0,"x", -2,3.0);
-pdyna.FixV("xyz",0.0,"x", 117,121);
-pdyna.FixV("xyz",0.0,"y", -3,3);
-
-
-//监测典型颗粒的水平位移
-dyna.Monitor("particle","pa_xdis",32.3547,65.9723,0);
-dyna.Monitor("particle","pa_xdis",39.0829,52.8447,0);
-dyna.Monitor("particle","pa_xdis",42.4554,44.3844,0);
-dyna.Monitor("particle","pa_xdis",52.9724, 23.6007, 0);
-dyna.Monitor("particle","pa_xdis",60.3594,12.3325,0);
-dyna.Monitor("particle","pa_xdis",76.3853,8.8268,0);
-
-//求解至稳定
-//dyna.Solve();
-
-//设置颗粒模型为脆性断裂模型
+// 设置颗粒模型为脆性断裂模型
 pdyna.SetModel("brittleMC");
 
-//独立设置局部阻尼及粘性阻尼系数
-pdyna.SetSingleMat("LocalDamp", 0.0);
-pdyna.SetSingleMat("ViscDamp", 0.2);
+// 设置颗粒的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
+pdyna.SetMat(2500, 1e7, 0.25, 0.0, 0.0, 25, 0.0, 0.3);
 
-//设置颗粒的接触容差为0
-dyna.Set("Contact_Detect_Tol 0.0");
+// 设置计算时步
+dyna.Set("Time_Step 1e-4");
 
-//求解30000步
-//dyna.Solve(30000);
+// 迭代1万步
+dyna.Solve(10000);
```
