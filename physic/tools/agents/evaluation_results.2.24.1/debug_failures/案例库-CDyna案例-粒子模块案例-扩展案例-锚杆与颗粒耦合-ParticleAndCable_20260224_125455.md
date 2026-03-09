# Failure Analysis: 案例库-CDyna案例-粒子模块案例-扩展案例-锚杆与颗粒耦合-ParticleAndCable.js

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

//设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//打开虚拟质量开关
dyna.Set("If_Virtural_Mass 1");

//设置3个方向的重力加速度均为0
dyna.Set("Gravity 0.0 -9.8 0.0");

//设置接触容差为2e-4
dyna.Set("Contact_Detect_Tol 2e-3");

//dyna.Set("Large_Displace 1");

//打开杆件计算开关
dyna.Set("If_Cal_Bar 1");

dyna.Set("Bar_Out 1");


//导入gid格式的颗粒
pdyna.Import("gid","1m1m.msh");

//设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

//设置可材料，依次为依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 3e8, 0.25, 1e7, 5e7, 30, 0.8, 0.0);


//设置一道斜裂缝，并施加参数
var coord1 = [-0.1,0.5,0];
var coord2 = [1.1,0.5,0];
pdyna.SetICMatByLine(-1,-1,0.0,0.0,0.0, coord1, coord2);

pdyna.FixV("xyz",0.0,"y", 0.98,1.1);



for(var i = 0; i < 5; i++)
{

var coord1 = new Array(0.1 + i * 0.2, 0.3, 0);
var coord2 = new Array(0.1 + i * 0.2, 0.7, 0);
bar.CreateByCoord("cable", coord1, coord2, 20);

}



//定义两种锚索材料
var BarProp1 = [0.02, 7800.0, 1e11, 0.25, 235e6, 235e6, 1e7, 35, 1e11, 0.8, 0.0];

bar.SetPropByID(BarProp1, 1, 5, 1, 200);

dyna.Monitor("particle","pa_ydis",0,0,0);
dyna.Monitor("particle","pa_ydis",0.5,0,0);
dyna.Monitor("particle","pa_ydis",1,0,0);

//计算4千步
dyna.Solve(10000);
```
