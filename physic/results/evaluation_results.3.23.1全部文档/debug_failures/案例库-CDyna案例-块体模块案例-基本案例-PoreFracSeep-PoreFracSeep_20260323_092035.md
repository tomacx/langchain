# Failure Analysis: 案例库-CDyna案例-块体模块案例-基本案例-PoreFracSeep-PoreFracSeep.js

## Query
请编写一个CDyna仿真脚本，实现基本案例-PoreFracSeep-PoreFracSeep，并输出必要的结果与监测。

## Generated Code
```javascript
// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

// 包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage 1");

// 开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal 1");

// 设置三个方向的重力加速度，均为0.0
dyna.Set("Gravity 0.0 0.0 0.0");

// 将结果输出时步设定为500步
dyna.Set("Output_Interval 500");

// 监测结果输出时步间隔设定为100步
dyna.Set("Moniter_Iter 100");

// 创建二维矩形网格
blkdyn.GenBrick2D(10.0,10.0,50,50,1);

// 定义X、Y、Z三个方向的渗透系数
var arrayK = new Array(1e-10, 1e-10, 1e-10);

// 指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByCoord (0.176, 1e9, 1.0, 0.01, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

// 设置Langmuir吸附解吸附参数，依次为最大吸附量、吸附常数、固体密度、瓦斯滑脱效应克林博格系数
poresp.SetLangmuirPropByGroup(37.255e-3, 0.432e-6, 1500, 0.0, 1, 2);

// 定义梯度
var fArrayGrad = new Array(0.0, 0.0, 0.0);

// 初始化孔隙气体压力，为10MPa
poresp.InitConditionByCoord("pp", 1e7, fArrayGrad, -100, 100, -100, 100, -100, 100, false);

blkdyn.SetModelByCoord("none",4, 6, 4, 6, -1, 1);

// 设定模型四周的水压力边界条件
poresp.ApplyConditionByCoord("pp", 0, fArrayGrad, 3.999, 6.001, 3.999, 6.001, -500, 500, false);

// 对典型位置的孔隙压力进行监测
dyna.Monitor("block", "fpp", 7, 5, 0);
dyna.Monitor("block", "fpp", 8, 5, 0);
dyna.Monitor("block", "fpp", 9, 5, 0);

// 设定计算时步为100s
dyna.Set("Time_Step 100");

// 迭代2万步
dyna.Solve(20000);

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

//包含裂隙计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

//打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

//打开裂隙渗流与孔隙渗流的耦合开关
dyna.Set("FS_PoreS_Interaction 1")

//设置三个方向的重力加速度
dyna.Set("Gravity 0.0 -10.0 0.0");

//将结果输出时步设定为500步
dyna.Set("Output_Interval 500");

//导入gid格式的网格
blkdyn.ImportGrid("gid", "porefracgrid.msh");

//不同组号的交界面进行切割，生产接触面
blkdyn.CrtIFace(-1, -1);

//更新接触面网格
blkdyn.UpdateIFaceMesh();

//定义X、Y、Z三个方向的渗透系数
var arrayK = new Array(8e-8, 8e-8, 8e-8);

//指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByCoord (1000.0, 1e6, 0.0, 0.2, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

//从固体单元接触面创建裂隙单元
fracsp.CreateGridFromBlock (2);

//设置裂隙渗流参数，依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
fracsp.SetPropByGroup(1000.0,1e6,8e-5,1e-2,1,11);

//定义三个方向梯度值
var fArrayGrad = [0.0, 0.0, 0.0];

//右侧裂隙边界的渗流压力施加为50kpa（右侧裂隙只有一个渗流入口）
fracsp.ApplyConditionByCoord("pp", 5e4, fArrayGrad, 9.99, 11.0, -1e5, 1e5, -1e5, 1e5);

//设定计算时步为2ms
dyna.Set("Time_Step 0.0005");

//迭代10万步
dyna.Solve(100000);

//打印提示信息
print("Solution Finished");
```

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-基本案例-PoreFracSeep-PoreFracSeep.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-基本案例-PoreFracSeep-PoreFracSeep.js (generated)
@@ -1,62 +1,57 @@
-//设置当前工作路径为JavaScript脚本文件所在路径
+// 设置当前工作路径为JavaScript脚本文件所在路径
 setCurDir(getSrcDir());
 
-//关闭力学计算开关
+// 关闭力学计算开关
 dyna.Set("Mechanic_Cal 0");
 
-//包含孔隙渗流计算功能，开辟渗流相关的内存
+// 包含孔隙渗流计算功能，开辟渗流相关的内存
 dyna.Set("Config_PoreSeepage 1");
 
-//开启孔隙渗流开关
+// 开启孔隙渗流开关
 dyna.Set("PoreSeepage_Cal 1");
 
-//包含裂隙计算模块，开辟相应内存
-dyna.Set("Config_FracSeepage 1");
+// 设置三个方向的重力加速度，均为0.0
+dyna.Set("Gravity 0.0 0.0 0.0");
 
-//打开裂隙渗流计算开关
-dyna.Set("FracSeepage_Cal 1");
-
-//打开裂隙渗流与孔隙渗流的耦合开关
-dyna.Set("FS_PoreS_Interaction 1")
-
-//设置三个方向的重力加速度
-dyna.Set("Gravity 0.0 -10.0 0.0");
-
-//将结果输出时步设定为500步
+// 将结果输出时步设定为500步
 dyna.Set("Output_Interval 500");
 
-//导入gid格式的网格
-blkdyn.ImportGrid("gid", "porefracgrid.msh");
+// 监测结果输出时步间隔设定为100步
+dyna.Set("Moniter_Iter 100");
 
-//不同组号的交界面进行切割，生产接触面
-blkdyn.CrtIFace(-1, -1);
+// 创建二维矩形网格
+blkdyn.GenBrick2D(10.0,10.0,50,50,1);
 
-//更新接触面网格
-blkdyn.UpdateIFaceMesh();
+// 定义X、Y、Z三个方向的渗透系数
+var arrayK = new Array(1e-10, 1e-10, 1e-10);
 
-//定义X、Y、Z三个方向的渗透系数
-var arrayK = new Array(8e-8, 8e-8, 8e-8);
+// 指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
+poresp.SetPropByCoord (0.176, 1e9, 1.0, 0.01, arrayK, 1.0, -500, 500, -500, 500, -500, 500);
 
-//指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
-poresp.SetPropByCoord (1000.0, 1e6, 0.0, 0.2, arrayK, 1.0, -500, 500, -500, 500, -500, 500);
+// 设置Langmuir吸附解吸附参数，依次为最大吸附量、吸附常数、固体密度、瓦斯滑脱效应克林博格系数
+poresp.SetLangmuirPropByGroup(37.255e-3, 0.432e-6, 1500, 0.0, 1, 2);
 
-//从固体单元接触面创建裂隙单元
-fracsp.CreateGridFromBlock (2);
+// 定义梯度
+var fArrayGrad = new Array(0.0, 0.0, 0.0);
 
-//设置裂隙渗流参数，依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
-fracsp.SetPropByGroup(1000.0,1e6,8e-5,1e-2,1,11);
+// 初始化孔隙气体压力，为10MPa
+poresp.InitConditionByCoord("pp", 1e7, fArrayGrad, -100, 100, -100, 100, -100, 100, false);
 
-//定义三个方向梯度值
-var fArrayGrad = [0.0, 0.0, 0.0];
+blkdyn.SetModelByCoord("none",4, 6, 4, 6, -1, 1);
 
-//右侧裂隙边界的渗流压力施加为50kpa（右侧裂隙只有一个渗流入口）
-fracsp.ApplyConditionByCoord("pp", 5e4, fArrayGrad, 9.99, 11.0, -1e5, 1e5, -1e5, 1e5);
+// 设定模型四周的水压力边界条件
+poresp.ApplyConditionByCoord("pp", 0, fArrayGrad, 3.999, 6.001, 3.999, 6.001, -500, 500, false);
 
-//设定计算时步为2ms
-dyna.Set("Time_Step 0.0005");
+// 对典型位置的孔隙压力进行监测
+dyna.Monitor("block", "fpp", 7, 5, 0);
+dyna.Monitor("block", "fpp", 8, 5, 0);
+dyna.Monitor("block", "fpp", 9, 5, 0);
 
-//迭代10万步
-dyna.Solve(100000);
+// 设定计算时步为100s
+dyna.Set("Time_Step 100");
 
-//打印提示信息
+// 迭代2万步
+dyna.Solve(20000);
+
+// 打印提示信息
 print("Solution Finished");
```
