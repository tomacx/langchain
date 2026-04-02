# Failure Analysis: 案例库-CDyna案例-块体模块案例-基本案例-TunnelCable-TunnelCable.js

## Query
请编写一个CDyna仿真脚本，实现基本案例-TunnelCable-TunnelCable，并输出必要的结果与监测。

## Generated Code
```javascript
// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

// 清除GDEM-Env中的结果数据
doc.clearResult();

// 设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

// 设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置颗粒间的接触容差
dyna.Set("Contact_Detect_Tol 8e-2");

// 设置求解不平衡率
dyna.Set("UnBalance_Ratio 1e-4");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 设置计算时步
dyna.Set("Time_Step 1e-3");

// 导入gid格式的网格
pdyna.Import("gid","tunnel100m-60m.msh");

// 设置颗粒接触为线弹性模型
pdyna.SetModel("linear");

// 设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e8, 0.25, 1e5, 5e5, 35, 0.8, 0.0);

// 固定模型左右两侧及底部的法向速度
pdyna.FixV("x",0.0,"x", -1,2.0);
pdyna.FixV("x",0.0,"x", 98,101);
pdyna.FixV("y",0.0,"y", -1,2);

// 固定模型左右两侧及底部的转角速度
pdyna.FixRotaV("xyz",0.0,"x", -1,2.0);
pdyna.FixRotaV("xyz",0.0,"x", 98,101);
pdyna.FixRotaV("xyz",0.0,"y", -1,2);

// 设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

// 求解至稳定
dyna.Solve();

// 将颗粒接触模型设定为脆性模型
pdyna.SetModel("brittleMC");

// 求解至稳定
dyna.Solve();

// 单独设定局部阻尼为0
pdyna.SetSingleMat("LocalDamp", 0.0);

// 单独设定粘性阻尼比为0.05
pdyna.SetSingleMat("ViscDamp", 0.05);

// 对坐标范围内的颗粒进行挖空操作
pdyna.SetModelByCoord("none",46,54,30,40,-1,1);

// 计算至稳定
dyna.Solve();
```

## Ground Truth
```javascript
//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//打开杆件计算开关
dyna.Set("If_Cal_Bar 1");

//设置不平衡率为1e-5
dyna.Set("UnBalance_Ratio 1e-5");

//设置3个方向的重力加速度均为0.0
dyna.Set("Gravity 0 0.0 0");

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

//设置实体单元为线弹性模型
blkdyn.SetModel("linear");

//设置固体单元的材料参数
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e1, 1e1, 25.0, 10.0, 1);

//对模型的底部进行全约束
blkdyn.FixVByCoord("xyz", 0.0, -1e10, 1e10, -1e10, 0.001, -1e10, 1e10);

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

//求解1.5万步
dyna.Solve(15000);

```

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-基本案例-TunnelCable-TunnelCable.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-基本案例-TunnelCable-TunnelCable.js (generated)
@@ -1,114 +1,69 @@
-//设置当前工作路径为JavaScript脚本文件所在路径
+// 设置当前工作路径为JavaScript脚本文件所在路径
 setCurDir(getSrcDir());
 
-//打开力学计算开关
-dyna.Set("Mechanic_Cal 1");
+// 清除GDEM-Pdyna计算核心中的内存数据
+dyna.Clear();
 
-//打开杆件计算开关
-dyna.Set("If_Cal_Bar 1");
+// 清除GDEM-Env中的结果数据
+doc.clearResult();
 
-//设置不平衡率为1e-5
-dyna.Set("UnBalance_Ratio 1e-5");
-
-//设置3个方向的重力加速度均为0.0
-dyna.Set("Gravity 0 0.0 0");
-
-//关闭大变形计算开关
-dyna.Set("Large_Displace 0");
-
-//设置结果输出时步为500步
+// 设置结果的输出间隔为500步
 dyna.Set("Output_Interval 500");
 
-//监测信息的输出时步为100步
-dyna.Set("Moniter_Iter 100");
+// 设置重力加速度
+dyna.Set("Gravity 0.0 -9.8 0.0");
 
-//打开虚拟质量计算开关
-dyna.Set("If_Virtural_Mass 1");
+// 设置颗粒间的接触容差
+dyna.Set("Contact_Detect_Tol 8e-2");
 
-//设置虚拟时步为0.5
-dyna.Set("Virtural_Step 0.5");
+// 设置求解不平衡率
+dyna.Set("UnBalance_Ratio 1e-4");
 
-//导入GiD格式的巷道网格文件
-blkdyn.ImportGrid("GiD", "Tunnel.msh");
+// 关闭虚拟质量开关
+dyna.Set("If_Virtural_Mass 0");
 
-//设置实体单元为线弹性模型
-blkdyn.SetModel("linear");
+// 设置计算时步
+dyna.Set("Time_Step 1e-3");
 
-//设置固体单元的材料参数
-blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e1, 1e1, 25.0, 10.0, 1);
+// 导入gid格式的网格
+pdyna.Import("gid","tunnel100m-60m.msh");
 
-//对模型的底部进行全约束
-blkdyn.FixVByCoord("xyz", 0.0, -1e10, 1e10, -1e10, 0.001, -1e10, 1e10);
+// 设置颗粒接触为线弹性模型
+pdyna.SetModel("linear");
 
-//设置局部阻尼为0.8
-blkdyn.SetLocalDamp(0.8);
+// 设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
+pdyna.SetMat(2500, 1e8, 0.25, 1e5, 5e5, 35, 0.8, 0.0);
 
-//监测典型测点的竖向应力
-dyna.Monitor("block", "syy", 15, 13, 0);
-dyna.Monitor("block", "syy", 15, 16, 0);
-dyna.Monitor("block", "syy", 15, 19, 0);
+// 固定模型左右两侧及底部的法向速度
+pdyna.FixV("x",0.0,"x", -1,2.0);
+pdyna.FixV("x",0.0,"x", 98,101);
+pdyna.FixV("y",0.0,"y", -1,2);
 
-//创建第1根锚索
-var fArrayCoord1 = [14,13,0];
-var fArrayCoord2 = [14,18,0];
-bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);
+// 固定模型左右两侧及底部的转角速度
+pdyna.FixRotaV("xyz",0.0,"x", -1,2.0);
+pdyna.FixRotaV("xyz",0.0,"x", 98,101);
+pdyna.FixRotaV("xyz",0.0,"y", -1,2);
 
-//创建第2根锚索
-var fArrayCoord1 = [15, 13, 0];
-var fArrayCoord2 = [15, 18, 0];
-bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);
+// 设置接触容差为0
+dyna.Set("Contact_Detect_Tol 0.0");
 
-//创建第3根锚索
-var fArrayCoord1 = [16, 13, 0];
-var fArrayCoord2 = [16, 18, 0];
-bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);
+// 求解至稳定
+dyna.Solve();
 
-//创建第4根锚索
-var origin = [13,13,0];
-var normal = [-1,1,0];
-bar.CreateByDir("cable", origin, normal, 8, 20);
+// 将颗粒接触模型设定为脆性模型
+pdyna.SetModel("brittleMC");
 
-//创建第5根锚索
-var origin = [17, 13, 0];
-var normal = [1, 1, 0];
-bar.CreateByDir("cable", origin, normal, 8, 20);
+// 求解至稳定
+dyna.Solve();
 
-//创建第6根锚索
-var fArrayCoord1 = [13, 12, 0];
-var fArrayCoord2 = [8, 12, 0];
-bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);
+// 单独设定局部阻尼为0
+pdyna.SetSingleMat("LocalDamp", 0.0);
 
-//创建第7根锚索
-var fArrayCoord1 = [13, 11, 0];
-var fArrayCoord2 = [8, 11, 0];
-bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);
+// 单独设定粘性阻尼比为0.05
+pdyna.SetSingleMat("ViscDamp", 0.05);
 
-//创建第8根锚索
-var fArrayCoord1 = [17, 12, 0];
-var fArrayCoord2 = [22, 12, 0];
-bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);
+// 对坐标范围内的颗粒进行挖空操作
+pdyna.SetModelByCoord("none",46,54,30,40,-1,1);
 
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
-//求解1.5万步
-dyna.Solve(15000);
+// 计算至稳定
+dyna.Solve();
```
