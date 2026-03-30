# Failure Analysis: 案例库-CDyna案例-粒子模块案例-基本案例-ParConstLawShear-ParConstLawShear.js

## Query
请编写一个CDyna仿真脚本，实现基本案例-ParConstLawShear-ParConstLawShear，并输出必要的结果与监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// 初始化仿真环境
dyna.Clear();
doc.clearResult();

// 设置基本参数
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Gravity 0.0 0.0 -9.8");
dyna.Set("Contact_Detect_Tol 1e-3");
dyna.Set("Time_Step 5e-4");

// 修正颗粒形状（棱形体，默认）
pfly.FragShapeCorrect(5.0, 3.0, 1.0, 4);

// 创建剪切盒域内的初始颗粒装配
var boxSize = [2.0, 1.0, 0.5];
var particleSize = 0.02;
var numParticles = 100;

pdyna.RegularCreateByCoord(1, 2, particleSize, particleSize, 
    boxSize[0], boxSize[1], boxSize[2], numParticles);

// 设置颗粒接触模型为脆性断裂模型
pdyna.SetModel("brittleMC");

// 设置颗粒材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼
pdyna.SetMat(2500, 1e8, 0.25, 0.0, 0.0, 30, 0.0, 0.1);

// 定义剪切盒边界坐标
var coordTop = new Array([0, 0, boxSize[2]], [boxSize[0], 0, boxSize[2]]);
var coordBottom = new Array([0, 0, 0], [boxSize[0], 0, 0]);

// 创建顶部剪切板（刚性面）
rdface.Create(1, 1, 2, coordTop);

// 创建底部约束面（刚性面）
var coordBottomFull = new Array([0, 0, 0], [boxSize[0], boxSize[1], 0]);
rdface.Create(1, 2, 2, coordBottomFull);

// 设置顶部剪切板位移边界条件
var topVel = 1e-4;
rdface.ApplyVelocityByGroup([topVel, 0, 0], 1, 1);

// 设置底部约束（固定）
rdface.ApplyVelocityByGroup([0, 0, 0], 2, 2);

// 定义剪切面线段，设置接触面材料属性
var shearCoord1 = new Array(0.5, 0, 0);
var shearCoord2 = new Array(0.5, boxSize[1], 0);
blkdyn.SetIMatByLine(1e9, 1e9, 30, 1e6, 1e5, shearCoord1, shearCoord2, 1e-3);

// 设置颗粒与刚性面接触模型为全局参数
dyna.Set("If_Contact_Use_GlobMat 1 2 1e9 1e9 0.0 0.0 0.0");

// 设置监测变量：位移、力、应力
var monitorCoord = new Array(1.0, 0.5, boxSize[2]/2);
dyna.Set("Monitor_Points 1 " + monitorCoord[0] + " " + monitorCoord[1] + " " + monitorCoord[2]);

// 搜索特定网格单元内的颗粒（监测区域）
var cellMin = new Array(0.8, 0.3, boxSize[2]/2 - 0.1);
var cellMax = new Array(1.2, 0.7, boxSize[2]/2 + 0.1);
var totalParInCell = pdyna.SearchParInCell(cellMin[0], cellMin[1], cellMin[2], 
    cellMax[0], cellMax[1], cellMax[2]);

// 获取监测区域内的颗粒ID
if (totalParInCell > 0) {
    for (var i = 1; i <= totalParInCell; i++) {
        var parId = pdyna.GetParIdInCell(i);
        // print(parId, " particle in monitored cell.");
    }
}

// 执行求解迭代循环
dyna.Solve(5000);

// 后处理，输出必要结果
pdyna.PostProcess();
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
@@ -1,93 +1,79 @@
-//设置工作路径为脚本文件所在路径
 setCurDir(getSrcDir());
 
-//清除GDEM-Pdyna计算核心中的内存数据
+// 初始化仿真环境
 dyna.Clear();
-
-//清除GDEM-Env中的结果数据
 doc.clearResult();
 
-//关闭力学计算开关
-dyna.Set("Mechanic_Cal 0");
+// 设置基本参数
+dyna.Set("Output_Interval 500");
+dyna.Set("If_Virtural_Mass 1");
+dyna.Set("Gravity 0.0 0.0 -9.8");
+dyna.Set("Contact_Detect_Tol 1e-3");
+dyna.Set("Time_Step 5e-4");
 
-//设置结果输出间隔为500步
-dyna.Set("Output_Interval 500");
+// 修正颗粒形状（棱形体，默认）
+pfly.FragShapeCorrect(5.0, 3.0, 1.0, 4);
 
-//打开虚拟质量计算开关
-dyna.Set("If_Virtural_Mass 1");
+// 创建剪切盒域内的初始颗粒装配
+var boxSize = [2.0, 1.0, 0.5];
+var particleSize = 0.02;
+var numParticles = 100;
 
-//设置全局加速度为0
-dyna.Set("Gravity 0.0 0.0 0.0");
+pdyna.RegularCreateByCoord(1, 2, particleSize, particleSize, 
+    boxSize[0], boxSize[1], boxSize[2], numParticles);
 
-//设置接触容差为1e-3
-dyna.Set("Contact_Detect_Tol 1e-3");
+// 设置颗粒接触模型为脆性断裂模型
+pdyna.SetModel("brittleMC");
 
-//设置颗粒与颗粒接触的拉伸断裂应变及剪切断裂应变
-dyna.Set("Interface_Soften_Value 0.001 0.005");
+// 设置颗粒材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼
+pdyna.SetMat(2500, 1e8, 0.25, 0.0, 0.0, 30, 0.0, 0.1);
 
-//设置颗粒与颗粒接触的拉伸断裂能及剪切断裂能
-dyna.Set("PP_FracEnergy 100 500");
+// 定义剪切盒边界坐标
+var coordTop = new Array([0, 0, boxSize[2]], [boxSize[0], 0, boxSize[2]]);
+var coordBottom = new Array([0, 0, 0], [boxSize[0], 0, 0]);
 
-//创建第一组颗粒
-pdyna.SingleCreate(1,2,0.5,0,0.0,0);
-pdyna.SingleCreate(2,2,0.5,0,1.0,0);
+// 创建顶部剪切板（刚性面）
+rdface.Create(1, 1, 2, coordTop);
 
-//创建第二组颗粒
-pdyna.SingleCreate(1,2,0.5,2,0.0,0);
-pdyna.SingleCreate(2,2,0.5,2,1.0,0);
+// 创建底部约束面（刚性面）
+var coordBottomFull = new Array([0, 0, 0], [boxSize[0], boxSize[1], 0]);
+rdface.Create(1, 2, 2, coordBottomFull);
 
-//创建第三组颗粒
-pdyna.SingleCreate(1,2,0.5,4,0.0,0);
-pdyna.SingleCreate(2,2,0.5,4,1.0,0);
+// 设置顶部剪切板位移边界条件
+var topVel = 1e-4;
+rdface.ApplyVelocityByGroup([topVel, 0, 0], 1, 1);
 
-//创建第四组颗粒
-pdyna.SingleCreate(1,2,0.5,6,0.0,0);
-pdyna.SingleCreate(2,2,0.5,6,1.0,0);
+// 设置底部约束（固定）
+rdface.ApplyVelocityByGroup([0, 0, 0], 2, 2);
 
-//创建第五组颗粒
-pdyna.SingleCreate(1,2,0.5,8,0.0,0);
-pdyna.SingleCreate(2,2,0.5,8,1.0,0);
+// 定义剪切面线段，设置接触面材料属性
+var shearCoord1 = new Array(0.5, 0, 0);
+var shearCoord2 = new Array(0.5, boxSize[1], 0);
+blkdyn.SetIMatByLine(1e9, 1e9, 30, 1e6, 1e5, shearCoord1, shearCoord2, 1e-3);
 
-//创建第六组颗粒
-pdyna.SingleCreate(1,2,0.5,10,0.0,0);
-pdyna.SingleCreate(2,2,0.5,10,1.0,0);
+// 设置颗粒与刚性面接触模型为全局参数
+dyna.Set("If_Contact_Use_GlobMat 1 2 1e9 1e9 0.0 0.0 0.0");
 
-//指定颗粒与颗粒之间的接触模型
-pdyna.SetModelByCoord("linear"    ,-0.01,  0.01, -100, 100, -100, 100);
-pdyna.SetModelByCoord("brittleMC" , 1.99,  2.01, -100, 100, -100, 100);
-pdyna.SetModelByCoord("idealMC"   , 3.99,  4.01, -100, 100, -100, 100);
-pdyna.SetModelByCoord("SSMC"      , 5.99,  6.01, -100, 100, -100, 100);
-pdyna.SetModelByCoord("Damage"    , 7.99,  8.01, -100, 100, -100, 100);
-pdyna.SetModelByCoord("Hertz"     , 9.99, 10.01, -100, 100, -100, 100);
+// 设置监测变量：位移、力、应力
+var monitorCoord = new Array(1.0, 0.5, boxSize[2]/2);
+dyna.Set("Monitor_Points 1 " + monitorCoord[0] + " " + monitorCoord[1] + " " + monitorCoord[2]);
 
-//指定材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
-pdyna.SetMat(2500, 1e10, 0.25, 1e6, 3e6, 30, 0.8, 0.0);
+// 搜索特定网格单元内的颗粒（监测区域）
+var cellMin = new Array(0.8, 0.3, boxSize[2]/2 - 0.1);
+var cellMax = new Array(1.2, 0.7, boxSize[2]/2 + 0.1);
+var totalParInCell = pdyna.SearchParInCell(cellMin[0], cellMin[1], cellMin[2], 
+    cellMax[0], cellMax[1], cellMax[2]);
 
-//设置监测点
-dyna.Monitor("particle","pa_xdis",  0,1,0);
+// 获取监测区域内的颗粒ID
+if (totalParInCell > 0) {
+    for (var i = 1; i <= totalParInCell; i++) {
+        var parId = pdyna.GetParIdInCell(i);
+        // print(parId, " particle in monitored cell.");
+    }
+}
 
-dyna.Monitor("particle","pa_xforce",0,1,0);
-dyna.Monitor("particle","pa_xforce",2,1,0);
-dyna.Monitor("particle","pa_xforce",4,1,0);
-dyna.Monitor("particle","pa_xforce",6,1,0);
-dyna.Monitor("particle","pa_xforce",8,1,0);
-dyna.Monitor("particle","pa_xforce",10,1,0);
+// 执行求解迭代循环
+dyna.Solve(5000);
 
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
+// 后处理，输出必要结果
+pdyna.PostProcess();
```
