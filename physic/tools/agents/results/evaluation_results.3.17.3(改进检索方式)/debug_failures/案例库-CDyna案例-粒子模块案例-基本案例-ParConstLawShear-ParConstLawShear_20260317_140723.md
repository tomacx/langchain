# Failure Analysis: 案例库-CDyna案例-粒子模块案例-基本案例-ParConstLawShear-ParConstLawShear.js

## Query
请编写一个CDyna仿真脚本，实现基本案例-ParConstLawShear-ParConstLawShear，并输出必要的结果与监测。

## Generated Code
```javascript

```

## Ground Truth
```javascript
//设置工作路径为脚本文件所在路径
setCurDir(getSrcDir());

//清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

//清除GDEM-Env中的结果数据
doc.clearResult();

//关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

//设置结果输出间隔为500步
dyna.Set("Output_Interval 500");

//打开虚拟质量计算开关
dyna.Set("If_Virtural_Mass 1");

//设置全局加速度为0
dyna.Set("Gravity 0.0 0.0 0.0");

//设置接触容差为1e-3
dyna.Set("Contact_Detect_Tol 1e-3");

//设置颗粒与颗粒接触的拉伸断裂应变及剪切断裂应变
dyna.Set("Interface_Soften_Value 0.001 0.005");

//设置颗粒与颗粒接触的拉伸断裂能及剪切断裂能
dyna.Set("PP_FracEnergy 100 500");

//创建第一组颗粒
pdyna.SingleCreate(1,2,0.5,0,0.0,0);
pdyna.SingleCreate(2,2,0.5,0,1.0,0);

//创建第二组颗粒
pdyna.SingleCreate(1,2,0.5,2,0.0,0);
pdyna.SingleCreate(2,2,0.5,2,1.0,0);

//创建第三组颗粒
pdyna.SingleCreate(1,2,0.5,4,0.0,0);
pdyna.SingleCreate(2,2,0.5,4,1.0,0);

//创建第四组颗粒
pdyna.SingleCreate(1,2,0.5,6,0.0,0);
pdyna.SingleCreate(2,2,0.5,6,1.0,0);

//创建第五组颗粒
pdyna.SingleCreate(1,2,0.5,8,0.0,0);
pdyna.SingleCreate(2,2,0.5,8,1.0,0);

//创建第六组颗粒
pdyna.SingleCreate(1,2,0.5,10,0.0,0);
pdyna.SingleCreate(2,2,0.5,10,1.0,0);

//指定颗粒与颗粒之间的接触模型
pdyna.SetModelByCoord("linear"    ,-0.01,  0.01, -100, 100, -100, 100);
pdyna.SetModelByCoord("brittleMC" , 1.99,  2.01, -100, 100, -100, 100);
pdyna.SetModelByCoord("idealMC"   , 3.99,  4.01, -100, 100, -100, 100);
pdyna.SetModelByCoord("SSMC"      , 5.99,  6.01, -100, 100, -100, 100);
pdyna.SetModelByCoord("Damage"    , 7.99,  8.01, -100, 100, -100, 100);
pdyna.SetModelByCoord("Hertz"     , 9.99, 10.01, -100, 100, -100, 100);

//指定材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e10, 0.25, 1e6, 3e6, 30, 0.8, 0.0);

//设置监测点
dyna.Monitor("particle","pa_xdis",  0,1,0);

dyna.Monitor("particle","pa_xforce",0,1,0);
dyna.Monitor("particle","pa_xforce",2,1,0);
dyna.Monitor("particle","pa_xforce",4,1,0);
dyna.Monitor("particle","pa_xforce",6,1,0);
dyna.Monitor("particle","pa_xforce",8,1,0);
dyna.Monitor("particle","pa_xforce",10,1,0);

//顶部施加1MPa压应力
var fvalue = [0, -1e6, 0.0];
pdyna.ApplyFaceForce(fvalue, -1e5, 1e5,0.99, 1.01, -1e5, 1e5);

//底部法向约束
pdyna.FixV("xyz",0.0,"y", -0.01, 0.01);

//固定所有的转动分量
pdyna.FixRotaV("xyz", 0.0, "x", -1000, 1000);

//先求解稳定
dyna.Solve();

//顶部施加1e-7的速度载荷
pdyna.FixV("x",1e-6,"y", 0.99, 1.01);

//求解2万步
dyna.Solve(10000);
```

## Unified Diff
```diff
--- 案例库-CDyna案例-粒子模块案例-基本案例-ParConstLawShear-ParConstLawShear.js (ground_truth)
+++ 案例库-CDyna案例-粒子模块案例-基本案例-ParConstLawShear-ParConstLawShear.js (generated)
@@ -1,93 +0,0 @@
-//设置工作路径为脚本文件所在路径
-setCurDir(getSrcDir());
-
-//清除GDEM-Pdyna计算核心中的内存数据
-dyna.Clear();
-
-//清除GDEM-Env中的结果数据
-doc.clearResult();
-
-//关闭力学计算开关
-dyna.Set("Mechanic_Cal 0");
-
-//设置结果输出间隔为500步
-dyna.Set("Output_Interval 500");
-
-//打开虚拟质量计算开关
-dyna.Set("If_Virtural_Mass 1");
-
-//设置全局加速度为0
-dyna.Set("Gravity 0.0 0.0 0.0");
-
-//设置接触容差为1e-3
-dyna.Set("Contact_Detect_Tol 1e-3");
-
-//设置颗粒与颗粒接触的拉伸断裂应变及剪切断裂应变
-dyna.Set("Interface_Soften_Value 0.001 0.005");
-
-//设置颗粒与颗粒接触的拉伸断裂能及剪切断裂能
-dyna.Set("PP_FracEnergy 100 500");
-
-//创建第一组颗粒
-pdyna.SingleCreate(1,2,0.5,0,0.0,0);
-pdyna.SingleCreate(2,2,0.5,0,1.0,0);
-
-//创建第二组颗粒
-pdyna.SingleCreate(1,2,0.5,2,0.0,0);
-pdyna.SingleCreate(2,2,0.5,2,1.0,0);
-
-//创建第三组颗粒
-pdyna.SingleCreate(1,2,0.5,4,0.0,0);
-pdyna.SingleCreate(2,2,0.5,4,1.0,0);
-
-//创建第四组颗粒
-pdyna.SingleCreate(1,2,0.5,6,0.0,0);
-pdyna.SingleCreate(2,2,0.5,6,1.0,0);
-
-//创建第五组颗粒
-pdyna.SingleCreate(1,2,0.5,8,0.0,0);
-pdyna.SingleCreate(2,2,0.5,8,1.0,0);
-
-//创建第六组颗粒
-pdyna.SingleCreate(1,2,0.5,10,0.0,0);
-pdyna.SingleCreate(2,2,0.5,10,1.0,0);
-
-//指定颗粒与颗粒之间的接触模型
-pdyna.SetModelByCoord("linear"    ,-0.01,  0.01, -100, 100, -100, 100);
-pdyna.SetModelByCoord("brittleMC" , 1.99,  2.01, -100, 100, -100, 100);
-pdyna.SetModelByCoord("idealMC"   , 3.99,  4.01, -100, 100, -100, 100);
-pdyna.SetModelByCoord("SSMC"      , 5.99,  6.01, -100, 100, -100, 100);
-pdyna.SetModelByCoord("Damage"    , 7.99,  8.01, -100, 100, -100, 100);
-pdyna.SetModelByCoord("Hertz"     , 9.99, 10.01, -100, 100, -100, 100);
-
-//指定材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
-pdyna.SetMat(2500, 1e10, 0.25, 1e6, 3e6, 30, 0.8, 0.0);
-
-//设置监测点
-dyna.Monitor("particle","pa_xdis",  0,1,0);
-
-dyna.Monitor("particle","pa_xforce",0,1,0);
-dyna.Monitor("particle","pa_xforce",2,1,0);
-dyna.Monitor("particle","pa_xforce",4,1,0);
-dyna.Monitor("particle","pa_xforce",6,1,0);
-dyna.Monitor("particle","pa_xforce",8,1,0);
-dyna.Monitor("particle","pa_xforce",10,1,0);
-
-//顶部施加1MPa压应力
-var fvalue = [0, -1e6, 0.0];
-pdyna.ApplyFaceForce(fvalue, -1e5, 1e5,0.99, 1.01, -1e5, 1e5);
-
-//底部法向约束
-pdyna.FixV("xyz",0.0,"y", -0.01, 0.01);
-
-//固定所有的转动分量
-pdyna.FixRotaV("xyz", 0.0, "x", -1000, 1000);
-
-//先求解稳定
-dyna.Solve();
-
-//顶部施加1e-7的速度载荷
-pdyna.FixV("x",1e-6,"y", 0.99, 1.01);
-
-//求解2万步
-dyna.Solve(10000);
```
