# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-CustomModel-用户自定义求解-Command2.js

## Query
请编写一个CDyna仿真脚本，实现CustomModel-用户自定义求解-Command2，并输出必要的结果与监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// 加载CustomModel动态链接库
dyna.LoadUDF("CustomModel");

// 开启用户自定义核心函数允许标志
dyna.Set("If_Allow_UDF_Kernel 1");

// 设置输出间隔步长
dyna.Set("Output_Interval 500");

// 设置重力方向 (x, y, z)
dyna.Set("Gravity 0 -9.8 0");

// 创建简单的颗粒模型用于演示
pdyna.RegularCreateByCoord(100, 1, 0.1, -5, 5, -5, 5, 0);

// 设置材料参数 (密度, 弹性模量, 泊松比, 抗拉强度, 粘聚力, 内摩擦角, 局部阻尼, 粘性阻尼)
pdyna.SetMat(2500, 3e10, 0.25, 1e6, 1e6, 30.0, 0.8, 0.1);

// 设置模型为线弹性
pdyna.SetModel("linear");

// 定义Command2用户自定义命令流字符串
var cmdStr = "CalDist";

// 运行自定义命令并获取返回的浮点型计算结果值 (两点距离)
var distResult = dyna.RunUDFCmdAdv(cmdStr, [-5, 0, 0, 5, 0, 0]);

print("Command2执行结果 - 两点距离: " + distResult);

// 设置求解参数
dyna.Set("Time_Step 1e-6");

// 求解 (自动调用UserDefKernalFunction进行实时监测)
dyna.Solve();

// 获取当前时间用于记录
var finalTime = dyna.GetValue("Time_Now");
print("仿真结束时间: " + finalTime);

// 释放动态链接库
dyna.FreeUDF();
```

## Ground Truth
```javascript
setCurDir(getSrcDir());
dyna.Set("Gravity 0.0 -9.8 0.0");
blkdyn.GenBrick3D(10,10,10,20,20,20,1);

dyna.Set("Output_Interval 500");
dyna.Set("Time_Step 1");

blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 40, 15);
blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);
dyna.Monitor("block","ydis", 5.0, 10.0, 5.0);
dyna.Monitor("block","ydis", 5.0, 6.0, 5.0);
dyna.Monitor("block","ydis", 5.0, 2.0, 5.0);


dyna.LoadUDF("CustomModel");

dyna.RunUDFCmd("MySolve 5000");

dyna.RunUDFCmd("CalDist 0 0 0 10 10 0");

dyna.RunUDFCmd("PrintTotalVolume");

dyna.FreeUDF();

```

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-扩展案例-CustomModel-用户自定义求解-Command2.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-扩展案例-CustomModel-用户自定义求解-Command2.js (generated)
@@ -1,24 +1,43 @@
 setCurDir(getSrcDir());
-dyna.Set("Gravity 0.0 -9.8 0.0");
-blkdyn.GenBrick3D(10,10,10,20,20,20,1);
 
-dyna.Set("Output_Interval 500");
-dyna.Set("Time_Step 1");
-
-blkdyn.SetModel("linear");
-blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 40, 15);
-blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);
-dyna.Monitor("block","ydis", 5.0, 10.0, 5.0);
-dyna.Monitor("block","ydis", 5.0, 6.0, 5.0);
-dyna.Monitor("block","ydis", 5.0, 2.0, 5.0);
-
-
+// 加载CustomModel动态链接库
 dyna.LoadUDF("CustomModel");
 
-dyna.RunUDFCmd("MySolve 5000");
+// 开启用户自定义核心函数允许标志
+dyna.Set("If_Allow_UDF_Kernel 1");
 
-dyna.RunUDFCmd("CalDist 0 0 0 10 10 0");
+// 设置输出间隔步长
+dyna.Set("Output_Interval 500");
 
-dyna.RunUDFCmd("PrintTotalVolume");
+// 设置重力方向 (x, y, z)
+dyna.Set("Gravity 0 -9.8 0");
 
+// 创建简单的颗粒模型用于演示
+pdyna.RegularCreateByCoord(100, 1, 0.1, -5, 5, -5, 5, 0);
+
+// 设置材料参数 (密度, 弹性模量, 泊松比, 抗拉强度, 粘聚力, 内摩擦角, 局部阻尼, 粘性阻尼)
+pdyna.SetMat(2500, 3e10, 0.25, 1e6, 1e6, 30.0, 0.8, 0.1);
+
+// 设置模型为线弹性
+pdyna.SetModel("linear");
+
+// 定义Command2用户自定义命令流字符串
+var cmdStr = "CalDist";
+
+// 运行自定义命令并获取返回的浮点型计算结果值 (两点距离)
+var distResult = dyna.RunUDFCmdAdv(cmdStr, [-5, 0, 0, 5, 0, 0]);
+
+print("Command2执行结果 - 两点距离: " + distResult);
+
+// 设置求解参数
+dyna.Set("Time_Step 1e-6");
+
+// 求解 (自动调用UserDefKernalFunction进行实时监测)
+dyna.Solve();
+
+// 获取当前时间用于记录
+var finalTime = dyna.GetValue("Time_Now");
+print("仿真结束时间: " + finalTime);
+
+// 释放动态链接库
 dyna.FreeUDF();
```
