# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-CustomModel-用户自定义求解-Command1.js

## Query
请编写一个CDyna仿真脚本，实现CustomModel-用户自定义求解-Command1，并输出必要的结果与监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// 初始化仿真环境参数
dyna.Set("Output_Interval 500");
dyna.Set("Time_Step 1e-6");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");

// 创建几何模型：立方体颗粒组
pdyna.RegularCreateByCoord(2, 1, 0.5, -10, 10, -10, 10, 0);

// 设置颗粒模型为自定义本构
pdyna.SetModel("Custom");

// 设置材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼
pdyna.SetMat(2500, 3e10, 0.25, 1e6, 1e6, 45, 0.8, 0.1);

// 固定模型底部速度约束
pdyna.FixV("xyz", 0.0, "y", -11, -9);

// 加载动态链接库
dyna.LoadUDF("CustomModel.dll");

// 设置自定义命令流参数：Command1为自定义求解命令标识
dyna.SetUDFValue([1e6, 1.33]); // 初始压力、绝热指数等参数

// 运行用户自定义命令流，调用CustomModel中的UserDefFunction_Execute函数
dyna.RunUDFCmd("Command1");

// 配置监测参数：位移、应力、应变
dyna.Set("Monitor_Displacement 1");
dyna.Set("Monitor_Stress 1");
dyna.Set("Monitor_Strain 1");

// 执行求解
dyna.Solve();

// 获取计算结果数据
var resultData = dyna.GetValue("Result_Data");
var convergenceStatus = dyna.GetValue("Convergence_Status");

// 处理并输出监测结果
if (convergenceStatus === "Converged") {
    print("仿真收敛成功，结果已保存至输出目录");
} else {
    print("警告：仿真未完全收敛，请检查自定义本构参数");
}

print("Command1执行完成，返回数据：" + resultData);

// 释放动态链接库资源
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
@@ -1,54 +1,53 @@
-//设置当前目录为JS脚本文件所在目录
 setCurDir(getSrcDir());
 
-//设置3个方向的重力加速度
-dyna.Set("Gravity 0.0 -9.8 0.0");
+// 初始化仿真环境参数
+dyna.Set("Output_Interval 500");
+dyna.Set("Time_Step 1e-6");
+dyna.Set("Gravity 0 -9.8 0");
+dyna.Set("Large_Displace 1");
+dyna.Set("If_Virtural_Mass 0");
 
-//创建三维方块网格
-blkdyn.GenBrick3D(10,10,10,20,20,20,1);
+// 创建几何模型：立方体颗粒组
+pdyna.RegularCreateByCoord(2, 1, 0.5, -10, 10, -10, 10, 0);
 
-//设置单元的模型为线弹性模型
-blkdyn.SetModel("linear");
+// 设置颗粒模型为自定义本构
+pdyna.SetModel("Custom");
 
-//设置材料参数
-blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 40, 15);
+// 设置材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼
+pdyna.SetMat(2500, 3e10, 0.25, 1e6, 1e6, 45, 0.8, 0.1);
 
-//固定底部3个方向的速度为0
-blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);
+// 固定模型底部速度约束
+pdyna.FixV("xyz", 0.0, "y", -11, -9);
 
-//设置Y方向的3个监测点
-dyna.Monitor("block","ydis", 5.0, 10.0, 5.0);
-dyna.Monitor("block","ydis", 5.0, 6.0, 5.0);
-dyna.Monitor("block","ydis", 5.0, 2.0, 5.0);
+// 加载动态链接库
+dyna.LoadUDF("CustomModel.dll");
 
+// 设置自定义命令流参数：Command1为自定义求解命令标识
+dyna.SetUDFValue([1e6, 1.33]); // 初始压力、绝热指数等参数
 
-//计算前初始haul
-dyna.BeforeCal();
+// 运行用户自定义命令流，调用CustomModel中的UserDefFunction_Execute函数
+dyna.RunUDFCmd("Command1");
 
-//循环1万步
-for(var i = 0; i < 10000; i++)
-{
+// 配置监测参数：位移、应力、应变
+dyna.Set("Monitor_Displacement 1");
+dyna.Set("Monitor_Stress 1");
+dyna.Set("Monitor_Strain 1");
 
-//集成核心计算
-//var unbal = blkdyn.Solver();
+// 执行求解
+dyna.Solve();
 
-//计算单元变形力
-blkdyn.CalBlockForce();
+// 获取计算结果数据
+var resultData = dyna.GetValue("Result_Data");
+var convergenceStatus = dyna.GetValue("Convergence_Status");
 
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
+// 处理并输出监测结果
+if (convergenceStatus === "Converged") {
+    print("仿真收敛成功，结果已保存至输出目录");
+} else {
+    print("警告：仿真未完全收敛，请检查自定义本构参数");
 }
 
-}
+print("Command1执行完成，返回数据：" + resultData);
+
+// 释放动态链接库资源
+dyna.FreeUDF();
```
