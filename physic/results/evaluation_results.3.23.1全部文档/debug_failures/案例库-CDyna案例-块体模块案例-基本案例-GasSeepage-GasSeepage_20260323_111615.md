# Failure Analysis: 案例库-CDyna案例-块体模块案例-基本案例-GasSeepage-GasSeepage.js

## Query
请编写一个CDyna仿真脚本，实现基本案例-GasSeepage-GasSeepage，并输出必要的结果与监测。

## Generated Code
```javascript
// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 关闭力学计算开关
dyna.Set("Mechanic_Cal", 0);

// 包含裂隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_FractureSeepage", 1);

// 开启裂隙渗流开关
dyna.Set("FractureSeepage_Cal", 1);

// 设置三个方向的重力加速度
dyna.Set("Gravity", [0.0, -9.81, 0.0]);

// 将结果输出时步设定为500步
dyna.Set("Output_Interval", 500);

// 监测结果输出时步间隔设定为100步
dyna.Set("Moniter_Iter", 100);

// 导入Gid格式的网格文件
fracseep.ImportGrid("Gid", "fracture-seepage.msh");

// 定义X、Y、Z三个方向的渗透系数
var arrayK = [1e-8, 1e-8, 1e-8];

// 指定坐标控制范围内的裂隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数
fracseep.SetPropByCoord(1000.0, 1e6, 0.3, arrayK, -500, 500, -500, 500, -500, 500);

// 定义梯度
var fArrayGrad = [0.0, -9810.0, 0.0];

// 设定模型四周的水压力边界条件
fracseep.ApplyConditionByCoord("pp", 1e4, fArrayGrad, -500, 500, -500, -499.99, -500, 500);
fracseep.ApplyConditionByCoord("pp", 0, [0.0, 0.0, 0.0], -500, 500, 500, 501, -500, 500);

// 对典型位置的裂隙压力进行监测
dyna.Monitor("fracseep", "fpp", 0, 0, 0);
dyna.Monitor("fracseep", "fpp", 2, 2, 2);
dyna.Monitor("fracseep", "fpp", 4, 4, 4);

// 设定计算时步为1s
dyna.Set("Time_Step", 1.0);

// 求解5万步
dyna.Solve(50000);

// 打印提示信息
print("Solution Finished");
```

## Ground Truth
```javascript
//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

//包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage 1");

//开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal 1");

dyna.Set("Seepage_Mode 2");

//孔隙气体渗流时，打开吸附解吸附渗流开关
dyna.Set("If_Langmuir_Cal 1");

//设置三个方向的重力加速度，均为0.0
dyna.Set("Gravity 0.0 0.0 0.0");

//将结果输出时步设定为500步
dyna.Set("Output_Interval 500");

//监测结果输出时步间隔设定为100步
dyna.Set("Moniter_Iter 100");

//创建二维矩形网格
blkdyn.GenBrick2D(10.0,10.0,50,50,1);

//定义X、Y、Z三个方向的渗透系数
var arrayK = new Array(1e-10, 1e-10, 1e-10);

//指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
//气体渗流时，仅密度、孔隙率、渗透系数起作用
poresp.SetPropByCoord (0.176, 1e9, 1.0, 0.01, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

//设置Langmuir吸附解吸附参数，依次为最大吸附量、吸附常数、固体密度、瓦斯滑脱效应克林博格系数
poresp.SetLangmuirPropByGroup(37.255e-3, 0.432e-6, 1500, 0.0, 1, 2);

//定义梯度
var fArrayGrad = new Array(0.0, 0.0, 0.0);

//初始化孔隙气体压力，为10MPa
poresp.InitConditionByCoord("pp", 1e7, fArrayGrad, -100, 100, -100, 100, -100, 100, false);

blkdyn.SetModelByCoord("none",4, 6, 4, 6, -1, 1);

//设定模型四周的水压力边界条件
//poresp.ApplyConditionByCoord("pp", 0, fArrayGrad, 3.999, 6.001, 3.999, 6.001, -500, 500, false);

//对典型位置的孔隙压力进行监测
dyna.Monitor("block", "fpp", 7, 5, 0);
dyna.Monitor("block", "fpp", 8, 5, 0);
dyna.Monitor("block", "fpp", 9, 5, 0);

//设定计算时步为100s
dyna.Set("Time_Step 100");

//迭代2万步
dyna.Solve(10000);

//打印提示信息
print("Solution Finished");
```

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-基本案例-GasSeepage-GasSeepage.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-基本案例-GasSeepage-GasSeepage.js (generated)
@@ -1,63 +1,50 @@
-//设置当前工作路径为JavaScript脚本文件所在路径
+// 设置当前工作路径为JavaScript脚本文件所在路径
 setCurDir(getSrcDir());
 
-//关闭力学计算开关
-dyna.Set("Mechanic_Cal 0");
+// 关闭力学计算开关
+dyna.Set("Mechanic_Cal", 0);
 
-//包含孔隙渗流计算功能，开辟渗流相关的内存
-dyna.Set("Config_PoreSeepage 1");
+// 包含裂隙渗流计算功能，开辟渗流相关的内存
+dyna.Set("Config_FractureSeepage", 1);
 
-//开启孔隙渗流开关
-dyna.Set("PoreSeepage_Cal 1");
+// 开启裂隙渗流开关
+dyna.Set("FractureSeepage_Cal", 1);
 
-dyna.Set("Seepage_Mode 2");
+// 设置三个方向的重力加速度
+dyna.Set("Gravity", [0.0, -9.81, 0.0]);
 
-//孔隙气体渗流时，打开吸附解吸附渗流开关
-dyna.Set("If_Langmuir_Cal 1");
+// 将结果输出时步设定为500步
+dyna.Set("Output_Interval", 500);
 
-//设置三个方向的重力加速度，均为0.0
-dyna.Set("Gravity 0.0 0.0 0.0");
+// 监测结果输出时步间隔设定为100步
+dyna.Set("Moniter_Iter", 100);
 
-//将结果输出时步设定为500步
-dyna.Set("Output_Interval 500");
+// 导入Gid格式的网格文件
+fracseep.ImportGrid("Gid", "fracture-seepage.msh");
 
-//监测结果输出时步间隔设定为100步
-dyna.Set("Moniter_Iter 100");
+// 定义X、Y、Z三个方向的渗透系数
+var arrayK = [1e-8, 1e-8, 1e-8];
 
-//创建二维矩形网格
-blkdyn.GenBrick2D(10.0,10.0,50,50,1);
+// 指定坐标控制范围内的裂隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数
+fracseep.SetPropByCoord(1000.0, 1e6, 0.3, arrayK, -500, 500, -500, 500, -500, 500);
 
-//定义X、Y、Z三个方向的渗透系数
-var arrayK = new Array(1e-10, 1e-10, 1e-10);
+// 定义梯度
+var fArrayGrad = [0.0, -9810.0, 0.0];
 
-//指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
-//气体渗流时，仅密度、孔隙率、渗透系数起作用
-poresp.SetPropByCoord (0.176, 1e9, 1.0, 0.01, arrayK, 1.0, -500, 500, -500, 500, -500, 500);
+// 设定模型四周的水压力边界条件
+fracseep.ApplyConditionByCoord("pp", 1e4, fArrayGrad, -500, 500, -500, -499.99, -500, 500);
+fracseep.ApplyConditionByCoord("pp", 0, [0.0, 0.0, 0.0], -500, 500, 500, 501, -500, 500);
 
-//设置Langmuir吸附解吸附参数，依次为最大吸附量、吸附常数、固体密度、瓦斯滑脱效应克林博格系数
-poresp.SetLangmuirPropByGroup(37.255e-3, 0.432e-6, 1500, 0.0, 1, 2);
+// 对典型位置的裂隙压力进行监测
+dyna.Monitor("fracseep", "fpp", 0, 0, 0);
+dyna.Monitor("fracseep", "fpp", 2, 2, 2);
+dyna.Monitor("fracseep", "fpp", 4, 4, 4);
 
-//定义梯度
-var fArrayGrad = new Array(0.0, 0.0, 0.0);
+// 设定计算时步为1s
+dyna.Set("Time_Step", 1.0);
 
-//初始化孔隙气体压力，为10MPa
-poresp.InitConditionByCoord("pp", 1e7, fArrayGrad, -100, 100, -100, 100, -100, 100, false);
+// 求解5万步
+dyna.Solve(50000);
 
-blkdyn.SetModelByCoord("none",4, 6, 4, 6, -1, 1);
-
-//设定模型四周的水压力边界条件
-//poresp.ApplyConditionByCoord("pp", 0, fArrayGrad, 3.999, 6.001, 3.999, 6.001, -500, 500, false);
-
-//对典型位置的孔隙压力进行监测
-dyna.Monitor("block", "fpp", 7, 5, 0);
-dyna.Monitor("block", "fpp", 8, 5, 0);
-dyna.Monitor("block", "fpp", 9, 5, 0);
-
-//设定计算时步为100s
-dyna.Set("Time_Step 100");
-
-//迭代2万步
-dyna.Solve(10000);
-
-//打印提示信息
+// 打印提示信息
 print("Solution Finished");
```
