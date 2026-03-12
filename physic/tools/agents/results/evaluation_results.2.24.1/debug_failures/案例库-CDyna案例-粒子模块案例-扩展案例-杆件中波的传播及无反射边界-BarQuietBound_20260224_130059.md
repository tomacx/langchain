# Failure Analysis: 案例库-CDyna案例-粒子模块案例-扩展案例-杆件中波的传播及无反射边界-BarQuietBound.js

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

{"name": "rdface.Create", "parameters": {"type": "1", "id": "1", "num": "2", "coord": "[[-4.0,-2.0,0.0],[-4.0,-2.0,0.0]]"}} 

{"name": "pdyna.Import", "parameters": {"format": "gid", "file": "D2mCircel.msh"}} 

{"name": "pdyna.SetModel", "parameters": {"model": "SSMC"}} 

{"name": "pdyna.SetMat", "parameters": {"density": "2500", "elasticity": "1e8", "poisson": "0.25", "tensileStrength": "1e6", "cohesion": "5e6", "frictionAngle": "30", "localDamping": "0.0", "viscousDamping": "0.1"}} 

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
dyna.Set("Contact_Detect_Tol 1e-2");

//设置计算时步为5e-5
dyna.Set("Time_Step 1e-6");

//从GiD导入颗粒
pdyna.Import("gid","20m1m-bar.msh");

//设置颗粒模型为脆性断裂模型
pdyna.SetModel("linear");

//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 3e10, 0.2, 3e7, 6e7, 36, 0.0, 0.01);

var fvalue = new Array(0.0, -10, 0.0);



//设定三个方向载荷系数
var coeff=new Array(10,0.0,0.0)
//x方向下限及上限
var x= new Array(-0.2,0.2);
//y方向下限及上限
var y= new Array(-10.0,10.0);
//z方向下限及上限
var z= new Array(-10.0,10.0);
//设定动态速度边界
pdyna.ApplyDynaCondSinByCoord ("velocity", coeff, 0.0, 1, 2e-3, 0.0, 0.0, 1e-3, x, y, z);

pdyna.ApplyQuietBoundByCoord(19.8,21,-1000,1000,-1,1);


dyna.Monitor("particle","pa_xvel",0,0.5,0);
dyna.Monitor("particle","pa_xvel",5,0.5,0);
dyna.Monitor("particle","pa_xvel",10,0.5,0);
dyna.Monitor("particle","pa_xvel",15,0.5,0);
dyna.Monitor("particle","pa_xvel",20,0.5,0);

dyna.Monitor("particle","pa_sxx",0,0.5,0);
dyna.Monitor("particle","pa_sxx",5,0.5,0);
dyna.Monitor("particle","pa_sxx",10,0.5,0);
dyna.Monitor("particle","pa_sxx",15,0.5,0);
dyna.Monitor("particle","pa_sxx",20,0.5,0);

//求解2万步
dyna.DynaCycle(0.015);

//打印信息
print("Solution is ok!");


```
