# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-FEP模型-钨球冲击铝板-BallImpact.js

## Query
请生成一个CDyna案例的脚本，功能是块体模块案例-扩展案例-FEP模型-钨球冲击铝板-BallImpact

## Generated Code
```javascript
// 脚本名称：BallImpact.js
// 类别：CDyna案例
// 关键词：球体冲击铝板

// 导入 CDyna 模块
var pdyna = require('cdyna');

// 设置材料参数
pdyna.SetMat(2700, 1e6, 0.3, 2e4, 5e4, 25, 0.0, 0.1);

// 初始化条件
var fvalue = new Array(0.0, -100.0, 0.0);
pdyna.InitCondByGroup ("velocity", fvalue, 2,2);

// 应用静止边界条件
pdyna.ApplyQuietBoundByCoord(-0.2,0.2,-1000,1000,-1,1);
pdyna.ApplyQuietBoundByCoord(9.8,11,-1000,1000,-1,1);
pdyna.ApplyQuietBoundByCoord(-1000,1000,-0.2,0.2,-1,1);

// 求解 20,000 步
dyna.Solve(20000);

// 打印信息
print("Solution is ok!");
```

## Ground Truth
```javascript
setCurDir(getSrcDir());

dyna.Set("Large_Displace 1");

dyna.Set("If_Virtural_Mass 0");

dyna.Set("If_Renew_Contact 1");

dyna.Set("Contact_Detect_Tol 0.0");

dyna.Set("Output_Interval 500");

//设置单元溶蚀，溶蚀提应变为1，溶蚀剪应变为1，开启溶蚀的组号为1
dyna.Set("Elem_Kill_Option 1 0.6 0.6 1 1");

//开启自动创建接触开关
dyna.Set("If_Auto_Create_Contact 1 1");

//导入gid格式的网格文件
blkdyn.ImportGrid("gid","BallImpactTarget.msh");

//设置模型为流体弹塑性模型
blkdyn.SetModel("FEP");

//设置铝基础参数，仅密度、弹模、泊松比起作用。
blkdyn.SetMat(2703, 3e9,0.25, 3e6, 1e6, 35, 15, 1);

//设置钨基础参数，仅密度、弹模、泊松比起作用。
blkdyn.SetMat(15630, 344.7e9,0.28, 3e6, 1e6, 35, 15, 2);



//铝板，JC参数
blkdyn.SetJCMat(1, 324e6, 114e6, 0.42, 0.016, 1.34, 298, 877, 875, 1.0 , true);
blkdyn.BindJCMat(1, 1, 1);

//钨球，JC参数
blkdyn.SetJCMat(2, 1200e6, 1030e6, 0.019, 0.034, 0.4, 298, 1723, 134, 1.0 , true);
blkdyn.BindJCMat(2, 2, 2);

//铝板，MG参数
blkdyn.SetMGMat(1, 2703, 5350, 1.34, 1.97, 1.5);
blkdyn.BindMGMat(1, 1, 1);

//钨球，MG参数
blkdyn.SetMGMat(2, 19220, 4020, 1.24, 1.67, 1.3);
blkdyn.BindMGMat(2, 2, 2);

blkdyn.SetLocalDamp(0.01);

//对铝板施加为位移约束
blkdyn.FixV("xy", 0.0, "y", -0.001, 0.001);
blkdyn.FixV("xy", 0, "y", 0.0999, 0.11);

//////对钨球施加初速度
//定义三个方向基础值
var values = new Array(1000.0,0.0, 0);
//定义变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
//将组号1到3范围内的节点速度初始化为设定值
blkdyn.InitConditionByGroup("velocity", values, gradient, 2, 2);

//自动计算时步
dyna.TimeStepCorrect(0.05);

dyna.DynaCycle(2e-5);
```
