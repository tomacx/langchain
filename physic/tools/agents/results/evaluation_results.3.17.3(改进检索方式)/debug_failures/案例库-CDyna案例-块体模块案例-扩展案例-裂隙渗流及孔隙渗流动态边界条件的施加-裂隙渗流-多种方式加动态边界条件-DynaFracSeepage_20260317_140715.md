# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-裂隙渗流及孔隙渗流动态边界条件的施加-裂隙渗流-多种方式加动态边界条件-DynaFracSeepage.js

## Query
请编写一个CDyna仿真脚本，实现裂隙渗流-多种方式加动态边界条件-DynaFracSeepage，并输出必要的结果与监测。

## Generated Code
```javascript

```

## Ground Truth
```javascript
//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

dyna.Clear();
doc.clearResult();

//关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

//包含裂隙计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

//打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

//设置3个方向的重力加速度
dyna.Set("Gravity 0.0 0.0 0.0");

//设置结果输出时步
dyna.Set("Output_Interval 500");


fracsp.ImportGrid("Gid","FracSeepageModel.msh");

//设置裂隙渗流参数，依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
fracsp.SetPropByGroup(1000.0,1e6,1e-6,1e-3,1,11);


var fArrayGrad = [0.0, 0.0, 0.0];
var aValue = new Array();
aValue[0] = [0,0];
aValue[1] = [50,1e4];
aValue[2] = [100,3e4];
aValue[3] = [150,5e4];
aValue[4] = [200,4e4];
aValue[5] = [300,3e4];

//fracsp.ApplyDynaConditionByCylinder("pp",aValue, fArrayGrad,0,0,-1, 0,0,1, 0.99, 1.01);
//fracsp.ApplyDynaConditionBySphere("pp",aValue, fArrayGrad,0,0,0,0.99, 1.01);
fracsp.ApplyDynaConditionByGroup("pp",aValue, fArrayGrad, 2, 2);


dyna.Monitor("fracsp", "sc_magvel", 5,5,0);
dyna.Monitor("fracsp", "sc_pp", 5,5,0);
dyna.Monitor("fracsp", "sc_discharge", 5,5,0);

//自动计算时步
dyna.TimeStepCorrect();

dyna.Set("Time_Step 0.002");

//求解10万步
dyna.Solve(100000);

//打印提示信息
print("Solution Finished");

```

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-扩展案例-裂隙渗流及孔隙渗流动态边界条件的施加-裂隙渗流-多种方式加动态边界条件-DynaFracSeepage.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-扩展案例-裂隙渗流及孔隙渗流动态边界条件的施加-裂隙渗流-多种方式加动态边界条件-DynaFracSeepage.js (generated)
@@ -1,56 +0,0 @@
-//设置当前工作路径为JavaScript脚本文件所在路径
-setCurDir(getSrcDir());
-
-dyna.Clear();
-doc.clearResult();
-
-//关闭力学计算开关
-dyna.Set("Mechanic_Cal 0");
-
-//包含裂隙计算模块，开辟相应内存
-dyna.Set("Config_FracSeepage 1");
-
-//打开裂隙渗流计算开关
-dyna.Set("FracSeepage_Cal 1");
-
-//设置3个方向的重力加速度
-dyna.Set("Gravity 0.0 0.0 0.0");
-
-//设置结果输出时步
-dyna.Set("Output_Interval 500");
-
-
-fracsp.ImportGrid("Gid","FracSeepageModel.msh");
-
-//设置裂隙渗流参数，依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
-fracsp.SetPropByGroup(1000.0,1e6,1e-6,1e-3,1,11);
-
-
-var fArrayGrad = [0.0, 0.0, 0.0];
-var aValue = new Array();
-aValue[0] = [0,0];
-aValue[1] = [50,1e4];
-aValue[2] = [100,3e4];
-aValue[3] = [150,5e4];
-aValue[4] = [200,4e4];
-aValue[5] = [300,3e4];
-
-//fracsp.ApplyDynaConditionByCylinder("pp",aValue, fArrayGrad,0,0,-1, 0,0,1, 0.99, 1.01);
-//fracsp.ApplyDynaConditionBySphere("pp",aValue, fArrayGrad,0,0,0,0.99, 1.01);
-fracsp.ApplyDynaConditionByGroup("pp",aValue, fArrayGrad, 2, 2);
-
-
-dyna.Monitor("fracsp", "sc_magvel", 5,5,0);
-dyna.Monitor("fracsp", "sc_pp", 5,5,0);
-dyna.Monitor("fracsp", "sc_discharge", 5,5,0);
-
-//自动计算时步
-dyna.TimeStepCorrect();
-
-dyna.Set("Time_Step 0.002");
-
-//求解10万步
-dyna.Solve(100000);
-
-//打印提示信息
-print("Solution Finished");
```
