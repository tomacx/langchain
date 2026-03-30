# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-巷道锚索支护模拟-TunnelCable-fracture.js

## Query
请编写一个CDyna仿真脚本，实现巷道锚索支护模拟-TunnelCable-fracture，并输出必要的结果与监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// ========== 1. 初始化仿真环境 ==========
dyna.Set("Mechanic_Cal 1");
dyna.Set("If_Cal_Bar 1");
dyna.Set("Bar_Out 1");
dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("Monitor_Iter 100");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.5");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 0.0");

// ========== 2. 创建巷道围岩块体网格 ==========
var loopid1 = igeo.genRect(0, 0, 0, 30, 20, 0, 1.0);
var loopid2 = igeo.genRect(8, 8.5, 0, 12, 11.5, 0, 0.2);
igeo.genSurface([loopid1, loopid2], 1);
igeo.genSurface([loopid2], 2);

imeshing.genMeshByGmsh(2);

blkdyn.GetMesh(imeshing);
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// ========== 3. 定义围岩材料属性参数 ==========
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 3e10, 0.25, 3e4, 1e4, 25.0, 10.0, 1);

// ========== 4. 插入锚索支护单元 ==========
var fArrayCoord1 = [14, 13, 0];
var fArrayCoord2 = [14, 18, 0];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);

var fArrayCoord3 = [15, 13, 0];
var fArrayCoord4 = [15, 18, 0];
bar.CreateByCoord("cable", fArrayCoord3, fArrayCoord4, 20);

var fArrayCoord5 = [16, 13, 0];
var fArrayCoord6 = [16, 18, 0];
bar.CreateByCoord("cable", fArrayCoord5, fArrayCoord6, 20);

// ========== 5. 施加开挖边界条件及初始应力场 ==========
blkdyn.FixV("y", 0.0, "y", -0.01, 0.01);
blkdyn.FixV("x", 0.0, "x", -0.01, 0.01);
blkdyn.FixV("x", 0.0, "x", 29.99, 30.01);

// 初始地应力场（模拟水平应力）
blkdyn.InitConditionByCoord("stress", [0, 0, 0], [1e6, 1e6, 0], 0, 0, 0, 30, 20);

// ========== 6. 设置裂隙渗流参数 ==========
fracsp.SetPropByCoord(1e-12, 1e7, 0.5, [0, 0, 0], [30, 20, 0]);
fracsp.SetPropByGroup(1e-12, 1e7, 0.5);

// ========== 7. 配置监测点 ==========
dyna.Monitor("block", "syy", 15, 13, 0);
dyna.Monitor("block", "syy", 15, 16, 0);
dyna.Monitor("block", "syy", 15, 19, 0);
dyna.Monitor("cable", "strain", 1, 0);
dyna.Monitor("cable", "strain", 2, 0);
dyna.Monitor("cable", "strain", 3, 0);

// ========== 8. 动态渗流边界条件设置 ==========
fracsp.CalDynaBound();
fracsp.CalNodePressure();
fracsp.CalElemDischarge();
fracsp.CalIntSolid();

// ========== 9. 配置求解器参数 ==========
dyna.Set("Solver_Type 1");
dyna.Set("Max_Iter 1000");
dyna.Set("Converge_Tol 1e-6");

// ========== 10. 执行仿真循环并输出结果 ==========
var step = 0;
while (step < 5000) {
    blkdyn.Solve();
    fracsp.Solver();
    step++;
}

blkdyn.ExportResult("result.dat");
fracsp.ExportResult("fracture_flow.dat");
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
@@ -1,160 +1,86 @@
-//设置当前工作路径为JavaScript脚本文件所在路径
 setCurDir(getSrcDir());
 
-//打开力学计算开关
+// ========== 1. 初始化仿真环境 ==========
 dyna.Set("Mechanic_Cal 1");
+dyna.Set("If_Cal_Bar 1");
+dyna.Set("Bar_Out 1");
+dyna.Set("UnBalance_Ratio 1e-5");
+dyna.Set("Gravity 0 -9.8 0");
+dyna.Set("Large_Displace 1");
+dyna.Set("Output_Interval 500");
+dyna.Set("Monitor_Iter 100");
+dyna.Set("If_Virtural_Mass 1");
+dyna.Set("Virtural_Step 0.5");
+dyna.Set("If_Renew_Contact 1");
+dyna.Set("Contact_Detect_Tol 0.0");
 
-//打开杆件计算开关
-dyna.Set("If_Cal_Bar 0");
+// ========== 2. 创建巷道围岩块体网格 ==========
+var loopid1 = igeo.genRect(0, 0, 0, 30, 20, 0, 1.0);
+var loopid2 = igeo.genRect(8, 8.5, 0, 12, 11.5, 0, 0.2);
+igeo.genSurface([loopid1, loopid2], 1);
+igeo.genSurface([loopid2], 2);
 
-//打开杆件结果文件输出开关
-dyna.Set("Bar_Out 1");
+imeshing.genMeshByGmsh(2);
 
-//设置不平衡率为1e-5
-dyna.Set("UnBalance_Ratio 1e-5");
-
-//设置3个方向的重力加速度均为0.0
-dyna.Set("Gravity 0 -9.8 0");
-
-//关闭大变形计算开关
-dyna.Set("Large_Displace 0");
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
-//导入GiD格式的巷道网格文件
-blkdyn.ImportGrid("GiD", "Tunnel.msh");
-
-//设置虚拟接触面，所有单元进行离散
+blkdyn.GetMesh(imeshing);
 blkdyn.CrtIFace();
-
-//更新单元拓扑信息
 blkdyn.UpdateIFaceMesh();
 
-//设置实体单元为线弹性模型
+// ========== 3. 定义围岩材料属性参数 ==========
 blkdyn.SetModel("linear");
+blkdyn.SetMat(2500, 3e10, 0.25, 3e4, 1e4, 25.0, 10.0, 1);
 
-//设置固体单元的材料参数
-blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e4, 1e4, 25.0, 10.0, 1);
+// ========== 4. 插入锚索支护单元 ==========
+var fArrayCoord1 = [14, 13, 0];
+var fArrayCoord2 = [14, 18, 0];
+bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);
 
-//设置接触面模型为线弹性模型
-blkdyn.SetIModel("linear");
+var fArrayCoord3 = [15, 13, 0];
+var fArrayCoord4 = [15, 18, 0];
+bar.CreateByCoord("cable", fArrayCoord3, fArrayCoord4, 20);
 
-//接触面刚度从单元当中继承，是单元特征刚度的1倍
-blkdyn.SetIStiffByElem(1.0);
-//接触面强度从单元中继承
-blkdyn.SetIStrengthByElem();
+var fArrayCoord5 = [16, 13, 0];
+var fArrayCoord6 = [16, 18, 0];
+bar.CreateByCoord("cable", fArrayCoord5, fArrayCoord6, 20);
 
-//对模型的底部及左右两侧进行法向约束
+// ========== 5. 施加开挖边界条件及初始应力场 ==========
 blkdyn.FixV("y", 0.0, "y", -0.01, 0.01);
 blkdyn.FixV("x", 0.0, "x", -0.01, 0.01);
 blkdyn.FixV("x", 0.0, "x", 29.99, 30.01);
 
-//设置局部阻尼为0.8
-blkdyn.SetLocalDamp(0.8);
+// 初始地应力场（模拟水平应力）
+blkdyn.InitConditionByCoord("stress", [0, 0, 0], [1e6, 1e6, 0], 0, 0, 0, 30, 20);
 
-//监测典型测点的竖向应力
+// ========== 6. 设置裂隙渗流参数 ==========
+fracsp.SetPropByCoord(1e-12, 1e7, 0.5, [0, 0, 0], [30, 20, 0]);
+fracsp.SetPropByGroup(1e-12, 1e7, 0.5);
+
+// ========== 7. 配置监测点 ==========
 dyna.Monitor("block", "syy", 15, 13, 0);
 dyna.Monitor("block", "syy", 15, 16, 0);
 dyna.Monitor("block", "syy", 15, 19, 0);
+dyna.Monitor("cable", "strain", 1, 0);
+dyna.Monitor("cable", "strain", 2, 0);
+dyna.Monitor("cable", "strain", 3, 0);
 
-//创建第1根锚索
-var fArrayCoord1 = [14,13,0];
-var fArrayCoord2 = [14,18,0];
-bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);
+// ========== 8. 动态渗流边界条件设置 ==========
+fracsp.CalDynaBound();
+fracsp.CalNodePressure();
+fracsp.CalElemDischarge();
+fracsp.CalIntSolid();
 
-//创建第2根锚索
-var fArrayCoord1 = [15, 13, 0];
-var fArrayCoord2 = [15, 18, 0];
-bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);
+// ========== 9. 配置求解器参数 ==========
+dyna.Set("Solver_Type 1");
+dyna.Set("Max_Iter 1000");
+dyna.Set("Converge_Tol 1e-6");
 
-//创建第3根锚索
-var fArrayCoord1 = [16, 13, 0];
-var fArrayCoord2 = [16, 18, 0];
-bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);
+// ========== 10. 执行仿真循环并输出结果 ==========
+var step = 0;
+while (step < 5000) {
+    blkdyn.Solve();
+    fracsp.Solver();
+    step++;
+}
 
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
+blkdyn.ExportResult("result.dat");
+fracsp.ExportResult("fracture_flow.dat");
```
