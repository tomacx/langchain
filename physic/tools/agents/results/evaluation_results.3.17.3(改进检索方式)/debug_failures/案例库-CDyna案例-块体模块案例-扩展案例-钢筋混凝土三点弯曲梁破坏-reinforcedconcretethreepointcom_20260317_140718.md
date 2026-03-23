# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-钢筋混凝土三点弯曲梁破坏-reinforcedconcretethreepointcom.js

## Query
请编写一个CDyna仿真脚本，实现扩展案例-钢筋混凝土三点弯曲梁破坏-reinforcedconcretethreepointcom，并输出必要的结果与监测。

## Generated Code
```javascript

```

## Ground Truth
```javascript
//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

dyna.Clear();
doc.clearResult();

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//打开杆件计算开关
dyna.Set("If_Cal_Bar 1");

//设置不平衡率为1e-5
dyna.Set("UnBalance_Ratio 1e-5");

//设置3个方向的重力加速度均为0.0
dyna.Set("Gravity 0 0.0 0");

//关闭大变形计算开关
dyna.Set("Large_Displace 1");

dyna.Set("If_Renew_Contact 1")

//设置结果输出时步为500步
dyna.Set("Output_Interval 500");

//监测信息的输出时步为100步
dyna.Set("Moniter_Iter 100");

//打开虚拟质量计算开关
dyna.Set("If_Virtural_Mass 1");

//设置虚拟时步为0.5
dyna.Set("Virtural_Step 0.5");

dyna.Set("Contact_Detect_Tol 0.0");


blkdyn.GenBrick2D(2.0, 0.3, 100, 15,1);

blkdyn.CrtIFace();

blkdyn.UpdateIFaceMesh();


//设置实体单元为线弹性模型
blkdyn.SetModel("linear");

//设置固体单元的材料参数
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e6, 1e6, 30.0, 10.0, 1);

//对模型的底部进行全约束
blkdyn.FixVByCoord("y", 0.0, -0.001, 0.001, -0.001, 0.001, -1e10, 1e10);

//对模型的底部进行全约束
blkdyn.FixVByCoord("y", 0.0, 1.999, 3.01, -0.001, 0.001, -1e10, 1e10);

blkdyn.FixVByCoord("y", -1e-8, 0.999, 1.001, 0.299, 0.301, -1e10, 1e10);


//设定所有接触面的本构为脆性断裂的Mohr-Coulomb本构
blkdyn.SetIModel("brittleMC");

//设定接触面上的材料，依次为单位面积法向刚度、单位面积切向刚度、内摩擦角、粘聚力、抗拉强度
blkdyn.SetIStiffByElem(10.0);

blkdyn.SetIStrengthByElem();


//设置局部阻尼为0.2
blkdyn.SetLocalDamp(0.2);


bar.Import("GiD", "pile", "beam2d.msh");


//设置所有锚索的力学模型为可破坏模型
bar.SetModelByID("failure", 1, 10000);

//定义两种锚索材料
var BarProp1 = [0.02, 7800.0, 1e11, 0.25, 235e6, 235e6, 1e6, 35, 1e11, 0.2, 0.0];


bar.SetPropByID(BarProp1, 1, 1000000, 1, 20);

dyna.Monitor("block", "yforce", 1.0, 0.3, 0.0);
dyna.Monitor("block", "syy", 1.0, 0.25, 0.0);


//求解1.5万步
dyna.Solve(60000);

```

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-扩展案例-钢筋混凝土三点弯曲梁破坏-reinforcedconcretethreepointcom.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-扩展案例-钢筋混凝土三点弯曲梁破坏-reinforcedconcretethreepointcom.js (generated)
@@ -1,91 +0,0 @@
-//设置当前工作路径为JavaScript脚本文件所在路径
-setCurDir(getSrcDir());
-
-dyna.Clear();
-doc.clearResult();
-
-//打开力学计算开关
-dyna.Set("Mechanic_Cal 1");
-
-//打开杆件计算开关
-dyna.Set("If_Cal_Bar 1");
-
-//设置不平衡率为1e-5
-dyna.Set("UnBalance_Ratio 1e-5");
-
-//设置3个方向的重力加速度均为0.0
-dyna.Set("Gravity 0 0.0 0");
-
-//关闭大变形计算开关
-dyna.Set("Large_Displace 1");
-
-dyna.Set("If_Renew_Contact 1")
-
-//设置结果输出时步为500步
-dyna.Set("Output_Interval 500");
-
-//监测信息的输出时步为100步
-dyna.Set("Moniter_Iter 100");
-
-//打开虚拟质量计算开关
-dyna.Set("If_Virtural_Mass 1");
-
-//设置虚拟时步为0.5
-dyna.Set("Virtural_Step 0.5");
-
-dyna.Set("Contact_Detect_Tol 0.0");
-
-
-blkdyn.GenBrick2D(2.0, 0.3, 100, 15,1);
-
-blkdyn.CrtIFace();
-
-blkdyn.UpdateIFaceMesh();
-
-
-//设置实体单元为线弹性模型
-blkdyn.SetModel("linear");
-
-//设置固体单元的材料参数
-blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e6, 1e6, 30.0, 10.0, 1);
-
-//对模型的底部进行全约束
-blkdyn.FixVByCoord("y", 0.0, -0.001, 0.001, -0.001, 0.001, -1e10, 1e10);
-
-//对模型的底部进行全约束
-blkdyn.FixVByCoord("y", 0.0, 1.999, 3.01, -0.001, 0.001, -1e10, 1e10);
-
-blkdyn.FixVByCoord("y", -1e-8, 0.999, 1.001, 0.299, 0.301, -1e10, 1e10);
-
-
-//设定所有接触面的本构为脆性断裂的Mohr-Coulomb本构
-blkdyn.SetIModel("brittleMC");
-
-//设定接触面上的材料，依次为单位面积法向刚度、单位面积切向刚度、内摩擦角、粘聚力、抗拉强度
-blkdyn.SetIStiffByElem(10.0);
-
-blkdyn.SetIStrengthByElem();
-
-
-//设置局部阻尼为0.2
-blkdyn.SetLocalDamp(0.2);
-
-
-bar.Import("GiD", "pile", "beam2d.msh");
-
-
-//设置所有锚索的力学模型为可破坏模型
-bar.SetModelByID("failure", 1, 10000);
-
-//定义两种锚索材料
-var BarProp1 = [0.02, 7800.0, 1e11, 0.25, 235e6, 235e6, 1e6, 35, 1e11, 0.2, 0.0];
-
-
-bar.SetPropByID(BarProp1, 1, 1000000, 1, 20);
-
-dyna.Monitor("block", "yforce", 1.0, 0.3, 0.0);
-dyna.Monitor("block", "syy", 1.0, 0.25, 0.0);
-
-
-//求解1.5万步
-dyna.Solve(60000);
```
