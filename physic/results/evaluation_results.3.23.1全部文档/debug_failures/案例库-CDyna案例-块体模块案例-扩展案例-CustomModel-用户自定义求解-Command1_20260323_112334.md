# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-CustomModel-用户自定义求解-Command1.js

## Query
请编写一个CDyna仿真脚本，实现CustomModel-用户自定义求解-Command1，并输出必要的结果与监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// 设置结果输出时步为500步
dyna.Set("Output_Interval 500");

// 创建规则排布的颗粒
pdyna.RegularCreateByCoord(2, 1, 0.5, -10, 10, -10, 10, 0, 0);

// 设置颗粒模型为线弹性模型
pdyna.SetModel("linear");

// 设置材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 3e10, 0.25, 0, 0, 45, 0.8, 0.0);

// 固定模型底部速度
pdyna.FixV("xyz", 0.0, "y", -11, -9);

// 加载动态链接库
dyna.LoadUDF("CustomModel");

// 运行动态链接库中的函数，自定义命令流
dyna.RunUDFCmd("CalDist 0 0 0 10 10 0");

// 打开允许用户在核心迭代中加入自定义函数功能
dyna.Set("If_Allow_UDF_Kernel 1");

// 求解
dyna.Solve();

// 释放动态链接库
dyna.FreeUDF();
```

## Ground Truth
```javascript
//设置当前目录为JS脚本文件所在目录
setCurDir(getSrcDir());

//设置3个方向的重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

//创建三维方块网格
blkdyn.GenBrick3D(10,10,10,20,20,20,1);

//设置单元的模型为线弹性模型
blkdyn.SetModel("linear");

//设置材料参数
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 40, 15);

//固定底部3个方向的速度为0
blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);

//设置Y方向的3个监测点
dyna.Monitor("block","ydis", 5.0, 10.0, 5.0);
dyna.Monitor("block","ydis", 5.0, 6.0, 5.0);
dyna.Monitor("block","ydis", 5.0, 2.0, 5.0);


//计算前初始haul
dyna.BeforeCal();

//循环1万步
for(var i = 0; i < 10000; i++)
{

//集成核心计算
//var unbal = blkdyn.Solver();

//计算单元变形力
blkdyn.CalBlockForce();

//计算节点运动
var unbal = blkdyn.CalNodeMovement();

//输出监测信息
dyna.OutputMonitorData();

//每隔100步推送信息
if(i != 0 && i % 100 == 0)
{
      //推送文本信息
	print("不平衡率：" + unbal);

      //推送结果信息至平台
	dyna.PutStep(1,i,0.1);
}

}

```

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-扩展案例-CustomModel-用户自定义求解-Command1.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-扩展案例-CustomModel-用户自定义求解-Command1.js (generated)
@@ -1,54 +1,31 @@
-//设置当前目录为JS脚本文件所在目录
 setCurDir(getSrcDir());
 
-//设置3个方向的重力加速度
-dyna.Set("Gravity 0.0 -9.8 0.0");
+// 设置结果输出时步为500步
+dyna.Set("Output_Interval 500");
 
-//创建三维方块网格
-blkdyn.GenBrick3D(10,10,10,20,20,20,1);
+// 创建规则排布的颗粒
+pdyna.RegularCreateByCoord(2, 1, 0.5, -10, 10, -10, 10, 0, 0);
 
-//设置单元的模型为线弹性模型
-blkdyn.SetModel("linear");
+// 设置颗粒模型为线弹性模型
+pdyna.SetModel("linear");
 
-//设置材料参数
-blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 40, 15);
+// 设置材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
+pdyna.SetMat(2500, 3e10, 0.25, 0, 0, 45, 0.8, 0.0);
 
-//固定底部3个方向的速度为0
-blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);
+// 固定模型底部速度
+pdyna.FixV("xyz", 0.0, "y", -11, -9);
 
-//设置Y方向的3个监测点
-dyna.Monitor("block","ydis", 5.0, 10.0, 5.0);
-dyna.Monitor("block","ydis", 5.0, 6.0, 5.0);
-dyna.Monitor("block","ydis", 5.0, 2.0, 5.0);
+// 加载动态链接库
+dyna.LoadUDF("CustomModel");
 
+// 运行动态链接库中的函数，自定义命令流
+dyna.RunUDFCmd("CalDist 0 0 0 10 10 0");
 
-//计算前初始haul
-dyna.BeforeCal();
+// 打开允许用户在核心迭代中加入自定义函数功能
+dyna.Set("If_Allow_UDF_Kernel 1");
 
-//循环1万步
-for(var i = 0; i < 10000; i++)
-{
+// 求解
+dyna.Solve();
 
-//集成核心计算
-//var unbal = blkdyn.Solver();
-
-//计算单元变形力
-blkdyn.CalBlockForce();
-
-//计算节点运动
-var unbal = blkdyn.CalNodeMovement();
-
-//输出监测信息
-dyna.OutputMonitorData();
-
-//每隔100步推送信息
-if(i != 0 && i % 100 == 0)
-{
-      //推送文本信息
-	print("不平衡率：" + unbal);
-
-      //推送结果信息至平台
-	dyna.PutStep(1,i,0.1);
-}
-
-}
+// 释放动态链接库
+dyna.FreeUDF();
```
