# Failure Analysis: 案例库-CDyna案例-块体模块案例-基本案例-Slope3DPlastic-Slope3D.js

## Query
请编写一个CDyna仿真脚本，实现基本案例-Slope3DPlastic-Slope3D，并输出必要的结果与监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// 清除内存数据和结果数据
dyna.Clear();
doc.clearResult();

// 设置重力加速度
dyna.Set("Gravity 0 -9.8 0");

// 设置输出间隔
dyna.Set("Output_Interval 100000");

// 导入网格文件并获取网格信息
var msh1 = imesh.importGid("SlopeExcavate.msh");
blkdyn.GetMesh(msh1);

// 设置模型为线弹性模型
blkdyn.SetModel("linear");

// 设置材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼
blkdyn.SetMat(2000, 3e8, 0.3, 5e3, 3e3, 15, 10);

// 设置边界条件，固定x方向的左右两侧和y方向的底部
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 9.999, 10.01);
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// 设置监测点
dyna.Monitor("block","xdis", 8, 5, 0);
dyna.Monitor("block","xdis", 6.7683, 3.6442, 0);
dyna.Monitor("block","xdis", 6.2744, 2.4918, 0);

// 进行初始求解
dyna.Solve();

// 更改模型为软化模型并重新求解
blkdyn.SetModel("SoftenMC");
dyna.Solve();

// 清零控制范围内的位移
var values = new Array(0.0, 0.0, 0);
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
blkdyn.InitConditionByCoord("displace", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 循环设置模型为无模型并求解
for (var i = 2; i <= 5; i++) {
    blkdyn.SetModel("none", i);
    dyna.Solve();
}
```

## Ground Truth
```javascript
//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置系统收敛的不平衡率为1e-5
dyna.Set("UnBalance_Ratio 1e-5");

//设置3个方向的重力加速度值
dyna.Set("Gravity 0 -9.8 0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//设置监测结果的输出时步为100步
dyna.Set("Moniter_Iter 100");

//打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

//设置虚拟时步为0.6（一般建议为0.3-0.6）
dyna.Set("Virtural_Step 0.6");

//导入当前目录下的GiD类型网格，网格名称为"Slope3D.msh"
blkdyn.ImportGrid("GiD", "Slope3D.msh");

//将所有单元的组号设定为组号1
blkdyn.SetGroupByCoord(1, -1e10, 1e10, -1e10, 1e10, -1e10, 1e10);

//设置所有单元为线弹性模型
blkdyn.SetModel("linear");

//设置组1的材料参数，分别为密度，弹性模量，泊松比，粘聚力、抗拉强度、内摩擦角、剪胀角、组号
blkdyn.SetMatByGroup(2000, 3e8, 0.33, 1e3, 3e2, 20.0, 10.0, 1);

//X方向左侧法向约束
blkdyn.FixVByCoord("x", 0.0, -1e10, -9.99, -1e10, 1e10, -1e10, 1e10);

//X方向右侧法向约束
blkdyn.FixVByCoord("x", 0.0, 29.99, 31, -1e10, 1e10, -1e10, 1e10);

//Y方向底部法向约束
blkdyn.FixVByCoord("y", 0.0, -1e10, 1e10, -1e10, 0.001, -1e10, 1e10);

//Z方向后侧法向约束
blkdyn.FixVByCoord("z", 0.0, -1e10, 1e10, -1e10, 1e10, -1e10, 0.001);

//Z方向前侧法向约束
blkdyn.FixVByCoord("z", 0.0, -1e10, 1e10, -1e10, 1e10, 9.99, 10.01);

//设置全部节点的局部阻尼为0.8
blkdyn.SetLocalDamp(0.8);

//监测典型测点的x方向的位移
dyna.Monitor("block", "xdis", 0, 10, 0);
dyna.Monitor("block", "xdis", 12.5, 15, 0);
dyna.Monitor("block", "xdis", 15, 20, 0);

//弹性计算
dyna.Solve();

//保存结果文件
dyna.Save("elastic.sav");


//将所有单元的计算模型设定为Mohr-Coulomb理想弹塑性模型
blkdyn.SetModel("MC");

//计算1000个迭代步
dyna.Solve(1000);

//打印求解信息
print("Solution Finished");

```

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-基本案例-Slope3DPlastic-Slope3D.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-基本案例-Slope3DPlastic-Slope3D.js (generated)
@@ -1,77 +1,49 @@
-//设置当前工作路径为JavaScript脚本文件所在路径
 setCurDir(getSrcDir());
 
-//打开力学计算开关
-dyna.Set("Mechanic_Cal 1");
+// 清除内存数据和结果数据
+dyna.Clear();
+doc.clearResult();
 
-//设置系统收敛的不平衡率为1e-5
-dyna.Set("UnBalance_Ratio 1e-5");
-
-//设置3个方向的重力加速度值
+// 设置重力加速度
 dyna.Set("Gravity 0 -9.8 0");
 
-//打开大变形计算开关
-dyna.Set("Large_Displace 1");
+// 设置输出间隔
+dyna.Set("Output_Interval 100000");
 
-//设置计算结果的输出间隔为500步
-dyna.Set("Output_Interval 500");
+// 导入网格文件并获取网格信息
+var msh1 = imesh.importGid("SlopeExcavate.msh");
+blkdyn.GetMesh(msh1);
 
-//设置监测结果的输出时步为100步
-dyna.Set("Moniter_Iter 100");
-
-//打开虚质量计算开关
-dyna.Set("If_Virtural_Mass 1");
-
-//设置虚拟时步为0.6（一般建议为0.3-0.6）
-dyna.Set("Virtural_Step 0.6");
-
-//导入当前目录下的GiD类型网格，网格名称为"Slope3D.msh"
-blkdyn.ImportGrid("GiD", "Slope3D.msh");
-
-//将所有单元的组号设定为组号1
-blkdyn.SetGroupByCoord(1, -1e10, 1e10, -1e10, 1e10, -1e10, 1e10);
-
-//设置所有单元为线弹性模型
+// 设置模型为线弹性模型
 blkdyn.SetModel("linear");
 
-//设置组1的材料参数，分别为密度，弹性模量，泊松比，粘聚力、抗拉强度、内摩擦角、剪胀角、组号
-blkdyn.SetMatByGroup(2000, 3e8, 0.33, 1e3, 3e2, 20.0, 10.0, 1);
+// 设置材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼
+blkdyn.SetMat(2000, 3e8, 0.3, 5e3, 3e3, 15, 10);
 
-//X方向左侧法向约束
-blkdyn.FixVByCoord("x", 0.0, -1e10, -9.99, -1e10, 1e10, -1e10, 1e10);
+// 设置边界条件，固定x方向的左右两侧和y方向的底部
+blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
+blkdyn.FixV("x", 0.0, "x", 9.999, 10.01);
+blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);
 
-//X方向右侧法向约束
-blkdyn.FixVByCoord("x", 0.0, 29.99, 31, -1e10, 1e10, -1e10, 1e10);
+// 设置监测点
+dyna.Monitor("block","xdis", 8, 5, 0);
+dyna.Monitor("block","xdis", 6.7683, 3.6442, 0);
+dyna.Monitor("block","xdis", 6.2744, 2.4918, 0);
 
-//Y方向底部法向约束
-blkdyn.FixVByCoord("y", 0.0, -1e10, 1e10, -1e10, 0.001, -1e10, 1e10);
-
-//Z方向后侧法向约束
-blkdyn.FixVByCoord("z", 0.0, -1e10, 1e10, -1e10, 1e10, -1e10, 0.001);
-
-//Z方向前侧法向约束
-blkdyn.FixVByCoord("z", 0.0, -1e10, 1e10, -1e10, 1e10, 9.99, 10.01);
-
-//设置全部节点的局部阻尼为0.8
-blkdyn.SetLocalDamp(0.8);
-
-//监测典型测点的x方向的位移
-dyna.Monitor("block", "xdis", 0, 10, 0);
-dyna.Monitor("block", "xdis", 12.5, 15, 0);
-dyna.Monitor("block", "xdis", 15, 20, 0);
-
-//弹性计算
+// 进行初始求解
 dyna.Solve();
 
-//保存结果文件
-dyna.Save("elastic.sav");
+// 更改模型为软化模型并重新求解
+blkdyn.SetModel("SoftenMC");
+dyna.Solve();
 
+// 清零控制范围内的位移
+var values = new Array(0.0, 0.0, 0);
+var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
+blkdyn.InitConditionByCoord("displace", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
 
-//将所有单元的计算模型设定为Mohr-Coulomb理想弹塑性模型
-blkdyn.SetModel("MC");
-
-//计算1000个迭代步
-dyna.Solve(1000);
-
-//打印求解信息
-print("Solution Finished");
+// 循环设置模型为无模型并求解
+for (var i = 2; i <= 5; i++) {
+    blkdyn.SetModel("none", i);
+    dyna.Solve();
+}
```
