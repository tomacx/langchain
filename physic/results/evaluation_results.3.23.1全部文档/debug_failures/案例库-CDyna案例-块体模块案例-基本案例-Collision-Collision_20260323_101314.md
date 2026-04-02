# Failure Analysis: 案例库-CDyna案例-块体模块案例-基本案例-Collision-Collision.js

## Query
请编写一个CDyna仿真脚本，实现基本案例-Collision-Collision，并输出必要的结果与监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// 清除环境中的数据
doc.clearResult();
igeo.clear();
imeshing.clear();

// 设置计算参数
dyna.Set("Output_Interval 500");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Contact_Detect_Tol 1e-3");

// 导入几何模型
rdface.Import("ansys", "Bound.dat");

// 设置计算参数
dyna.Set("Gravity 0.0 -9.8 0.0");

// 创建块体并生成网格
igeo.genBrickV(450, 450, 310, 550, 550, 400, 10, 1);
imeshing.genMeshByGmsh(3);

// 获取网格数据
blkdyn.GetMesh(imeshing);

// 创建接触面并更新网格
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置材料模型和参数
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 5e8, 0.3, 0, 0, 15, 0);
blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(5e9, 5e9, 15, 0, 0);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.02);

// 求解计算
dyna.TimeStepCorrect(0.6);
dyna.Solve(40000);
```

## Ground Truth
```javascript
//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置三个方向的重力加速度
dyna.Set("Gravity 0 -9.8 0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//设置监测信息输出时步为100步
dyna.Set("Moniter_Iter 100");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

//打开接触更新计算开关
dyna.Set("If_Renew_Contact 1");

//设置子空间更新时步为100步
dyna.Set("Renew_Interval 100");

//设置接触容差为1mm
dyna.Set("Contact_Detect_Tol 1e-3");

//打开save文件自动保存开关
dyna.Set("SaveFile_Out 1");

//从当前文件夹下导入patran格式的网格文件
blkdyn.ImportGrid("patran", "cdem.out");

//创建范围数组
var x = new Array(-1e10, 1e10);
var y = new Array(-1e10, 19.0);
var z = new Array(-1e10, 1e10);

//将设定范围内的单元的组号更改为2号
blkdyn.SetGroupByCoord(2, x[0], x[1], y[0], y[1], z[0], z[1]);

//对组号为1的单元进行接触面切割生成
blkdyn.CrtIFace(1);

//将组号为2的单元的自由面设定为接触面
blkdyn.CrtBoundIFaceByGroup(2);

//更新接触面网格
blkdyn.UpdateIFaceMesh();

//设定所有单元的本构为线弹性本构
blkdyn.SetModel("linear");

//设定组号为1-100之间的材料参数
blkdyn.SetMat(2500, 1e9, 0.3, 6e4, 3e4, 25.0, 10.0, 1, 100);

//设定所有接触面的本构为脆性断裂的Mohr-Coulomb本构
blkdyn.SetIModel("brittleMC");

//设定接触面上的材料，依次为单位面积法向刚度、单位面积切向刚度、内摩擦角、粘聚力、抗拉强度
blkdyn.SetIMat(1e10, 1e10, 25.0, 0.0, 0.0);

//对设定范围内的节点固定其x及y方向的速度
blkdyn.FixV("xy", 0.0, "y", -1e10, 19.01);

//设定全部节点的局部阻尼系数为0.01
blkdyn.SetLocalDamp(0.01);

//监测三个典型测点的竖直方向的位移
dyna.Monitor("block", "ydis", 200, 140, 0);
dyna.Monitor("block", "ydis", 400, 140, 0);
dyna.Monitor("block", "ydis", 600, 140, 0);

//设置计算时步
dyna.Set("Time_Step 5e-4");

//计算5万步
dyna.Solve(50000);

//打印提示信息
print("Solution Finished");



```

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-基本案例-Collision-Collision.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-基本案例-Collision-Collision.js (generated)
@@ -1,86 +1,43 @@
-//设置当前工作路径为JavaScript脚本文件所在路径
 setCurDir(getSrcDir());
 
-//打开力学计算开关
-dyna.Set("Mechanic_Cal 1");
+// 清除环境中的数据
+doc.clearResult();
+igeo.clear();
+imeshing.clear();
 
-//设置三个方向的重力加速度
-dyna.Set("Gravity 0 -9.8 0");
-
-//打开大变形计算开关
+// 设置计算参数
+dyna.Set("Output_Interval 500");
+dyna.Set("If_Renew_Contact 1");
 dyna.Set("Large_Displace 1");
-
-//设置计算结果的输出间隔为500步
-dyna.Set("Output_Interval 500");
-
-//设置监测信息输出时步为100步
-dyna.Set("Moniter_Iter 100");
-
-//关闭虚质量计算开关
 dyna.Set("If_Virtural_Mass 0");
-
-//打开接触更新计算开关
-dyna.Set("If_Renew_Contact 1");
-
-//设置子空间更新时步为100步
-dyna.Set("Renew_Interval 100");
-
-//设置接触容差为1mm
 dyna.Set("Contact_Detect_Tol 1e-3");
 
-//打开save文件自动保存开关
-dyna.Set("SaveFile_Out 1");
+// 导入几何模型
+rdface.Import("ansys", "Bound.dat");
 
-//从当前文件夹下导入patran格式的网格文件
-blkdyn.ImportGrid("patran", "cdem.out");
+// 设置计算参数
+dyna.Set("Gravity 0.0 -9.8 0.0");
 
-//创建范围数组
-var x = new Array(-1e10, 1e10);
-var y = new Array(-1e10, 19.0);
-var z = new Array(-1e10, 1e10);
+// 创建块体并生成网格
+igeo.genBrickV(450, 450, 310, 550, 550, 400, 10, 1);
+imeshing.genMeshByGmsh(3);
 
-//将设定范围内的单元的组号更改为2号
-blkdyn.SetGroupByCoord(2, x[0], x[1], y[0], y[1], z[0], z[1]);
+// 获取网格数据
+blkdyn.GetMesh(imeshing);
 
-//对组号为1的单元进行接触面切割生成
-blkdyn.CrtIFace(1);
-
-//将组号为2的单元的自由面设定为接触面
-blkdyn.CrtBoundIFaceByGroup(2);
-
-//更新接触面网格
+// 创建接触面并更新网格
+blkdyn.CrtIFace();
 blkdyn.UpdateIFaceMesh();
 
-//设定所有单元的本构为线弹性本构
+// 设置材料模型和参数
 blkdyn.SetModel("linear");
+blkdyn.SetMat(2500, 5e8, 0.3, 0, 0, 15, 0);
+blkdyn.SetIModel("brittleMC");
+blkdyn.SetIMat(5e9, 5e9, 15, 0, 0);
 
-//设定组号为1-100之间的材料参数
-blkdyn.SetMat(2500, 1e9, 0.3, 6e4, 3e4, 25.0, 10.0, 1, 100);
+// 设置局部阻尼
+blkdyn.SetLocalDamp(0.02);
 
-//设定所有接触面的本构为脆性断裂的Mohr-Coulomb本构
-blkdyn.SetIModel("brittleMC");
-
-//设定接触面上的材料，依次为单位面积法向刚度、单位面积切向刚度、内摩擦角、粘聚力、抗拉强度
-blkdyn.SetIMat(1e10, 1e10, 25.0, 0.0, 0.0);
-
-//对设定范围内的节点固定其x及y方向的速度
-blkdyn.FixV("xy", 0.0, "y", -1e10, 19.01);
-
-//设定全部节点的局部阻尼系数为0.01
-blkdyn.SetLocalDamp(0.01);
-
-//监测三个典型测点的竖直方向的位移
-dyna.Monitor("block", "ydis", 200, 140, 0);
-dyna.Monitor("block", "ydis", 400, 140, 0);
-dyna.Monitor("block", "ydis", 600, 140, 0);
-
-//设置计算时步
-dyna.Set("Time_Step 5e-4");
-
-//计算5万步
-dyna.Solve(50000);
-
-//打印提示信息
-print("Solution Finished");
-
-
+// 求解计算
+dyna.TimeStepCorrect(0.6);
+dyna.Solve(40000);
```
