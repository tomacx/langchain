# Failure Analysis: 案例库-CDyna案例-粒子模块案例-扩展案例-MPM-三维溃坝过程模拟-mpm-water3d.js

## Query
我现在要做一个CDyna案例的数值模拟，场景大致是：设置工作路径为脚本文件所在路径。请根据 CDEM 技术手册，合理选择dyna、pdyna、rdface等模块，帮我写一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、边界条件与载荷、求解参数和结果监测。

## Generated Code
```javascript
//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

//清除GDEM-Env中的结果数据
doc.clearResult();

//设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

//设置接触容差
dyna.Set("Contact_Detect_Tol 5e-3");

dyna.Set("Bounding_Box 1 1.0");

//设置底部刚性面
var fCoord = new Array();
fCoord[0]=new Array(-4.0,-2.0,0.0);
fCoord[1]=new Array(4.0,-2.0,0.0);
rdface.Create (1, 1, 2, fCoord);

//导入gid格式的颗粒
pdyna.Import("gid","D2mCircel.msh");

//设置颗粒接触模型为考虑应变软化的Mohr-Coulomb模型
pdyna.SetModel("SSMC");

//设置颗粒的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e8, 0.25, 1e6, 5e6, 30, 0.0, 0.1);

//设置动态计算时步为1e-4秒
dyna.Set("Time_Step 5e-5");

//求解1万步
dyna.Solve(10000);

//设置刚性面转动参数
var fOrigin=[0,0,0]; //坐标原点
var fNormal=[0,0,1.0]; //法向分量
var GlobVel=[0,0,0]; //速度分量值
rdface.ApplyRotateCondition (1, fOrigin, fNormal, 0.4, 0.0, GlobVel, 1, 5);

//求解3万步
dyna.Solve(30000);
```

## Ground Truth
```javascript
//设置工作路径为脚本文件所在路径
SetCurDir(GetSrcDir());

//清除dyna模块数据
dyna.Clear();

//清除平台数据
doc.ClearResult();

//设置输出间隔为1000步
dyna.Set("Output_Interval 1000");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//设置计算时间步为0.2ms
dyna.Set("Time_Step 2.0e-4");

//设置颗粒计算模式为mpm模式
dyna.Set("Particle_Cal_Type 4");

//设置颗粒与刚性面接触模型采用全局参数
dyna.Set("If_Contact_Use_GlobMat 1 2 1e9 1e9  0.0 0.0 0.0");

//创建规则颗粒
pdyna. RegularCreateByCoord (1, 2, 0.1, 0.1,10,0.1,10,0.1,9.9);

//导入刚性面
rdface.Import("ansys","bound.dat");

//设置颗粒与刚性面的接触模型为脆断模型
pdyna.SetModel("brittleMC");

//设置颗粒材料参数，依次为density, young, poisson, tension, cohesion, friction, localdamp, viscdamp
pdyna.SetMat(2200, 5e7,0.25, 0.0, 0.0,0.0001,0.01,0);

//设置mpm背景网格
mpm.SetBackGrid(3,0.5, [-0.5,-0.5,-0.5], [62, 42, 22]);

//设置mpm的本构模型
mpm.SetModelByGroup("DP",1,2);

//计算20秒
dyna.DynaCycle(20);


```
