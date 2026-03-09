# Failure Analysis: 案例库-CDyna案例-粒子模块案例-扩展案例-MPM-水与弹性柱的相互作用-Water-Bar-Interaction.js

## Query
我现在要做一个CDyna案例的数值模拟，场景大致是：设置工作路径为脚本文件所在路径。请根据 CDEM 技术手册，合理选择blkdyn、dyna、pdyna、rdface等模块，帮我写一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、边界条件与载荷、求解参数和结果监测。

## Generated Code
```javascript
//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//清除GDEM-Pdyna计算核心中的内存数据
pdyna.Clear();

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
```

## Ground Truth
```javascript
//设置工作路径为脚本文件所在路径
setCurDir(getSrcDir());

//设置输出间隔为1000步
dyna.Set("Output_Interval 1000");

//打开大变形开关
dyna.Set("Large_Displace 1");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//设置计算时步为0.2ms
dyna.Set("Time_Step 2e-4");

//设置颗粒计算模式为mpm
dyna.Set("Particle_Cal_Type 4");

//导入ansys格式的桩体网格
blkdyn.ImportGrid("ansys","bar.dat");

//设置桩体模型为线弹性模型
blkdyn.SetModel("linear");

//设置桩体材料参数
blkdyn.SetMat(2000,5e7,0.3,0,0,20,20);

//固定桩体底部
blkdyn.FixV("xyz",0,"y",-1,-0.09);

//设置桩体局部阻尼
blkdyn.SetLocalDamp(0.01);

//设置全局重力加速度为0，桩体不受重力
dyna.Set("Gravity  0 0 0");

//重新设置桩体重力，让其重力为0
blkdyn.ApplyGravity();

//恢复全局重力加速度
dyna.Set("Gravity  0 -9.8 0");

//设置颗粒与刚性面接触模型采用全局参数
dyna.Set("If_Contact_Use_GlobMat 1 2 1e9 1e9  0.0 0.0 0.0");

//创建mpm颗粒
pdyna. RegularCreateByCoord (1, 1, 0.1, 0,10,0,10,0,0);

//添加刚性面
rdface.Create (1, 1, 2, [-0.1,-0.1,0,-0.1,20,0]); 
rdface.Create (1, 1, 2, [-0.1,-0.1,0,30,-0.1,0]); 
rdface.Create (1, 1, 2, [30,-0.1,0,30,20,0]); 


//设置粒子材料参数，分别为density, young, poisson, tension, cohesion, friction, localdamp, viscdamp
pdyna.SetMat(2200,1e8,0.25, 0.0, 0.0,0.0001,0.01,0);

//设置mpm背景网格
mpm.SetBackGrid(2,1.0, [-3,-3,0], [35, 25, 0]);

//设置mpm本构模型
mpm.SetModelByGroup("DP",1,2);

//计算20秒
dyna.DynaCycle(20);


```
