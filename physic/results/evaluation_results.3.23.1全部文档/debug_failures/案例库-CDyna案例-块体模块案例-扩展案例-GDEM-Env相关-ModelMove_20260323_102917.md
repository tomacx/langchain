# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-GDEM-Env相关-ModelMove.js

## Query
请编写一个CDyna仿真脚本，实现GDEM-Env相关-ModelMove，并输出必要的结果与监测。

## Generated Code
```javascript
//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

//清除GDEM-Env中的结果数据
doc.clearResult();

//设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

//导入gid格式的网格
pdyna.Import("gid","slope.msh");

//设置颗粒接触为线弹性模型
pdyna.SetModel("linear");

//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e8, 0.25, 1e5, 5e5, 35, 0.8, 0.0);

//固定模型左右两侧及底部的法向速度
pdyna.FixV("xyz",0.0,"x", -2,3);
pdyna.FixV("xyz",0.0,"x", 117,121);
pdyna.FixV("xyz",0.0,"y", -3,3);

//监测典型颗粒的水平位移
dyna.Monitor("particle","pa_xdis",32.3547,65.9723,0);
dyna.Monitor("particle","pa_xdis",39.0829,52.8447,0);
dyna.Monitor("particle","pa_xdis",42.4554,44.3844,0);
dyna.Monitor("particle","pa_xdis",52.9724, 23.6007, 0);
dyna.Monitor("particle","pa_xdis",60.3594,12.3325,0);

//求解至稳定
dyna.Solve();
```

## Ground Truth
```javascript
setCurDir(getSrcDir());

blkdyn.GenBrick3D(10,10,10,10,10,10,1);

for(var i = 0; i < 1000; i++)
{

//var x = 0.1 * Math.round( Math.sin(i * 0.01));
//var y = 0.1 * Math.round( Math.cos(i * 0.01));
//view.Pan(x, y);

view.rotate(0.5, 0.3,0.3,0.3);

sleep(50);
}
```

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-扩展案例-GDEM-Env相关-ModelMove.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-扩展案例-GDEM-Env相关-ModelMove.js (generated)
@@ -1,15 +1,41 @@
+//设置当前路径为JavaScript脚本所在的路径
 setCurDir(getSrcDir());
 
-blkdyn.GenBrick3D(10,10,10,10,10,10,1);
+//清除GDEM-Pdyna计算核心中的内存数据
+dyna.Clear();
 
-for(var i = 0; i < 1000; i++)
-{
+//清除GDEM-Env中的结果数据
+doc.clearResult();
 
-//var x = 0.1 * Math.round( Math.sin(i * 0.01));
-//var y = 0.1 * Math.round( Math.cos(i * 0.01));
-//view.Pan(x, y);
+//设置结果的输出间隔为500步
+dyna.Set("Output_Interval 500");
 
-view.rotate(0.5, 0.3,0.3,0.3);
+//关闭虚拟质量开关
+dyna.Set("If_Virtural_Mass 0");
 
-sleep(50);
-}
+//设置重力加速度
+dyna.Set("Gravity 0.0 -9.8 0.0");
+
+//导入gid格式的网格
+pdyna.Import("gid","slope.msh");
+
+//设置颗粒接触为线弹性模型
+pdyna.SetModel("linear");
+
+//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
+pdyna.SetMat(2500, 1e8, 0.25, 1e5, 5e5, 35, 0.8, 0.0);
+
+//固定模型左右两侧及底部的法向速度
+pdyna.FixV("xyz",0.0,"x", -2,3);
+pdyna.FixV("xyz",0.0,"x", 117,121);
+pdyna.FixV("xyz",0.0,"y", -3,3);
+
+//监测典型颗粒的水平位移
+dyna.Monitor("particle","pa_xdis",32.3547,65.9723,0);
+dyna.Monitor("particle","pa_xdis",39.0829,52.8447,0);
+dyna.Monitor("particle","pa_xdis",42.4554,44.3844,0);
+dyna.Monitor("particle","pa_xdis",52.9724, 23.6007, 0);
+dyna.Monitor("particle","pa_xdis",60.3594,12.3325,0);
+
+//求解至稳定
+dyna.Solve();
```
