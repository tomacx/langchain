# Failure Analysis: 案例库-CDyna案例-粒子模块案例-扩展案例-球体下落冲击破坏-BallImpact2D.js

## Query
请编写一个CDyna仿真脚本，实现扩展案例-球体下落冲击破坏-BallImpact2D，并输出必要的结果与监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// 设置重力方向为向下
dyna.Set("Gravity 0 0 -9.8");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 设置输出间隔为500步
dyna.Set("Output_Interval 500");

// 设置接触检测容差
dyna.Set("Contact_Detect_Tol 1e-3");

// 导入刚性面边界数据
rdface.Import("ansys", "Bound.dat");

// 开启计算弹性能量接触
dyna.Set("If_Cal_EE_Contact 1");

// 创建几何模型
igeo.genBrickV(450, 450, 310, 550, 550, 400, 10, 1);

// 使用gmsh进行网格划分
imeshing.genMeshByGmsh(3);

// 获取网格数据
blkdyn.GetMesh(imeshing);

// 创建接触面并更新网格
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置材料模型为线弹性模型
blkdyn.SetModel("linear");

// 设置材料参数：密度、杨氏模量、泊松比、拉伸强度、压缩强度、摩擦角、局部阻尼
blkdyn.SetMat(2500, 5e8, 0.3, 0, 0, 15, 0);

// 设置接触面模型为脆性MC模型
blkdyn.SetIModel("brittleMC");

// 设置接触面材料参数：法向刚度、切向刚度、摩擦角、局部阻尼、粘结强度
blkdyn.SetIMat(5e9, 5e9, 15, 0, 0);

// 设置局部阻尼系数
blkdyn.SetLocalDamp(0.02);

// 调整时间步长以确保计算稳定
dyna.TimeStepCorrect(0.6);

// 求解4万步
dyna.Solve(40000);
```

## Ground Truth
```javascript
//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());


//设置输出的间隔为500步
dyna.Set("Output_Interval 500");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

//设置三个方向的全局重力加速度为0
dyna.Set("Gravity 0.0 0.0 0.0");

//打开单元大变形计算开关
dyna.Set("Large_Displace 1");

//打开单元接触更新开关
dyna.Set("If_Renew_Contact 1");

//设置接触容差为1cm
dyna.Set("Contact_Detect_Tol 1e-2");

//设置计算时步为5e-5
dyna.Set("Time_Step 2e-5");

//从GiD导入颗粒
pdyna.Import("gid","BallImpact2D.msh");

//设置颗粒模型为脆性断裂模型
pdyna.SetModel("SSMC");

//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e8, 0.2, 3e7, 6e7, 36, 0.0, 0.1,2);

pdyna.SetMat(2500, 1e6, 0.2, 3e4, 6e4, 25, 0.0, 0.1,1);

var fvalue = new Array(0.0, -10, 0.0);
pdyna.InitCondByGroup ("velocity", fvalue, 2,2);

pdyna.ApplyQuietBoundByCoord(-0.2,0.2,-1000,1000,-1,1);
pdyna.ApplyQuietBoundByCoord(9.8,11,-1000,1000,-1,1);
pdyna.ApplyQuietBoundByCoord(-1000,1000,-0.2,0.2,-1,1);

//求解2万步
dyna.Solve(20000);

//打印信息
print("Solution is ok!");


```

## Unified Diff
```diff
--- 案例库-CDyna案例-粒子模块案例-扩展案例-球体下落冲击破坏-BallImpact2D.js (ground_truth)
+++ 案例库-CDyna案例-粒子模块案例-扩展案例-球体下落冲击破坏-BallImpact2D.js (generated)
@@ -1,49 +1,56 @@
-//设置当前路径为JavaScript脚本所在的路径
 setCurDir(getSrcDir());
 
+// 设置重力方向为向下
+dyna.Set("Gravity 0 0 -9.8");
 
-//设置输出的间隔为500步
+// 打开大变形计算开关
+dyna.Set("Large_Displace 1");
+
+// 关闭虚拟质量开关
+dyna.Set("If_Virtural_Mass 0");
+
+// 设置输出间隔为500步
 dyna.Set("Output_Interval 500");
 
-//关闭虚质量计算开关
-dyna.Set("If_Virtural_Mass 0");
+// 设置接触检测容差
+dyna.Set("Contact_Detect_Tol 1e-3");
 
-//设置三个方向的全局重力加速度为0
-dyna.Set("Gravity 0.0 0.0 0.0");
+// 导入刚性面边界数据
+rdface.Import("ansys", "Bound.dat");
 
-//打开单元大变形计算开关
-dyna.Set("Large_Displace 1");
+// 开启计算弹性能量接触
+dyna.Set("If_Cal_EE_Contact 1");
 
-//打开单元接触更新开关
-dyna.Set("If_Renew_Contact 1");
+// 创建几何模型
+igeo.genBrickV(450, 450, 310, 550, 550, 400, 10, 1);
 
-//设置接触容差为1cm
-dyna.Set("Contact_Detect_Tol 1e-2");
+// 使用gmsh进行网格划分
+imeshing.genMeshByGmsh(3);
 
-//设置计算时步为5e-5
-dyna.Set("Time_Step 2e-5");
+// 获取网格数据
+blkdyn.GetMesh(imeshing);
 
-//从GiD导入颗粒
-pdyna.Import("gid","BallImpact2D.msh");
+// 创建接触面并更新网格
+blkdyn.CrtIFace();
+blkdyn.UpdateIFaceMesh();
 
-//设置颗粒模型为脆性断裂模型
-pdyna.SetModel("SSMC");
+// 设置材料模型为线弹性模型
+blkdyn.SetModel("linear");
 
-//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
-pdyna.SetMat(2500, 1e8, 0.2, 3e7, 6e7, 36, 0.0, 0.1,2);
+// 设置材料参数：密度、杨氏模量、泊松比、拉伸强度、压缩强度、摩擦角、局部阻尼
+blkdyn.SetMat(2500, 5e8, 0.3, 0, 0, 15, 0);
 
-pdyna.SetMat(2500, 1e6, 0.2, 3e4, 6e4, 25, 0.0, 0.1,1);
+// 设置接触面模型为脆性MC模型
+blkdyn.SetIModel("brittleMC");
 
-var fvalue = new Array(0.0, -10, 0.0);
-pdyna.InitCondByGroup ("velocity", fvalue, 2,2);
+// 设置接触面材料参数：法向刚度、切向刚度、摩擦角、局部阻尼、粘结强度
+blkdyn.SetIMat(5e9, 5e9, 15, 0, 0);
 
-pdyna.ApplyQuietBoundByCoord(-0.2,0.2,-1000,1000,-1,1);
-pdyna.ApplyQuietBoundByCoord(9.8,11,-1000,1000,-1,1);
-pdyna.ApplyQuietBoundByCoord(-1000,1000,-0.2,0.2,-1,1);
+// 设置局部阻尼系数
+blkdyn.SetLocalDamp(0.02);
 
-//求解2万步
-dyna.Solve(20000);
+// 调整时间步长以确保计算稳定
+dyna.TimeStepCorrect(0.6);
 
-//打印信息
-print("Solution is ok!");
-
+// 求解4万步
+dyna.Solve(40000);
```
