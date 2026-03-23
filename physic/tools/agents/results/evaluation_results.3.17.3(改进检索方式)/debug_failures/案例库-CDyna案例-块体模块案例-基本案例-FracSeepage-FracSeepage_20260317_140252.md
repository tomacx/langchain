# Failure Analysis: 案例库-CDyna案例-块体模块案例-基本案例-FracSeepage-FracSeepage.js

## Query
请编写一个CDyna仿真脚本，实现基本案例-FracSeepage-FracSeepage，并输出必要的结果与监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// 清空环境
dyna.Clear();
igeo.clear();
imeshing.clear();
doc.clearResult();

// 关闭力学计算开关（仅进行渗流计算）
dyna.Set("Mechanic_Cal 0");

// 包含裂隙渗流计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

// 打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

// 设置流体模式（2=液体渗流）
dyna.Set("Seepage_Mode 2");

// 设置重力加速度
dyna.Set("Gravity 0.0 0.0 0.0");

// 设置结果输出时步间隔
dyna.Set("Output_Interval 100");

// 设置监测数据输出时步间隔
dyna.Set("Moniter_Iter 100");

// 创建二维矩形几何体
var sid = igeo.genRectS(0, 0, 0, 10, 10, 0, 0.5, 1);

// 生成网格
imeshing.genMeshByGmsh(2);

// 获取块体动力学网格
blkdyn.GetMesh(imeshing);

// 创建裂隙面
fracsp.CreateGridFromBlock(2);

// 更新裂隙面网格
blkdyn.UpdateIFaceMesh();

// 设置裂隙渗流参数：密度、体积模量、渗透系数、初始开度、组号下限、组号上限
fracsp.SetPropByGroup(1000.0, 1e6, 1e-6, 1e-3, 1, 11);

// 初始化压力场（均匀压力1e5 Pa）
var fArrayGrad = [0.0, 0.0, 0.0];
fracsp.InitConditionByCoord("pp", 1e5, fArrayGrad, -100, 100, -100, 100, -100, 100);

// 定义泵注孔时间序列（时间，压力值）
var aValue = new Array();
aValue[0] = [0, 1e5];
aValue[1] = [10, 2e5];
avalue[2] = [20, 3e5];
aValue[3] = [30, 4e5];
aValue[4] = [40, 3e5];
aValue[5] = [50, 2e5];

// 将泵注孔ID为1的属性关联到圆柱体范围内的裂隙节点
// 圆柱体中心线从(5,0,0)到(5,10,0)，内半径0.1m，外半径0.2m
fracsp.BindJetBoreHolePropByCylinder(1, 5, 0, 0, 5, 10, 0, 0.1, 0.2);

// 施加动态压力边界条件
fracsp.ApplyDynaConditionByCoord("pp", aValue, fArrayGrad, 4.99, 5.01, 4.99, 5.01, -1, 1);

// 对典型位置的压力进行监测
dyna.Monitor("fracsp", "sc_pp", 5, 5, 0);
dyna.Monitor("fracsp", "sc_magvel", 5, 5, 0);
dyna.Monitor("fracsp", "sc_discharge", 5, 5, 0);

// 自动计算时步
dyna.TimeStepCorrect();

// 设定总计算时长为50秒
dyna.Set("Time_Step 1");

// 开始求解
dyna.Solve(50);

// 打印完成提示
print("Solution Finished");

// 输出监测数据到Result文件夹
dyna.OutputMonitorData();

// 输出模型结果到Result文件夹
dyna.OutputModelResult();
```

## Ground Truth
```javascript
//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

//包含裂隙计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

//打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

//设置3个方向的重力加速度
dyna.Set("Gravity 0.0 -10.0 0.0");

//设置结果输出时步
dyna.Set("Output_Interval 500");

//导入GiD格式的裂隙渗流网格
fracsp.ImportGrid("gid", "fracurenet.msh");

//设置裂隙渗流参数，依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
fracsp.SetPropByGroup(1000.0,1e7,1e-12,1e-6,1,11);

//定义三个方向梯度值
var fArrayGrad = [0.0, 0.0, 0.0];

//模型底部施加1MPa的水压力
fracsp.ApplyConditionByCoord("pp", 1e6, fArrayGrad, -1e5, 1e5, -0.001, 0.001, -1e5, 1e5);

//自动计算时步
dyna.TimeStepCorrect();

//求解10万步
dyna.Solve(10000);

//打印提示信息
print("Solution Finished");

```

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-基本案例-FracSeepage-FracSeepage.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-基本案例-FracSeepage-FracSeepage.js (generated)
@@ -1,38 +1,89 @@
-//设置当前工作路径为JavaScript脚本文件所在路径
 setCurDir(getSrcDir());
 
-//关闭力学计算开关
+// 清空环境
+dyna.Clear();
+igeo.clear();
+imeshing.clear();
+doc.clearResult();
+
+// 关闭力学计算开关（仅进行渗流计算）
 dyna.Set("Mechanic_Cal 0");
 
-//包含裂隙计算模块，开辟相应内存
+// 包含裂隙渗流计算模块，开辟相应内存
 dyna.Set("Config_FracSeepage 1");
 
-//打开裂隙渗流计算开关
+// 打开裂隙渗流计算开关
 dyna.Set("FracSeepage_Cal 1");
 
-//设置3个方向的重力加速度
-dyna.Set("Gravity 0.0 -10.0 0.0");
+// 设置流体模式（2=液体渗流）
+dyna.Set("Seepage_Mode 2");
 
-//设置结果输出时步
-dyna.Set("Output_Interval 500");
+// 设置重力加速度
+dyna.Set("Gravity 0.0 0.0 0.0");
 
-//导入GiD格式的裂隙渗流网格
-fracsp.ImportGrid("gid", "fracurenet.msh");
+// 设置结果输出时步间隔
+dyna.Set("Output_Interval 100");
 
-//设置裂隙渗流参数，依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
-fracsp.SetPropByGroup(1000.0,1e7,1e-12,1e-6,1,11);
+// 设置监测数据输出时步间隔
+dyna.Set("Moniter_Iter 100");
 
-//定义三个方向梯度值
+// 创建二维矩形几何体
+var sid = igeo.genRectS(0, 0, 0, 10, 10, 0, 0.5, 1);
+
+// 生成网格
+imeshing.genMeshByGmsh(2);
+
+// 获取块体动力学网格
+blkdyn.GetMesh(imeshing);
+
+// 创建裂隙面
+fracsp.CreateGridFromBlock(2);
+
+// 更新裂隙面网格
+blkdyn.UpdateIFaceMesh();
+
+// 设置裂隙渗流参数：密度、体积模量、渗透系数、初始开度、组号下限、组号上限
+fracsp.SetPropByGroup(1000.0, 1e6, 1e-6, 1e-3, 1, 11);
+
+// 初始化压力场（均匀压力1e5 Pa）
 var fArrayGrad = [0.0, 0.0, 0.0];
+fracsp.InitConditionByCoord("pp", 1e5, fArrayGrad, -100, 100, -100, 100, -100, 100);
 
-//模型底部施加1MPa的水压力
-fracsp.ApplyConditionByCoord("pp", 1e6, fArrayGrad, -1e5, 1e5, -0.001, 0.001, -1e5, 1e5);
+// 定义泵注孔时间序列（时间，压力值）
+var aValue = new Array();
+aValue[0] = [0, 1e5];
+aValue[1] = [10, 2e5];
+avalue[2] = [20, 3e5];
+aValue[3] = [30, 4e5];
+aValue[4] = [40, 3e5];
+aValue[5] = [50, 2e5];
 
-//自动计算时步
+// 将泵注孔ID为1的属性关联到圆柱体范围内的裂隙节点
+// 圆柱体中心线从(5,0,0)到(5,10,0)，内半径0.1m，外半径0.2m
+fracsp.BindJetBoreHolePropByCylinder(1, 5, 0, 0, 5, 10, 0, 0.1, 0.2);
+
+// 施加动态压力边界条件
+fracsp.ApplyDynaConditionByCoord("pp", aValue, fArrayGrad, 4.99, 5.01, 4.99, 5.01, -1, 1);
+
+// 对典型位置的压力进行监测
+dyna.Monitor("fracsp", "sc_pp", 5, 5, 0);
+dyna.Monitor("fracsp", "sc_magvel", 5, 5, 0);
+dyna.Monitor("fracsp", "sc_discharge", 5, 5, 0);
+
+// 自动计算时步
 dyna.TimeStepCorrect();
 
-//求解10万步
-dyna.Solve(10000);
+// 设定总计算时长为50秒
+dyna.Set("Time_Step 1");
 
-//打印提示信息
+// 开始求解
+dyna.Solve(50);
+
+// 打印完成提示
 print("Solution Finished");
+
+// 输出监测数据到Result文件夹
+dyna.OutputMonitorData();
+
+// 输出模型结果到Result文件夹
+dyna.OutputModelResult();
```
