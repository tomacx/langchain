# Failure Analysis: 案例库-CDyna案例-粒子模块案例-基本案例-PCMMGravField-PCMMGravField.js

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

//清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();
//清除GDEM-Env中的结果数据
doc.clearResult();

//设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//打开虚拟质量开关
dyna.Set("If_Virtural_Mass 1");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//设置虚拟质量为0.3
dyna.Set("Virtural_Step 0.3");

//设置3个方向重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

//设置PCMM颗粒的接触容差
dyna.Set("PCMM_Elem_Tol 0.5");

//设置颗粒的计算模式为2-PCMM颗粒模式
dyna.Set("Particle_Cal_Type 2");

//创建规律排布的颗粒
pdyna.RegularCreateByCoord(1,1,0.1,0,10,0,10,0,0);

//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e10, 0.25, 1e3, 5e3, 30, 0.8, 0.0);

//设置pcmm模型为线弹性模型
pcmm.SetModelByGroup("linear",1,11);

//固定底部pcmm颗粒三个方向的速度
pdyna.FixV("xyz",0.0, "y", -1, 0.1);

//求解至稳定
dyna.Solve();

//设置pcmm模型为应变软化模型
pcmm.SetModelByGroup("SoftenMC",1,11);

//设置局部阻尼为0.01
pdyna.SetSingleMat("LocalDamp",0.01);

//求解1万步
dyna.Solve(10000);
```
