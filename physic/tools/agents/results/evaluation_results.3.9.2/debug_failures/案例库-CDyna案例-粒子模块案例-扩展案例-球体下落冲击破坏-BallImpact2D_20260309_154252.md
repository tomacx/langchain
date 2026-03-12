# Failure Analysis: 案例库-CDyna案例-粒子模块案例-扩展案例-球体下落冲击破坏-BallImpact2D.js

## Query
我现在要做一个CDyna案例的数值模拟，场景大致是：设置当前路径为JavaScript脚本所在的路径。请根据 CDEM 技术手册，合理选择dyna、pdyna等模块，帮我写一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、边界条件与载荷、求解参数和结果监测。

## Generated Code
```javascript

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
dyna.Set("Time_Step 2e-5");

//从GiD导入颗粒
pdyna.Import("gid","BallImpact2D.msh");

//设置颗粒模型为脆性断裂模型
pdyna.SetModel("SSMC");

//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e8, 0.2, 3e7, 6e7, 36, 0.0, 0.1,2);

pdyna.SetMat(2500, 1e6, 0.2, 3e4, 6e4, 25, 0.0, 0.1,1);

var fvalue = new Array(0.0, -10, 0.0);
pdyna.InitCondByGroup ("velocity", fvalue, 2,2);

pdyna.ApplyQuietBoundByCoord(-0.2,0.2,-1000,1000,-1,1);
pdyna.ApplyQuietBoundByCoord(9.8,11,-1000,1000,-1,1);
pdyna.ApplyQuietBoundByCoord(-1000,1000,-0.2,0.2,-1,1);

//求解2万步
dyna.Solve(20000);

//打印信息
print("Solution is ok!");


```
