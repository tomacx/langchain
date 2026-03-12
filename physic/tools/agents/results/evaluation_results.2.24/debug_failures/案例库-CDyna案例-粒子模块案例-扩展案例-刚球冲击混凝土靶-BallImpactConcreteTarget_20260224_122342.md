# Failure Analysis: 案例库-CDyna案例-粒子模块案例-扩展案例-刚球冲击混凝土靶-BallImpactConcreteTarget.js

## Query
我现在要做一个CDyna案例的数值模拟，场景大致是：设置当前路径为JavaScript脚本所在的路径。请根据 CDEM 技术手册，合理选择dyna、pdyna等模块，帮我写一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、边界条件与载荷、求解参数和结果监测。

## Generated Code
```javascript
{"name": "setCurDir", "parameters": {"dir": "getSrcDir()"}} 

{"name": "dyna.Clear", "parameters": {}} 

{"name": "doc.clearResult", "parameters": {}} 

{"name": "dyna.Set", "parameters": {"key": "Output_Interval 500"}} 

{"name": "dyna.Set", "parameters": {"key": "If_Virtural_Mass 0"}} 

{"name": "dyna.Set", "parameters": {"key": "Gravity 0.0 -9.8 0.0"}} 

{"name": "dyna.Set", "parameters": {"key": "Contact_Detect_Tol 5e-3"}} 

{"name": "dyna.Set", "parameters": {"key": "Bounding_Box 1 1.0"}} 

{"name": "rdface.Create", "parameters": {"type": "1", "n": "2", "fCoord": "[[-4.0,-2.0,0.0],[-4.0,-2.0,0.0],[4.0,-2.0,0.0]]"}} 

{"name": "pdyna.Import", "parameters": {"type": "gid","file": "D2mCircel.msh"}} 

{"name": "pdyna.SetModel", "parameters": {"model": "SSMC"}} 

{"name": "pdyna.SetMat", "parameters": {"density": "2500","elasticity": "1e8","poisson": "0.25","tensileStrength": "1e6","cohesion": "5e6","frictionAngle": "30","localDamping": "0.0","viscousDamping": "0.1"}} 

{"name": "dyna.Set", "parameters": {"key": "Time_Step 5e-5"}}
```

## Ground Truth
```javascript
//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//设置输出的间隔为500步
dyna.Set("Output_Interval 500");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

//设置三个方向的全局重力加速度为0
dyna.Set("Gravity 0.0 0.0 0.0");

//打开单元大变形计算开关
dyna.Set("Large_Displace 1");

//打开单元接触更新开关
dyna.Set("If_Renew_Contact 1");

//设置接触容差为1cm
dyna.Set("Contact_Detect_Tol 2e-3");

//设置计算时步为5e-5
dyna.Set("Time_Step 2e-5");

//从GiD导入颗粒
pdyna.Import("gid","Impact3.msh");

//设置颗粒模型为脆性断裂模型
pdyna.SetModel("SSMC");

//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(7800, 2.1e11, 0.33, 500e6, 500e6, 0.0, 0.0, 0.05, 2);

pdyna.SetMat(2500, 3e10, 0.2, 10e6, 10e6, 40, 0.0, 0.05,1);

var fvalue = new Array(0.0, -500.0, 0.0);
pdyna.InitCondByGroup ("velocity", fvalue, 2,2);

pdyna.FixV("xyz", 0.0, "x", -1, 0.05);

pdyna.FixV("xyz", 0.0, "x", 1.95, 3);

pdyna.FixV("xyz", 0.0, "z", -1, 0.05);

pdyna.FixV("xyz", 0.0, "z", 1.95, 3);

dyna.TimeStepCorrect(0.8);

//求解1万步
dyna.Solve(10000);

//打印信息
print("Solution is ok!");


```
