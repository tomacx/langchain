# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-Young模型柱状药包起爆-Young模型柱状炸药爆破.js

## Query
请编写一个CDyna仿真脚本，实现扩展案例-Young模型柱状药包起爆-Young模型柱状炸药爆破，并输出必要的结果与监测。

## Generated Code
```javascript
// 设置工作路径为脚本文件所在路径
setCurDir(getSrcDir());

// 设置输出间隔为200步
dyna.Set("Output_Interval 200");

// 设置3个方向的重力加速度为0
dyna.Set("Gravity  0 0 0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 设置计算时步
dyna.Set("Time_Step 1e-8");

// 设置颗粒计算类型为 mpm方法
dyna.Set("Particle_Cal_Type 4");

// 设置颗粒与刚性面接触模型采用全局参数
dyna.Set("If_Contact_Use_GlobMat 1 2 1e13 1e13 0.0 0.0 0.0");

// 导入炸药单元，为有限体积网格单元
blkdyn.ImportGrid("gid","explosive.msh");

// 设置单元本构为JWL
blkdyn.SetModel("JWL");

// 设置JWL单元基本参数，主要为密度
blkdyn.SetMat(1630,7e9,0.25,3e6,1e6,35,15);

// 设置JWL炸药参数，并与单元关联
var pos = new Array(0.0, 0.0, 0.0);
blkdyn.SetJWLSource(1, 1630, 7.0e9, 371.2e9, 3.2e9, 4.2, 0.95, 0.30, 21e9, 6930, pos, 0.0, 100);
blkdyn.BindJWLSource(1, 1, 100);

// 设置单元阻尼为0
blkdyn.SetLocalDamp(0.0);

// 导入颗粒模型
pdyna.Import("gid", "circle-cu.msh");

// 设置材料参数，依次为density, young, poisson, tension, cohesion, friction, localdamp, viscdamp
pdyna.SetMat(2500, 7e10, 0.25, 20e6, 40e6, 35, 0.01, 0);

// 创建mpm背景网格
mpm.SetBackGrid(2, 0.01, [-0.3, -0.3, 0], [60, 60, 0]);

// mpm模型切换为理想弹塑性模型
mpm.SetModelByGroup("MC", 1, 2);

// 求解5ms
dyna.DynaCycle(5e-3);
```

## Ground Truth
```javascript
setCurDir(getSrcDir());

dyna.Set("Mechanic_Cal 1");


dyna.Set("UnBalance_Ratio 1e-5");

dyna.Set("Gravity 0.0 0.0 0.0");

dyna.Set("Large_Displace 1");

dyna.Set("Output_Interval 100");


dyna.Set("GiD_Out 0");

dyna.Set("Msr_Out 0");

dyna.Set("Moniter_Iter 10");

dyna.Set("If_Virtural_Mass 0");

dyna.Set("Virtural_Step 0.6");

//设置Young模型的Alpha值及Beta值
dyna.Set("Block_Soften_Value 3.15e6 2");

dyna.Set("If_Cal_Rayleigh 1")

var msh1=imesh.importGmsh("boreblast.msh");

blkdyn.GetMesh(msh1);

//材料模型为Young模型
blkdyn.SetModel("Young", 1);
blkdyn.SetMat(2500, 8e10, 0.3, 3.7e7, 1e7, 35.0, 15.0, 1);


blkdyn.SetModel("Landau", 2);
blkdyn.SetMat(1150, 8e10, 0.3, 3.7e7, 1e7, 35.0, 15.0, 2);
var apos = [10.0, 10.0, 0.0];
blkdyn.SetLandauSource(1, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 0.0, 10);
blkdyn.BindLandauSource(1, 2, 2);


dyna.Monitor("block", "sxx", 11, 10, 0);
dyna.Monitor("block", "sxx", 13, 10, 0);
dyna.Monitor("block", "sxx", 16, 10, 0);


blkdyn.SetLocalDamp(0.0);
blkdyn.SetRayleighDamp(1e-6, 0.0);

dyna.Set("Time_Step 2e-6");

dyna.DynaCycle(4e-3);


print("Solution Finished");

```

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-扩展案例-Young模型柱状药包起爆-Young模型柱状炸药爆破.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-扩展案例-Young模型柱状药包起爆-Young模型柱状炸药爆破.js (generated)
@@ -1,59 +1,55 @@
+// 设置工作路径为脚本文件所在路径
 setCurDir(getSrcDir());
 
-dyna.Set("Mechanic_Cal 1");
+// 设置输出间隔为200步
+dyna.Set("Output_Interval 200");
 
+// 设置3个方向的重力加速度为0
+dyna.Set("Gravity  0 0 0");
 
-dyna.Set("UnBalance_Ratio 1e-5");
-
-dyna.Set("Gravity 0.0 0.0 0.0");
-
+// 打开大变形计算开关
 dyna.Set("Large_Displace 1");
 
-dyna.Set("Output_Interval 100");
-
-
-dyna.Set("GiD_Out 0");
-
-dyna.Set("Msr_Out 0");
-
-dyna.Set("Moniter_Iter 10");
-
+// 关闭虚拟质量开关
 dyna.Set("If_Virtural_Mass 0");
 
-dyna.Set("Virtural_Step 0.6");
+// 设置计算时步
+dyna.Set("Time_Step 1e-8");
 
-//设置Young模型的Alpha值及Beta值
-dyna.Set("Block_Soften_Value 3.15e6 2");
+// 设置颗粒计算类型为 mpm方法
+dyna.Set("Particle_Cal_Type 4");
 
-dyna.Set("If_Cal_Rayleigh 1")
+// 设置颗粒与刚性面接触模型采用全局参数
+dyna.Set("If_Contact_Use_GlobMat 1 2 1e13 1e13 0.0 0.0 0.0");
 
-var msh1=imesh.importGmsh("boreblast.msh");
+// 导入炸药单元，为有限体积网格单元
+blkdyn.ImportGrid("gid","explosive.msh");
 
-blkdyn.GetMesh(msh1);
+// 设置单元本构为JWL
+blkdyn.SetModel("JWL");
 
-//材料模型为Young模型
-blkdyn.SetModel("Young", 1);
-blkdyn.SetMat(2500, 8e10, 0.3, 3.7e7, 1e7, 35.0, 15.0, 1);
+// 设置JWL单元基本参数，主要为密度
+blkdyn.SetMat(1630,7e9,0.25,3e6,1e6,35,15);
 
+// 设置JWL炸药参数，并与单元关联
+var pos = new Array(0.0, 0.0, 0.0);
+blkdyn.SetJWLSource(1, 1630, 7.0e9, 371.2e9, 3.2e9, 4.2, 0.95, 0.30, 21e9, 6930, pos, 0.0, 100);
+blkdyn.BindJWLSource(1, 1, 100);
 
-blkdyn.SetModel("Landau", 2);
-blkdyn.SetMat(1150, 8e10, 0.3, 3.7e7, 1e7, 35.0, 15.0, 2);
-var apos = [10.0, 10.0, 0.0];
-blkdyn.SetLandauSource(1, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 0.0, 10);
-blkdyn.BindLandauSource(1, 2, 2);
+// 设置单元阻尼为0
+blkdyn.SetLocalDamp(0.0);
 
+// 导入颗粒模型
+pdyna.Import("gid", "circle-cu.msh");
 
-dyna.Monitor("block", "sxx", 11, 10, 0);
-dyna.Monitor("block", "sxx", 13, 10, 0);
-dyna.Monitor("block", "sxx", 16, 10, 0);
+// 设置材料参数，依次为density, young, poisson, tension, cohesion, friction, localdamp, viscdamp
+pdyna.SetMat(2500, 7e10, 0.25, 20e6, 40e6, 35, 0.01, 0);
 
+// 创建mpm背景网格
+mpm.SetBackGrid(2, 0.01, [-0.3, -0.3, 0], [60, 60, 0]);
 
-blkdyn.SetLocalDamp(0.0);
-blkdyn.SetRayleighDamp(1e-6, 0.0);
+// mpm模型切换为理想弹塑性模型
+mpm.SetModelByGroup("MC", 1, 2);
 
-dyna.Set("Time_Step 2e-6");
-
-dyna.DynaCycle(4e-3);
-
-
-print("Solution Finished");
+// 求解5ms
+dyna.DynaCycle(5e-3);
```
