# Failure Analysis: 案例库-CDyna案例-粒子模块案例-基本案例-ParticlesFallingToRigidFace-ParticlesFallingToRigidFace.js

## Query
我现在要做一个CDyna案例的数值模拟，场景大致是：设置当前路径为JavaScript脚本所在的路径。请根据 CDEM 技术手册，合理选择dyna、pdyna、rdface等模块，帮我写一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、边界条件与载荷、求解参数和结果监测。

## Generated Code
```javascript
var searchResult = search_physics_knowledge({"query": "CDyna案例"});
```

## Ground Truth
```javascript
//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//设置输出的间隔为500步
dyna.Set("Output_Interval 500");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

//设置三个方向的重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

//设置接触容差为0.001m
dyna.Set("Contact_Detect_Tol 0.001");

//设置颗粒超出范围后清除颗粒
dyna.Set("Particle_Out_Kill 1 -3 3 -0.1 3 -3 3 0");

//导入gid格式的刚性面边界
rdface.Import(2,"boundary.msh");

//导入gid格式的颗粒
pdyna.Import("gid","particle.msh");

//根据颗粒的ID号重新设置颗粒的组号
pdyna.SetGroupByID(3,1,1111111);

//设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

//设置颗粒的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e7, 0.25, 0.0, 0.0, 25, 0.0, 0.3);

//设置计算时步
dyna.Set("Time_Step 1e-4");

//迭代1万步
dyna.Solve(10000);
```
