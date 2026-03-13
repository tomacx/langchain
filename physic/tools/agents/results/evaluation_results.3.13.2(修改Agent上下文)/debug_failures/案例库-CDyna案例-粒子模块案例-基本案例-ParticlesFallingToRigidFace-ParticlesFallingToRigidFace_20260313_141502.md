# Failure Analysis: 案例库-CDyna案例-粒子模块案例-基本案例-ParticlesFallingToRigidFace-ParticlesFallingToRigidFace.js

## Query
请复现一个CDyna案例的 JavaScript 案例脚本，案例文件名为「案例库-CDyna案例-粒子模块案例-基本案例-ParticlesFallingToRigidFace-ParticlesFallingToRigidFace.js」，场景/主题为：粒子模块案例 - 基本案例 - ParticlesFallingToRigidFace - ParticlesFallingToRigidFace。请严格依据 CDEM 技术手册/API（优先）来选择与确认接口与参数含义。必须使用到这些模块：dyna、pdyna、rdface。请按“几何建模→网格划分→材料/模型→边界/载荷→求解参数→结果输出/监测”的顺序组织脚本，并确保脚本以 setCurDir(getSrcDir()); 开头。脚本注释/意图线索：设置当前路径为JavaScript脚本所在的路径；设置输出的间隔为500步；关闭虚质量计算开关；设置三个方向的重力加速度；设置接触容差为0.001m；设置颗粒超出范围后清除颗粒；导入gid格式的刚性面边界；导入gid格式的颗粒；根据颗粒的ID号重新设置颗粒的组号；设置颗粒模型为脆性断裂模型；设置颗粒的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）；设置计算时步；迭代1万步。API 调用关键词（用于检索技术手册）：dyna.Set，dyna.Solve，pdyna.Import，pdyna.SetGroupByID，pdyna.SetMat，pdyna.SetModel，rdface.Import。

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
