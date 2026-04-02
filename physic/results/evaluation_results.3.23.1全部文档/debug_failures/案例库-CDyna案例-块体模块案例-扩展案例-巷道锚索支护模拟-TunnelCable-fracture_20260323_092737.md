# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-巷道锚索支护模拟-TunnelCable-fracture.js

## Query
请编写一个CDyna仿真脚本，实现巷道锚索支护模拟-TunnelCable-fracture，并输出必要的结果与监测。

## Generated Code
```javascript
// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 清除Mesh模块几何数据
igeo.clear();

// 清除Mesh模块网格数据
imeshing.clear();

// 清除BlockDyna模型数据
dyna.Clear();

// 清除Genvi平台数据
doc.clearResult();

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置三个方向的重力加速度均为0
dyna.Set("Gravity 0.0 0.0 0.0");

// 关闭大变形计算开关
dyna.Set("Large_Displace 0");

// 设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 500");

// 设置监测信息输出时步为10步
dyna.Set("Monitor_Iter 10");

// 打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 创建矩形环1
var loopid1 = igeo.genRect(0, 0, 0, 20, 20, 0, 1.0);

// 创建矩形环2
var loopid2 = igeo.genRect(8, 8.5, 0, 12, 11.5, 0, 0.2);

// 创建外边界的面（含矩形空洞）
igeo.genSurface([loopid1, loopid2], 1);

// 创建矩形巷道，填实
igeo.genSurface([loopid2], 2);

// 产生二维网格
imeshing.genMeshByGmsh(2);

// BlockDyna从平台下载网格
blkdyn.GetMesh(imeshing);

// 对两侧单元均为组1的公共面进行切割，设置为接触面
blkdyn.CrtIFace();

// 设置接触后，更新网格信息
blkdyn.UpdateIFaceMesh();

// 指定组1的单元本构为线弹性本构
blkdyn.SetModel("linear");

// 指定材料参数
blkdyn.SetMat(2300, 1e10, 0.25, 5e6, 5e6, 35.0, 15.0);

// 将接触面模型设定为线弹性模型
blkdyn.SetIModel("linear");

// 设定接触面上的材料，依次为单位面积法向刚度、单位面积切向刚度、内摩擦角、粘聚力、抗拉强度
blkdyn.SetIStiffByElem(10.0);

// 设置局部阻尼为0.2
blkdyn.SetLocalDamp(0.01);
```

## Ground Truth
```javascript
//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//打开杆件计算开关
dyna.Set("If_Cal_Bar 0");

//打开杆件结果文件输出开关
dyna.Set("Bar_Out 1");

//设置不平衡率为1e-5
dyna.Set("UnBalance_Ratio 1e-5");

//设置3个方向的重力加速度均为0.0
dyna.Set("Gravity 0 -9.8 0");

//关闭大变形计算开关
dyna.Set("Large_Displace 0");

//设置结果输出时步为500步
dyna.Set("Output_Interval 500");

//监测信息的输出时步为100步
dyna.Set("Moniter_Iter 100");

//打开虚拟质量计算开关
dyna.Set("If_Virtural_Mass 1");

//设置虚拟时步为0.5
dyna.Set("Virtural_Step 0.5");

//导入GiD格式的巷道网格文件
blkdyn.ImportGrid("GiD", "Tunnel.msh");

//设置虚拟接触面，所有单元进行离散
blkdyn.CrtIFace();

//更新单元拓扑信息
blkdyn.UpdateIFaceMesh();

//设置实体单元为线弹性模型
blkdyn.SetModel("linear");

//设置固体单元的材料参数
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e4, 1e4, 25.0, 10.0, 1);

//设置接触面模型为线弹性模型
blkdyn.SetIModel("linear");

//接触面刚度从单元当中继承，是单元特征刚度的1倍
blkdyn.SetIStiffByElem(1.0);
//接触面强度从单元中继承
blkdyn.SetIStrengthByElem();

//对模型的底部及左右两侧进行法向约束
blkdyn.FixV("y", 0.0, "y", -0.01, 0.01);
blkdyn.FixV("x", 0.0, "x", -0.01, 0.01);
blkdyn.FixV("x", 0.0, "x", 29.99, 30.01);

//设置局部阻尼为0.8
blkdyn.SetLocalDamp(0.8);

//监测典型测点的竖向应力
dyna.Monitor("block", "syy", 15, 13, 0);
dyna.Monitor("block", "syy", 15, 16, 0);
dyna.Monitor("block", "syy", 15, 19, 0);

//创建第1根锚索
var fArrayCoord1 = [14,13,0];
var fArrayCoord2 = [14,18,0];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);

//创建第2根锚索
var fArrayCoord1 = [15, 13, 0];
var fArrayCoord2 = [15, 18, 0];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);

//创建第3根锚索
var fArrayCoord1 = [16, 13, 0];
var fArrayCoord2 = [16, 18, 0];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);

//创建第4根锚索
var origin = [13,13,0];
var normal = [-1,1,0];
bar.CreateByDir("cable", origin, normal, 8, 20);

//创建第5根锚索
var origin = [17, 13, 0];
var normal = [1, 1, 0];
bar.CreateByDir("cable", origin, normal, 8, 20);

//创建第6根锚索
var fArrayCoord1 = [13, 12, 0];
var fArrayCoord2 = [8, 12, 0];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);

//创建第7根锚索
var fArrayCoord1 = [13, 11, 0];
var fArrayCoord2 = [8, 11, 0];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);

//创建第8根锚索
var fArrayCoord1 = [17, 12, 0];
var fArrayCoord2 = [22, 12, 0];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);

//创建第9根锚索
var fArrayCoord1 = [17, 11, 0];
var fArrayCoord2 = [22, 11, 0];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);


//设置所有锚索的力学模型为可破坏模型
bar.SetModelByID("failure", 1, 100);

//定义两种锚索材料
var BarProp1 = [1e-2, 7800.0, 1e10, 0.25, 235e6, 235e6, 1e6, 35, 1e9, 0.8, 0.0];
var BarProp2 = [1e-2, 7800.0, 1e10, 0.25, 235e6, 235e6, 0.0, 0.0, 1e9, 0.8, 0.0];

//指定自由段的锚索材料
bar.SetPropByID(BarProp2, 1, 10, 1, 15);

//指定锚固段的锚索材料
bar.SetPropByID(BarProp1, 1, 10, 16, 20);

//在每根锚索的第一个节点上施加预应力，为10kN。
bar.ApplyPreTenForce(1e4, 1,11,1,1);

//求解至稳定
dyna.Solve();


//打开计算开关
dyna.Set("If_Cal_Bar 1");

//施加锚索预应力，计算5000步
dyna.Solve(5000);

//设置锚头端节点的强度，给一个大值，表示锚头节点与围岩紧密绑定
var BarProp3 = [1e-2, 7800.0, 1e10, 0.25, 235e6, 235e6, 1e8, 35, 1e9, 0.8, 0.0];
//制定锚头节点，1节点的参数为 BarProp3
bar.SetPropByID(BarProp3, 1, 10, 1, 1);
//解除预应力施加，设置预应力为0
bar.ApplyPreTenForce(0.0, 1,11,1,1);

//预应力锁定，计算5000步；此时锚杆上的轴力会有一定的损失。
dyna.Solve(5000);


//设置接触面的模型为脆性断裂模型
blkdyn.SetIModel("brittleMC");

//清除位移场
blkdyn.InitConditionByGroup("displace",[0,0,0],[0,0,0,0,0,0,0,0,0], 1,1);

//进行当前强度下锚索支护效果计算
dyna.Solve();

```

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-扩展案例-巷道锚索支护模拟-TunnelCable-fracture.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-扩展案例-巷道锚索支护模拟-TunnelCable-fracture.js (generated)
@@ -1,160 +1,71 @@
-//设置当前工作路径为JavaScript脚本文件所在路径
+// 设置当前工作路径为JavaScript脚本文件所在路径
 setCurDir(getSrcDir());
 
-//打开力学计算开关
+// 清除Mesh模块几何数据
+igeo.clear();
+
+// 清除Mesh模块网格数据
+imeshing.clear();
+
+// 清除BlockDyna模型数据
+dyna.Clear();
+
+// 清除Genvi平台数据
+doc.clearResult();
+
+// 打开力学计算开关
 dyna.Set("Mechanic_Cal 1");
 
-//打开杆件计算开关
-dyna.Set("If_Cal_Bar 0");
+// 设置三个方向的重力加速度均为0
+dyna.Set("Gravity 0.0 0.0 0.0");
 
-//打开杆件结果文件输出开关
-dyna.Set("Bar_Out 1");
-
-//设置不平衡率为1e-5
-dyna.Set("UnBalance_Ratio 1e-5");
-
-//设置3个方向的重力加速度均为0.0
-dyna.Set("Gravity 0 -9.8 0");
-
-//关闭大变形计算开关
+// 关闭大变形计算开关
 dyna.Set("Large_Displace 0");
 
-//设置结果输出时步为500步
+// 设置计算结果的输出间隔为500步
 dyna.Set("Output_Interval 500");
 
-//监测信息的输出时步为100步
-dyna.Set("Moniter_Iter 100");
+// 设置监测信息输出时步为10步
+dyna.Set("Monitor_Iter 10");
 
-//打开虚拟质量计算开关
+// 打开虚质量计算开关
 dyna.Set("If_Virtural_Mass 1");
 
-//设置虚拟时步为0.5
-dyna.Set("Virtural_Step 0.5");
+// 创建矩形环1
+var loopid1 = igeo.genRect(0, 0, 0, 20, 20, 0, 1.0);
 
-//导入GiD格式的巷道网格文件
-blkdyn.ImportGrid("GiD", "Tunnel.msh");
+// 创建矩形环2
+var loopid2 = igeo.genRect(8, 8.5, 0, 12, 11.5, 0, 0.2);
 
-//设置虚拟接触面，所有单元进行离散
+// 创建外边界的面（含矩形空洞）
+igeo.genSurface([loopid1, loopid2], 1);
+
+// 创建矩形巷道，填实
+igeo.genSurface([loopid2], 2);
+
+// 产生二维网格
+imeshing.genMeshByGmsh(2);
+
+// BlockDyna从平台下载网格
+blkdyn.GetMesh(imeshing);
+
+// 对两侧单元均为组1的公共面进行切割，设置为接触面
 blkdyn.CrtIFace();
 
-//更新单元拓扑信息
+// 设置接触后，更新网格信息
 blkdyn.UpdateIFaceMesh();
 
-//设置实体单元为线弹性模型
+// 指定组1的单元本构为线弹性本构
 blkdyn.SetModel("linear");
 
-//设置固体单元的材料参数
-blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e4, 1e4, 25.0, 10.0, 1);
+// 指定材料参数
+blkdyn.SetMat(2300, 1e10, 0.25, 5e6, 5e6, 35.0, 15.0);
 
-//设置接触面模型为线弹性模型
+// 将接触面模型设定为线弹性模型
 blkdyn.SetIModel("linear");
 
-//接触面刚度从单元当中继承，是单元特征刚度的1倍
-blkdyn.SetIStiffByElem(1.0);
-//接触面强度从单元中继承
-blkdyn.SetIStrengthByElem();
+// 设定接触面上的材料，依次为单位面积法向刚度、单位面积切向刚度、内摩擦角、粘聚力、抗拉强度
+blkdyn.SetIStiffByElem(10.0);
 
-//对模型的底部及左右两侧进行法向约束
-blkdyn.FixV("y", 0.0, "y", -0.01, 0.01);
-blkdyn.FixV("x", 0.0, "x", -0.01, 0.01);
-blkdyn.FixV("x", 0.0, "x", 29.99, 30.01);
-
-//设置局部阻尼为0.8
-blkdyn.SetLocalDamp(0.8);
-
-//监测典型测点的竖向应力
-dyna.Monitor("block", "syy", 15, 13, 0);
-dyna.Monitor("block", "syy", 15, 16, 0);
-dyna.Monitor("block", "syy", 15, 19, 0);
-
-//创建第1根锚索
-var fArrayCoord1 = [14,13,0];
-var fArrayCoord2 = [14,18,0];
-bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);
-
-//创建第2根锚索
-var fArrayCoord1 = [15, 13, 0];
-var fArrayCoord2 = [15, 18, 0];
-bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);
-
-//创建第3根锚索
-var fArrayCoord1 = [16, 13, 0];
-var fArrayCoord2 = [16, 18, 0];
-bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);
-
-//创建第4根锚索
-var origin = [13,13,0];
-var normal = [-1,1,0];
-bar.CreateByDir("cable", origin, normal, 8, 20);
-
-//创建第5根锚索
-var origin = [17, 13, 0];
-var normal = [1, 1, 0];
-bar.CreateByDir("cable", origin, normal, 8, 20);
-
-//创建第6根锚索
-var fArrayCoord1 = [13, 12, 0];
-var fArrayCoord2 = [8, 12, 0];
-bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);
-
-//创建第7根锚索
-var fArrayCoord1 = [13, 11, 0];
-var fArrayCoord2 = [8, 11, 0];
-bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);
-
-//创建第8根锚索
-var fArrayCoord1 = [17, 12, 0];
-var fArrayCoord2 = [22, 12, 0];
-bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);
-
-//创建第9根锚索
-var fArrayCoord1 = [17, 11, 0];
-var fArrayCoord2 = [22, 11, 0];
-bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);
-
-
-//设置所有锚索的力学模型为可破坏模型
-bar.SetModelByID("failure", 1, 100);
-
-//定义两种锚索材料
-var BarProp1 = [1e-2, 7800.0, 1e10, 0.25, 235e6, 235e6, 1e6, 35, 1e9, 0.8, 0.0];
-var BarProp2 = [1e-2, 7800.0, 1e10, 0.25, 235e6, 235e6, 0.0, 0.0, 1e9, 0.8, 0.0];
-
-//指定自由段的锚索材料
-bar.SetPropByID(BarProp2, 1, 10, 1, 15);
-
-//指定锚固段的锚索材料
-bar.SetPropByID(BarProp1, 1, 10, 16, 20);
-
-//在每根锚索的第一个节点上施加预应力，为10kN。
-bar.ApplyPreTenForce(1e4, 1,11,1,1);
-
-//求解至稳定
-dyna.Solve();
-
-
-//打开计算开关
-dyna.Set("If_Cal_Bar 1");
-
-//施加锚索预应力，计算5000步
-dyna.Solve(5000);
-
-//设置锚头端节点的强度，给一个大值，表示锚头节点与围岩紧密绑定
-var BarProp3 = [1e-2, 7800.0, 1e10, 0.25, 235e6, 235e6, 1e8, 35, 1e9, 0.8, 0.0];
-//制定锚头节点，1节点的参数为 BarProp3
-bar.SetPropByID(BarProp3, 1, 10, 1, 1);
-//解除预应力施加，设置预应力为0
-bar.ApplyPreTenForce(0.0, 1,11,1,1);
-
-//预应力锁定，计算5000步；此时锚杆上的轴力会有一定的损失。
-dyna.Solve(5000);
-
-
-//设置接触面的模型为脆性断裂模型
-blkdyn.SetIModel("brittleMC");
-
-//清除位移场
-blkdyn.InitConditionByGroup("displace",[0,0,0],[0,0,0,0,0,0,0,0,0], 1,1);
-
-//进行当前强度下锚索支护效果计算
-dyna.Solve();
+// 设置局部阻尼为0.2
+blkdyn.SetLocalDamp(0.01);
```
