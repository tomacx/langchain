# Failure Analysis: 案例库-CDyna案例-粒子模块案例-扩展案例-MPM-炸药起爆破岩过程模拟-mpm-explosive.js

## Query
我现在要做一个CDyna案例的数值模拟，场景大致是：设置工作路径为脚本文件所在路径。请根据 CDEM 技术手册，合理选择blkdyn、dyna、pdyna等模块，帮我写一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、边界条件与载荷、求解参数和结果监测。

## Generated Code
```javascript
var searchResult = search_physics_knowledge({"query": "CDyna案例"});
```

## Ground Truth
```javascript
//设置工作路径为脚本文件所在路径
setCurDir(getSrcDir());

//设置输出间隔为200步
dyna.Set("Output_Interval 200");

//设置3个方向的重力加速度为0
dyna.Set("Gravity  0 0 0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//设置计算时步
dyna.Set("Time_Step 1e-8");

//设置颗粒计算类型为 mpm方法
dyna.Set("Particle_Cal_Type 4");

//设置颗粒与刚性面接触模型采用全局参数
dyna.Set("If_Contact_Use_GlobMat 1 2 1e13 1e13 0.0 0.0 0.0");

//导入炸药单元，为有限体积网格单元
blkdyn.ImportGrid("gid","explosive.msh");

//设置单元本构为JWL
blkdyn.SetModel("JWL");

//设置JWL单元基本参数，主要为密度
blkdyn.SetMat(1630,7e9,0.25,3e6,1e6,35,15);

//设置JWL炸药参数，并与单元关联
var pos=new Array(0.0,0.0,0.0);
blkdyn.SetJWLSource(1,1630,7.0e9,371.2e9,3.2e9,4.2,0.95,0.30,21e9,6930,pos,0.0,100);
blkdyn.BindJWLSource(1,1,100);

//设置单元阻尼为0
blkdyn.SetLocalDamp(0.0);

//导入颗粒模型
pdyna.Import("gid", "circle-cu.msh");

//设置材料参数，依次为density, young, poisson, tension, cohesion, friction, localdamp, viscdamp
pdyna.SetMat(2500,7e10,0.25, 20e6, 40e6, 35, 0.01,0);

//创建mpm背景网格
mpm.SetBackGrid(2,0.01, [-0.3,-0.3,0], [60, 60, 0]);


//mpm模型切换为理想弹塑性模型
mpm.SetModelByGroup("MC",1,2);

//求解5ms
dyna.DynaCycle(5e-3);


```
