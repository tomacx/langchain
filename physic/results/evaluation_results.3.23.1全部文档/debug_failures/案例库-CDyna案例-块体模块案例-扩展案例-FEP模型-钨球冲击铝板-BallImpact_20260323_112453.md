# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-FEP模型-钨球冲击铝板-BallImpact.js

## Query
请编写一个CDyna仿真脚本，实现FEP模型-钨球冲击铝板-BallImpact，并输出必要的结果与监测。

## Generated Code
```javascript
// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 清除Mesh模块几何数据和网格数据
igeo.clear();
imeshing.clear();

// 清除BlockDyna模型数据及Genvi平台数据
dyna.Clear();
doc.clearResult();

// 打开力学计算开关并设置重力加速度为0
dyna.Set("Mechanic_Cal", 1);
dyna.Set("Gravity", 0.0, 0.0, 0.0);

// 设置大变形计算开关和接触更新开关
dyna.Set("Large_Displace", 1);
dyna.Set("If_Renew_Contact", 1);

// 创建一个矩形区域作为几何模型
var loopid = igeo.genRect(0, 0, 0, 20, 20, 0, 1.0);
igeo.genSurface([loopid], 1);

// 使用Gmsh生成二维网格
imeshing.genMeshByGmsh(2);

// BlockDyna从平台下载网格数据
blkdyn.GetMesh(imeshing);

// 设置接触面并更新网格信息
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 指定材料属性，包括密度、弹性模量等
blkdyn.SetMat(2300, 1e10, 0.25, 5e6, 5e6, 35.0, 15.0);

// 设置单元本构模型为线性弹性模型
blkdyn.SetModel("linear");

// 将接触面的材料属性设置为与实体相同
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();

// 输出计算结果文件
dyna.Output();
```

## Ground Truth
```javascript
setCurDir(getSrcDir());

dyna.Set("Large_Displace 1");

dyna.Set("If_Virtural_Mass 0");

dyna.Set("If_Renew_Contact 1");

dyna.Set("Contact_Detect_Tol 0.0");

dyna.Set("Output_Interval 500");

//设置单元溶蚀，溶蚀提应变为1，溶蚀剪应变为1，开启溶蚀的组号为1
dyna.Set("Elem_Kill_Option 1 0.6 0.6 1 1");

//开启自动创建接触开关
dyna.Set("If_Auto_Create_Contact 1 1");

//导入gid格式的网格文件
blkdyn.ImportGrid("gid","BallImpactTarget.msh");

//设置模型为流体弹塑性模型
blkdyn.SetModel("FEP");

//设置铝基础参数，仅密度、弹模、泊松比起作用。
blkdyn.SetMat(2703, 3e9,0.25, 3e6, 1e6, 35, 15, 1);

//设置钨基础参数，仅密度、弹模、泊松比起作用。
blkdyn.SetMat(15630, 344.7e9,0.28, 3e6, 1e6, 35, 15, 2);



//铝板，JC参数
blkdyn.SetJCMat(1, 324e6, 114e6, 0.42, 0.016, 1.34, 298, 877, 875, 1.0 , true);
blkdyn.BindJCMat(1, 1, 1);

//钨球，JC参数
blkdyn.SetJCMat(2, 1200e6, 1030e6, 0.019, 0.034, 0.4, 298, 1723, 134, 1.0 , true);
blkdyn.BindJCMat(2, 2, 2);

//铝板，MG参数
blkdyn.SetMGMat(1, 2703, 5350, 1.34, 1.97, 1.5);
blkdyn.BindMGMat(1, 1, 1);

//钨球，MG参数
blkdyn.SetMGMat(2, 19220, 4020, 1.24, 1.67, 1.3);
blkdyn.BindMGMat(2, 2, 2);

blkdyn.SetLocalDamp(0.01);

//对铝板施加为位移约束
blkdyn.FixV("xy", 0.0, "y", -0.001, 0.001);
blkdyn.FixV("xy", 0, "y", 0.0999, 0.11);

//////对钨球施加初速度
//定义三个方向基础值
var values = new Array(1000.0,0.0, 0);
//定义变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
//将组号1到3范围内的节点速度初始化为设定值
blkdyn.InitConditionByGroup("velocity", values, gradient, 2, 2);

//自动计算时步
dyna.TimeStepCorrect(0.05);

dyna.DynaCycle(2e-5);
```

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-扩展案例-FEP模型-钨球冲击铝板-BallImpact.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-扩展案例-FEP模型-钨球冲击铝板-BallImpact.js (generated)
@@ -1,66 +1,45 @@
+// 设置当前工作路径为JavaScript脚本文件所在路径
 setCurDir(getSrcDir());
 
-dyna.Set("Large_Displace 1");
+// 清除Mesh模块几何数据和网格数据
+igeo.clear();
+imeshing.clear();
 
-dyna.Set("If_Virtural_Mass 0");
+// 清除BlockDyna模型数据及Genvi平台数据
+dyna.Clear();
+doc.clearResult();
 
-dyna.Set("If_Renew_Contact 1");
+// 打开力学计算开关并设置重力加速度为0
+dyna.Set("Mechanic_Cal", 1);
+dyna.Set("Gravity", 0.0, 0.0, 0.0);
 
-dyna.Set("Contact_Detect_Tol 0.0");
+// 设置大变形计算开关和接触更新开关
+dyna.Set("Large_Displace", 1);
+dyna.Set("If_Renew_Contact", 1);
 
-dyna.Set("Output_Interval 500");
+// 创建一个矩形区域作为几何模型
+var loopid = igeo.genRect(0, 0, 0, 20, 20, 0, 1.0);
+igeo.genSurface([loopid], 1);
 
-//设置单元溶蚀，溶蚀提应变为1，溶蚀剪应变为1，开启溶蚀的组号为1
-dyna.Set("Elem_Kill_Option 1 0.6 0.6 1 1");
+// 使用Gmsh生成二维网格
+imeshing.genMeshByGmsh(2);
 
-//开启自动创建接触开关
-dyna.Set("If_Auto_Create_Contact 1 1");
+// BlockDyna从平台下载网格数据
+blkdyn.GetMesh(imeshing);
 
-//导入gid格式的网格文件
-blkdyn.ImportGrid("gid","BallImpactTarget.msh");
+// 设置接触面并更新网格信息
+blkdyn.CrtIFace();
+blkdyn.UpdateIFaceMesh();
 
-//设置模型为流体弹塑性模型
-blkdyn.SetModel("FEP");
+// 指定材料属性，包括密度、弹性模量等
+blkdyn.SetMat(2300, 1e10, 0.25, 5e6, 5e6, 35.0, 15.0);
 
-//设置铝基础参数，仅密度、弹模、泊松比起作用。
-blkdyn.SetMat(2703, 3e9,0.25, 3e6, 1e6, 35, 15, 1);
+// 设置单元本构模型为线性弹性模型
+blkdyn.SetModel("linear");
 
-//设置钨基础参数，仅密度、弹模、泊松比起作用。
-blkdyn.SetMat(15630, 344.7e9,0.28, 3e6, 1e6, 35, 15, 2);
+// 将接触面的材料属性设置为与实体相同
+blkdyn.SetIStiffByElem(1);
+blkdyn.SetIStrengthByElem();
 
-
-
-//铝板，JC参数
-blkdyn.SetJCMat(1, 324e6, 114e6, 0.42, 0.016, 1.34, 298, 877, 875, 1.0 , true);
-blkdyn.BindJCMat(1, 1, 1);
-
-//钨球，JC参数
-blkdyn.SetJCMat(2, 1200e6, 1030e6, 0.019, 0.034, 0.4, 298, 1723, 134, 1.0 , true);
-blkdyn.BindJCMat(2, 2, 2);
-
-//铝板，MG参数
-blkdyn.SetMGMat(1, 2703, 5350, 1.34, 1.97, 1.5);
-blkdyn.BindMGMat(1, 1, 1);
-
-//钨球，MG参数
-blkdyn.SetMGMat(2, 19220, 4020, 1.24, 1.67, 1.3);
-blkdyn.BindMGMat(2, 2, 2);
-
-blkdyn.SetLocalDamp(0.01);
-
-//对铝板施加为位移约束
-blkdyn.FixV("xy", 0.0, "y", -0.001, 0.001);
-blkdyn.FixV("xy", 0, "y", 0.0999, 0.11);
-
-//////对钨球施加初速度
-//定义三个方向基础值
-var values = new Array(1000.0,0.0, 0);
-//定义变化梯度
-var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
-//将组号1到3范围内的节点速度初始化为设定值
-blkdyn.InitConditionByGroup("velocity", values, gradient, 2, 2);
-
-//自动计算时步
-dyna.TimeStepCorrect(0.05);
-
-dyna.DynaCycle(2e-5);
+// 输出计算结果文件
+dyna.Output();
```
