# Failure Analysis: 案例库-CDyna案例-粒子模块案例-基本案例-ParticlesFallingToRigidFace-ParticlesFallingToRigidFace.js

## Query
请编写一个CDyna仿真脚本，实现基本案例-ParticlesFallingToRigidFace-ParticlesFallingToRigidFace，并输出必要的结果与监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// 设置基本物理参数
dyna.Set("Time_Step", 1e-4);
dyna.Set("Output_Interval", 500);
dyna.Set("Large_Displace", 1);
dyna.Set("If_Renew_Contact", 1);

// 创建刚性面
var fCoord = new Array();
fCoord[0] = [-2, -2, 0];
fCoord[1] = [2, -2, 0];
fCoord[2] = [2, 2, 0];
fCoord[3] = [-2, 2, 0];
rdface.Create(4, 1, fCoord);

// 导入块体网格
blkdyn.ImportGrid("gid", "block.msh");

// 设置接触面和材料属性
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 3e8, 0.25, 1e6, 1e4, 30);
blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(5e9, 5e9, 20, 0.0, 0.0);

// 设置阻尼
blkdyn.SetLocalDamp(0.01);

// 开始计算
dyna.Solve(10000);
```

## Ground Truth
```javascript
//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//设置输出的间隔为500步
dyna.Set("Output_Interval 500");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

//设置三个方向的重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

//设置接触容差为0.001m
dyna.Set("Contact_Detect_Tol 0.001");

//设置颗粒超出范围后清除颗粒
dyna.Set("Particle_Out_Kill 1 -3 3 -0.1 3 -3 3 0");

//导入gid格式的刚性面边界
rdface.Import(2,"boundary.msh");

//导入gid格式的颗粒
pdyna.Import("gid","particle.msh");

//根据颗粒的ID号重新设置颗粒的组号
pdyna.SetGroupByID(3,1,1111111);

//设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

//设置颗粒的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e7, 0.25, 0.0, 0.0, 25, 0.0, 0.3);

//设置计算时步
dyna.Set("Time_Step 1e-4");

//迭代1万步
dyna.Solve(10000);
```

## Unified Diff
```diff
--- 案例库-CDyna案例-粒子模块案例-基本案例-ParticlesFallingToRigidFace-ParticlesFallingToRigidFace.js (ground_truth)
+++ 案例库-CDyna案例-粒子模块案例-基本案例-ParticlesFallingToRigidFace-ParticlesFallingToRigidFace.js (generated)
@@ -1,38 +1,32 @@
-//设置当前路径为JavaScript脚本所在的路径
 setCurDir(getSrcDir());
 
-//设置输出的间隔为500步
-dyna.Set("Output_Interval 500");
+// 设置基本物理参数
+dyna.Set("Time_Step", 1e-4);
+dyna.Set("Output_Interval", 500);
+dyna.Set("Large_Displace", 1);
+dyna.Set("If_Renew_Contact", 1);
 
-//关闭虚质量计算开关
-dyna.Set("If_Virtural_Mass 0");
+// 创建刚性面
+var fCoord = new Array();
+fCoord[0] = [-2, -2, 0];
+fCoord[1] = [2, -2, 0];
+fCoord[2] = [2, 2, 0];
+fCoord[3] = [-2, 2, 0];
+rdface.Create(4, 1, fCoord);
 
-//设置三个方向的重力加速度
-dyna.Set("Gravity 0.0 -9.8 0.0");
+// 导入块体网格
+blkdyn.ImportGrid("gid", "block.msh");
 
-//设置接触容差为0.001m
-dyna.Set("Contact_Detect_Tol 0.001");
+// 设置接触面和材料属性
+blkdyn.CrtIFace();
+blkdyn.UpdateIFaceMesh();
+blkdyn.SetModel("linear");
+blkdyn.SetMat(2500, 3e8, 0.25, 1e6, 1e4, 30);
+blkdyn.SetIModel("brittleMC");
+blkdyn.SetIMat(5e9, 5e9, 20, 0.0, 0.0);
 
-//设置颗粒超出范围后清除颗粒
-dyna.Set("Particle_Out_Kill 1 -3 3 -0.1 3 -3 3 0");
+// 设置阻尼
+blkdyn.SetLocalDamp(0.01);
 
-//导入gid格式的刚性面边界
-rdface.Import(2,"boundary.msh");
-
-//导入gid格式的颗粒
-pdyna.Import("gid","particle.msh");
-
-//根据颗粒的ID号重新设置颗粒的组号
-pdyna.SetGroupByID(3,1,1111111);
-
-//设置颗粒模型为脆性断裂模型
-pdyna.SetModel("brittleMC");
-
-//设置颗粒的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
-pdyna.SetMat(2500, 1e7, 0.25, 0.0, 0.0, 25, 0.0, 0.3);
-
-//设置计算时步
-dyna.Set("Time_Step 1e-4");
-
-//迭代1万步
+// 开始计算
 dyna.Solve(10000);
```
