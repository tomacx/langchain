# Failure Analysis: 案例库-CDyna案例-粒子模块案例-扩展案例-PCMM-子弹冲击混凝土靶-BulletAndConcrete.js

## Query
请编写一个CDyna仿真脚本，实现PCMM-子弹冲击混凝土靶-BulletAndConcrete，并输出必要的结果与监测。

## Generated Code
```javascript
// 设置当前工作路径为脚本文件所在路径
setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置三个方向的重力加速度均为0
dyna.Set("Gravity 0.0 0.0 0.0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置接触检测容差为0
dyna.Set("Contact_Detect_Tol 0.0");

// 设置结果输出间隔为500步
dyna.Set("Output_Interval 500");

// 设置监测信息输出时步为10步
dyna.Set("Moniter_Iter 10");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 设置PCMM颗粒的接触容差
dyna.Set("PCMM_Elem_Tol 2e-4");

// 设置颗粒的计算模式为2-PCMM颗粒模式
dyna.Set("Particle_Cal_Type 1");

// 设置MPM计算模式为2
dyna.Set("MPM_Cal_Mode 2");

// 导入网格文件
blkdyn.ImportGrid("gmsh", "CDEM.msh");

// 设置材料模型为线性弹性
blkdyn.SetModel("linear");
// 设置炸药组的材料模型为JWL
blkdyn.SetModel("JWL", 2);

// 指定组1的材料参数，混凝土等
blkdyn.SetMat(2000, 1.5e8, 0.25, 5e6, 5e6, 30, 5);
// 指定组2的炸药材料参数
blkdyn.SetMat(1150, 1e8, 0.25, 3e6, 1e6, 15, 5, 2);

// 设置全局JWL炸药参数，为TNT，材料序号1
var apos = [60.0, 60.0, 0.0];
blkdyn.SetJWLSource(1, 1630, 3e9, 10e9, 1e9, 4.2, 0.95, 0.3, 5e9, 6930.0, apos, 0.0, 10.0);
blkdyn.BindJWLSource(1, 2, 2);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.001);

// 施加无反射边界条件
blkdyn.SetQuietBoundByCoord(-0.1, 0.1, -1e5, 1e5, -1e5, 1e5);
blkdyn.SetQuietBoundByCoord(119.1, 120.1, -1e5, 1e5, -1e5, 1e5);
blkdyn.SetQuietBoundByCoord(-1e5, 1e5, -0.1, 0.1, -1e5, 1e5);
blkdyn.SetQuietBoundByCoord(-1e5, 1e5, 119.1, 120.1, -1e5, 1e5);

// 求解
dyna.Solve(10000);

print("Solution is ok!");
```

## Ground Truth
```javascript
//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//设置虚拟质量为0.3
dyna.Set("Virtural_Step 0.3");

//设置3个方向重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

//设置PCMM颗粒的接触容差
dyna.Set("PCMM_Elem_Tol 0.0018");

//设置颗粒的计算模式为2-PCMM颗粒模式
dyna.Set("Particle_Cal_Type 2");

//创建规则排布的颗粒，组1，矩形弹头
pdyna.RegularCreateByCoord(1,1,0.001,-0.02,0,-0.005,0.005,0,0);

//创建规则排布的颗粒，组2，30cm混凝土板
pdyna.RegularCreateByCoord(2,1,0.001,0.01,0.031,-0.15,0.15,0,0);


//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
//钨弹
pdyna.SetMat(19220, 7.1e11, 0.23, 1e9, 1e9, 0, 0.005, 0.0, 1);

//混凝土
pdyna.SetMat(2550, 3e10, 0.25, 5e6, 5e6, 35, 0.005, 0.0, 2);


//初始化速度等
var fvalue = new Array(100.0, 0.0, 0.0);
pdyna.InitCondByGroup("velocity", fvalue, 1,1);


//设置pcmm模型为线弹性模型
pcmm.SetModelByGroup("MC",1,11);

//固定底部pcmm颗粒三个方向的速度
pdyna.FixV("xyz",0.0, "y", -0.16,-0.149);
pdyna.FixV("xyz",0.0, "y", 0.149,0.16);


dyna.Set("Time_Step 2e-8");


//求解1万步
dyna.Solve(30000);
```

## Unified Diff
```diff
--- 案例库-CDyna案例-粒子模块案例-扩展案例-PCMM-子弹冲击混凝土靶-BulletAndConcrete.js (ground_truth)
+++ 案例库-CDyna案例-粒子模块案例-扩展案例-PCMM-子弹冲击混凝土靶-BulletAndConcrete.js (generated)
@@ -1,57 +1,64 @@
-//设置当前路径为JavaScript脚本所在的路径
+// 设置当前工作路径为脚本文件所在路径
 setCurDir(getSrcDir());
 
-//设置结果的输出间隔为500步
+// 打开力学计算开关
+dyna.Set("Mechanic_Cal 1");
+
+// 设置三个方向的重力加速度均为0
+dyna.Set("Gravity 0.0 0.0 0.0");
+
+// 打开大变形计算开关
+dyna.Set("Large_Displace 1");
+
+// 设置接触检测容差为0
+dyna.Set("Contact_Detect_Tol 0.0");
+
+// 设置结果输出间隔为500步
 dyna.Set("Output_Interval 500");
 
-//关闭虚拟质量开关
+// 设置监测信息输出时步为10步
+dyna.Set("Moniter_Iter 10");
+
+// 关闭虚质量计算开关
 dyna.Set("If_Virtural_Mass 0");
 
-//打开大变形计算开关
-dyna.Set("Large_Displace 1");
+// 设置PCMM颗粒的接触容差
+dyna.Set("PCMM_Elem_Tol 2e-4");
 
-//设置虚拟质量为0.3
-dyna.Set("Virtural_Step 0.3");
+// 设置颗粒的计算模式为2-PCMM颗粒模式
+dyna.Set("Particle_Cal_Type 1");
 
-//设置3个方向重力加速度
-dyna.Set("Gravity 0.0 -9.8 0.0");
+// 设置MPM计算模式为2
+dyna.Set("MPM_Cal_Mode 2");
 
-//设置PCMM颗粒的接触容差
-dyna.Set("PCMM_Elem_Tol 0.0018");
+// 导入网格文件
+blkdyn.ImportGrid("gmsh", "CDEM.msh");
 
-//设置颗粒的计算模式为2-PCMM颗粒模式
-dyna.Set("Particle_Cal_Type 2");
+// 设置材料模型为线性弹性
+blkdyn.SetModel("linear");
+// 设置炸药组的材料模型为JWL
+blkdyn.SetModel("JWL", 2);
 
-//创建规则排布的颗粒，组1，矩形弹头
-pdyna.RegularCreateByCoord(1,1,0.001,-0.02,0,-0.005,0.005,0,0);
+// 指定组1的材料参数，混凝土等
+blkdyn.SetMat(2000, 1.5e8, 0.25, 5e6, 5e6, 30, 5);
+// 指定组2的炸药材料参数
+blkdyn.SetMat(1150, 1e8, 0.25, 3e6, 1e6, 15, 5, 2);
 
-//创建规则排布的颗粒，组2，30cm混凝土板
-pdyna.RegularCreateByCoord(2,1,0.001,0.01,0.031,-0.15,0.15,0,0);
+// 设置全局JWL炸药参数，为TNT，材料序号1
+var apos = [60.0, 60.0, 0.0];
+blkdyn.SetJWLSource(1, 1630, 3e9, 10e9, 1e9, 4.2, 0.95, 0.3, 5e9, 6930.0, apos, 0.0, 10.0);
+blkdyn.BindJWLSource(1, 2, 2);
 
+// 设置局部阻尼
+blkdyn.SetLocalDamp(0.001);
 
-//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
-//钨弹
-pdyna.SetMat(19220, 7.1e11, 0.23, 1e9, 1e9, 0, 0.005, 0.0, 1);
+// 施加无反射边界条件
+blkdyn.SetQuietBoundByCoord(-0.1, 0.1, -1e5, 1e5, -1e5, 1e5);
+blkdyn.SetQuietBoundByCoord(119.1, 120.1, -1e5, 1e5, -1e5, 1e5);
+blkdyn.SetQuietBoundByCoord(-1e5, 1e5, -0.1, 0.1, -1e5, 1e5);
+blkdyn.SetQuietBoundByCoord(-1e5, 1e5, 119.1, 120.1, -1e5, 1e5);
 
-//混凝土
-pdyna.SetMat(2550, 3e10, 0.25, 5e6, 5e6, 35, 0.005, 0.0, 2);
+// 求解
+dyna.Solve(10000);
 
-
-//初始化速度等
-var fvalue = new Array(100.0, 0.0, 0.0);
-pdyna.InitCondByGroup("velocity", fvalue, 1,1);
-
-
-//设置pcmm模型为线弹性模型
-pcmm.SetModelByGroup("MC",1,11);
-
-//固定底部pcmm颗粒三个方向的速度
-pdyna.FixV("xyz",0.0, "y", -0.16,-0.149);
-pdyna.FixV("xyz",0.0, "y", 0.149,0.16);
-
-
-dyna.Set("Time_Step 2e-8");
-
-
-//求解1万步
-dyna.Solve(30000);
+print("Solution is ok!");
```
