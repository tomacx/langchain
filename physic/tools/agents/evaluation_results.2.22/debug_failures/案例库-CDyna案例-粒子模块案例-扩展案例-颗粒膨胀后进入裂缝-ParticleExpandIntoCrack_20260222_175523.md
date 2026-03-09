# Failure Analysis: 案例库-CDyna案例-粒子模块案例-扩展案例-颗粒膨胀后进入裂缝-ParticleExpandIntoCrack.js

## Query
我现在要做一个CDyna案例的数值模拟，场景大致是：设置当前路径为JavaScript脚本所在的路径。请根据 CDEM 技术手册，合理选择blkdyn、dyna、pdyna等模块，帮我写一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、边界条件与载荷、求解参数和结果监测。

## Generated Code
```javascript
// 设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

// 几何建模
igeo.clear();
imeshing.clear();

var fx = 10;
var fy = 5;
var frad = 0.3;
var size = 0.1;

var id1 = igeo.genRect(0,0,0,fx,fy,0,size);
var id2 = igeo.genCircle(fx * 0.5, fy *0.6, 0, frad, size);

igeo.genSurface([id1, id2],1);
igeo.genSurface(id2,2);

imeshing.genMeshByGmsh(2);

// 网格划分
dyna.Clear();
doc.clearResult();

blkdyn.GetMesh(imeshing);

blkdyn.CrtIFace(1,2);
blkdyn.UpdateIFaceMesh();

// 材料与模型设置
blkdyn.SetModel("MC");
blkdyn.SetMat(2200,2.1e10,0.3,3e5,1e5,30,15);

blkdyn.SetIModel("brittleMC");

blkdyn.SetIMat(1e12,1e12,0,0,0);

// 边界条件与载荷
blkdyn.FixV("x",0,"x",-0.01,0.001);
blkdyn.FixV("x",0,"x",fx- 0.001, fx + 0.001);
blkdyn.FixV("y",0,"y",-0.001,0.001);

// 求解参数
dyna.TimeStepCorrect(0.01);

dyna.DynaCycle(2e-3);

print("Completed!");
```

## Ground Truth
```javascript
//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

dyna.Set("If_Particle_NForce_Incremental 0");

//设置输出的间隔为500步
dyna.Set("Output_Interval 500");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

dyna.Set("Large_Displace 1");

dyna.Set("If_Renew_Contact 1");

dyna.Set("Particle_Renew_Interval 1");

//设置三个方向的重力加速度
dyna.Set("Gravity 0.0 0.0 0.0");

//设置接触容差为0.001m
dyna.Set("Contact_Detect_Tol 0.000");

//设置颗粒超出范围后清除颗粒
//dyna.Set("Particle_Out_Kill 1 -3 3 -0.1 3 -3 3 0");


blkdyn.ImportGrid("gid","112.msh");

blkdyn.CrtIFace();

blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("MC");

blkdyn.SetMat(2500,1e8,0.25,10e6,5e6, 25, 15);


blkdyn.SetIModel("brittleMC");

blkdyn.SetIStrengthByElem();

blkdyn.SetIStiffByElem(1.0);

blkdyn.SetLocalDamp(0.05);

blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 0.999, 1.01);
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);
blkdyn.FixV("y", 0.0, "y", 0.999, 1.01);


//导入gid格式的颗粒
var x=[0.41,0.59];
var y=[0.41,0.59];
var z=[-1,1];
pdyna.CreateByCoord(2000,1,1,0.003,0.005,0.003,x,y,z);


//设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

//设置颗粒的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 2e7, 0.25, 0.0, 0.0, 15, 0.0, 0.1);

//设置计算时步
dyna.Set("Time_Step 1e-5");

//迭代1万步
dyna.Solve(10000);
```
