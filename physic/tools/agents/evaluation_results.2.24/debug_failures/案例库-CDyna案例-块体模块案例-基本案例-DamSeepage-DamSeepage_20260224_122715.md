# Failure Analysis: 案例库-CDyna案例-块体模块案例-基本案例-DamSeepage-DamSeepage.js

## Query
我现在要做一个CDyna案例的数值模拟，场景大致是：设置当前工作路径为JavaScript脚本文件所在路径。请根据 CDEM 技术手册，合理选择blkdyn、dyna、poresp等模块，帮我写一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、边界条件与载荷、求解参数和结果监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

dyna.Clear();
doc.clearResult();

dyna.Set("Particle_Renew_Interval", 1);
dyna.Set("Output_Interval", 500);
dyna.Set("If_Virtural_Mass", 0);
dyna.Set("Gravity", [0.0, -9.8, 0.0]);
dyna.Set("Contact_Detect_Tol", 0.0);
dyna.Set("Time_Step", 5e-5);

rdface.Import(2, "ring.msh");

var x = [-0.6, 0.6];
var y = [-0.6, 0.0];
var z = [-1, 1];

blkdyn.CreateBlock([10, 10, 10], [0, 0, 0], [1, 1, 1]);

pdyna.CreateByCoord(5000, 1, 1, 0.01, 0.01, 0.0, x, y, z);
pdyna.CreateByCoord(5000, 2, 1, 0.03, 0.03, 0.005, x, y, z);

pdyna.SetModel("brittleMC");
```

## Ground Truth
```javascript
//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

//包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage 1");
print("ok");
//开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal 1");

//设置三个方向的重力加速度
dyna.Set("Gravity 0.0 -10.0 0.0");

//将结果输出时步设定为500步
dyna.Set("Output_Interval 500");

//监测结果输出时步间隔设定为100步
dyna.Set("Moniter_Iter 100");

print("ok");

//导入patran格式的网格
blkdyn.ImportGrid("patran", "RecDam.out");
print("ok");
//定义X、Y、Z三个方向的渗透系数
var arrayK = new Array(1e-10, 1e-10, 1e-10);

//指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByCoord (1000.0, 1e6, 0.0, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

//定义梯度1
var fArrayGrad1 = new Array(0, -1e4, 0);

//定义梯度2
var fArrayGrad2 = new Array(0.0, 0.0, 0.0);

//设定模型四周的水压力边界条件
poresp.ApplyConditionByCoord("pp", 10e4, fArrayGrad1, 8.99, 9.01, -1, 10, -500, 500, false);
poresp.ApplyConditionByCoord("pp", 2e4, fArrayGrad1, -0.01, 0.01, -1, 2.0, -500, 500, false);
poresp.ApplyConditionByCoord("pp", 0, fArrayGrad2, 8.99, 9.01, 10.01, 200, -500, 500, false);
poresp.ApplyConditionByCoord("pp", 0, fArrayGrad2, -0.01, 0.01, 2.001, 200, -500, 500, false);

//对典型位置的孔隙压力进行监测
dyna.Monitor("block", "fpp", 0, 5, 0);
dyna.Monitor("block", "fpp", 2, 5, 0);
dyna.Monitor("block", "fpp", 4, 5, 0);
dyna.Monitor("block", "fpp", 6, 5, 0);
dyna.Monitor("block", "fpp", 8, 5, 0);
dyna.Monitor("block", "fpp", 10, 5, 0);

//设定计算时步为100s
dyna.Set("Time_Step 100");

//迭代2万步
dyna.Solve(20000);

//打印提示信息
print("Solution Finished");

```
