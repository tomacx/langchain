# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-螺栓拧紧顺序对预紧力的影响模拟-ComputeStress-mew.js

## Query
请编写一个CDyna仿真脚本，实现螺栓拧紧顺序对预紧力的影响模拟-ComputeStress-mew，并输出必要的结果与监测。

## Generated Code
```javascript
// 设置工作路径为脚本文件所在路径
setCurDir(getSrcDir());

// 设置输出间隔为1000步
dyna.Set("Output_Interval 1000");

// 设置重力方向
dyna.Set("Gravity  0 -9.8 0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 设置计算时步为5e-5
dyna.Set("Time_Step 5e-5");

// 设置不平衡率为1e-3
dyna.Set("UnBalance_Ratio 1e-3");

// 设置颗粒计算类型为 mpm方法
dyna.Set("Particle_Cal_Type 4");

// 设置颗粒与刚性面接触模型采用全局参数
dyna.Set("If_Contact_Use_GlobMat 1 2 1e8 1e8 0.0 0.0 0.0");

// 产生规则的颗粒
pdyna.RegularCreateByCoord(1, 1, 0.005, 0, 1, 0, 2, 0.0, 0);

// 设置材料参数，依次为density, young, poisson, tension, cohesion, friction, localdamp, viscdamp
pdyna.SetMat(1000, 1e7, 0.35, 1e-3, 1e-3, 1e-3, 0.01, 0, 1);

// 创建mpm背景网格
mpm.SetBackGrid(2, 0.06, [-0.5, -0.5, 0], [100, 100, 0]);

// 设置mpm模型为线弹性模型
mpm.SetModelByGroup("DP", 1, 1);

// 创建刚性面
var fCoord = new Array();
fCoord[0] = new Array(-0.005, -0.005, 0);
fCoord[1] = new Array(5, -0.005, 0);
rdface.Create(1, 1, 2, fCoord);

fCoord[0] = new Array(5, -0.005, 0);
fCoord[1] = new Array(5, 5, 0);
rdface.Create(1, 1, 2, fCoord);

fCoord[0] = new Array(-0.005, -0.005, 0);
fCoord[1] = new Array(-0.005, 5, 0);
rdface.Create(1, 1, 2, fCoord);

// 求解50万步
dyna.DynaCycle(500000);
```

## Ground Truth
```javascript
setCurDir(getSrcDir());
dyna.Clear();
doc.clearResult();

dyna.Set("Gravity 0 0 0");
dyna.Set("Contact_Detect_Tol 0.0");

dyna.Set("Virtural_Step 0.5");

dyna.Set("If_Renew_Contact 1");

//dyna.Set("Contact_Cal_Quantity 1");

dyna.Set("Output_Interval 1000");

blkdyn.ImportGrid("gmsh","plate.msh");

blkdyn.CrtBoundIFaceByCoord(-100,100,-100,100,-0.0001, 0.0001);
blkdyn.CrtBoundIFaceByCoord(-100,100,-100,100,0.0149999,0.0150001);
blkdyn.CrtIFace(1,2);
blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");

//铝合金参数
blkdyn.SetMat(2702,72e9,0.3, 3e6,3e6,0,0,1);
//橡胶参数
blkdyn.SetMat(980,1.2e9,0.48, 3e6,3e6,0,0,2);
//螺栓
blkdyn.SetMat(7800,2.1e11,0.33, 3e6,3e6,0,0,3,100);

blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(1e11, 1e11, 10.0, 0, 0);
blkdyn.SetIStiffByElem(1.0);

dyna.Solve(1);



for(var i = 0; i < 3; i++)
{
var x1 = 0.1 + 0.1 * i;
var y1 = 0.1;
var z1 = 0.01;
dyna.Monitor("block","szz", x1, y1, z1);
}

for(var i = 0; i < 3; i++)
{
var x1 = 0.1 + 0.1 * i;
var y1 = 0.1;
var z1 = 0.005;
dyna.Monitor("block","szz", x1, y1, z1);
}


for(var i = 0; i < 4; i++)
{
var x1 = 0.05 + 0.1 * i;
var y1 = 0.1;
var z1 = 0.015 * 0.5;
dyna.Monitor("block","szz", x1, y1, z1);
}

blkdyn.SetModel("none",3,100);


//定义BaseValue（三个方向基础值）及Grad（三个方向梯度值）两个数组
var BaseValue = [0, 0, 1e6];
var BaseValue1 = [0, 0, -1e6];
var Grad      = [0, 0,0, 0, 0, 0, 0, 0, 0];

for(var i = 0; i < 3; i++)
{
var x1 = 0.1 + 0.1 * i;
var y1 = 0.1;
var z1 = 0.0;
var x2 = 0.1 + 0.1 * i;
var y2 = 0.1;
var z2 = 0.015;
var hh = 0.005;

blkdyn.SetModel("linear",4 + i * 2);


blkdyn.ApplyConditionByCylinder("face_force", BaseValue, Grad, x1, y1, z1 + 0.00499,x2, y2, z2 - 0.00499, 0.0, 0.007999, true);

dyna.Solve(10000);

blkdyn.ApplyConditionByCylinder("face_force", BaseValue1, Grad, x1, y1, z1 + 0.00499,x2, y2, z2 - 0.00499, 0.0, 0.007999, true);

blkdyn.SetModel("linear",3 + i * 2);

blkdyn.InitConditionByGroup("stress", BaseValue, Grad, 3 + i * 2, 3 + i * 2);

dyna.Solve(10000);

Iter = Math.round(dyna.GetValue("Iter_Now"));

dyna.Save("Iter" + Iter  + ".sav");
}






```

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-扩展案例-螺栓拧紧顺序对预紧力的影响模拟-ComputeStress-mew.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-扩展案例-螺栓拧紧顺序对预紧力的影响模拟-ComputeStress-mew.js (generated)
@@ -1,106 +1,55 @@
+// 设置工作路径为脚本文件所在路径
 setCurDir(getSrcDir());
-dyna.Clear();
-doc.clearResult();
 
-dyna.Set("Gravity 0 0 0");
-dyna.Set("Contact_Detect_Tol 0.0");
-
-dyna.Set("Virtural_Step 0.5");
-
-dyna.Set("If_Renew_Contact 1");
-
-//dyna.Set("Contact_Cal_Quantity 1");
-
+// 设置输出间隔为1000步
 dyna.Set("Output_Interval 1000");
 
-blkdyn.ImportGrid("gmsh","plate.msh");
+// 设置重力方向
+dyna.Set("Gravity  0 -9.8 0");
 
-blkdyn.CrtBoundIFaceByCoord(-100,100,-100,100,-0.0001, 0.0001);
-blkdyn.CrtBoundIFaceByCoord(-100,100,-100,100,0.0149999,0.0150001);
-blkdyn.CrtIFace(1,2);
-blkdyn.UpdateIFaceMesh();
+// 打开大变形计算开关
+dyna.Set("Large_Displace 1");
 
-blkdyn.SetModel("linear");
+// 关闭虚拟质量开关
+dyna.Set("If_Virtural_Mass 0");
 
-//铝合金参数
-blkdyn.SetMat(2702,72e9,0.3, 3e6,3e6,0,0,1);
-//橡胶参数
-blkdyn.SetMat(980,1.2e9,0.48, 3e6,3e6,0,0,2);
-//螺栓
-blkdyn.SetMat(7800,2.1e11,0.33, 3e6,3e6,0,0,3,100);
+// 设置计算时步为5e-5
+dyna.Set("Time_Step 5e-5");
 
-blkdyn.SetIModel("brittleMC");
-blkdyn.SetIMat(1e11, 1e11, 10.0, 0, 0);
-blkdyn.SetIStiffByElem(1.0);
+// 设置不平衡率为1e-3
+dyna.Set("UnBalance_Ratio 1e-3");
 
-dyna.Solve(1);
+// 设置颗粒计算类型为 mpm方法
+dyna.Set("Particle_Cal_Type 4");
 
+// 设置颗粒与刚性面接触模型采用全局参数
+dyna.Set("If_Contact_Use_GlobMat 1 2 1e8 1e8 0.0 0.0 0.0");
 
+// 产生规则的颗粒
+pdyna.RegularCreateByCoord(1, 1, 0.005, 0, 1, 0, 2, 0.0, 0);
 
-for(var i = 0; i < 3; i++)
-{
-var x1 = 0.1 + 0.1 * i;
-var y1 = 0.1;
-var z1 = 0.01;
-dyna.Monitor("block","szz", x1, y1, z1);
-}
+// 设置材料参数，依次为density, young, poisson, tension, cohesion, friction, localdamp, viscdamp
+pdyna.SetMat(1000, 1e7, 0.35, 1e-3, 1e-3, 1e-3, 0.01, 0, 1);
 
-for(var i = 0; i < 3; i++)
-{
-var x1 = 0.1 + 0.1 * i;
-var y1 = 0.1;
-var z1 = 0.005;
-dyna.Monitor("block","szz", x1, y1, z1);
-}
+// 创建mpm背景网格
+mpm.SetBackGrid(2, 0.06, [-0.5, -0.5, 0], [100, 100, 0]);
 
+// 设置mpm模型为线弹性模型
+mpm.SetModelByGroup("DP", 1, 1);
 
-for(var i = 0; i < 4; i++)
-{
-var x1 = 0.05 + 0.1 * i;
-var y1 = 0.1;
-var z1 = 0.015 * 0.5;
-dyna.Monitor("block","szz", x1, y1, z1);
-}
+// 创建刚性面
+var fCoord = new Array();
+fCoord[0] = new Array(-0.005, -0.005, 0);
+fCoord[1] = new Array(5, -0.005, 0);
+rdface.Create(1, 1, 2, fCoord);
 
-blkdyn.SetModel("none",3,100);
+fCoord[0] = new Array(5, -0.005, 0);
+fCoord[1] = new Array(5, 5, 0);
+rdface.Create(1, 1, 2, fCoord);
 
+fCoord[0] = new Array(-0.005, -0.005, 0);
+fCoord[1] = new Array(-0.005, 5, 0);
+rdface.Create(1, 1, 2, fCoord);
 
-//定义BaseValue（三个方向基础值）及Grad（三个方向梯度值）两个数组
-var BaseValue = [0, 0, 1e6];
-var BaseValue1 = [0, 0, -1e6];
-var Grad      = [0, 0,0, 0, 0, 0, 0, 0, 0];
-
-for(var i = 0; i < 3; i++)
-{
-var x1 = 0.1 + 0.1 * i;
-var y1 = 0.1;
-var z1 = 0.0;
-var x2 = 0.1 + 0.1 * i;
-var y2 = 0.1;
-var z2 = 0.015;
-var hh = 0.005;
-
-blkdyn.SetModel("linear",4 + i * 2);
-
-
-blkdyn.ApplyConditionByCylinder("face_force", BaseValue, Grad, x1, y1, z1 + 0.00499,x2, y2, z2 - 0.00499, 0.0, 0.007999, true);
-
-dyna.Solve(10000);
-
-blkdyn.ApplyConditionByCylinder("face_force", BaseValue1, Grad, x1, y1, z1 + 0.00499,x2, y2, z2 - 0.00499, 0.0, 0.007999, true);
-
-blkdyn.SetModel("linear",3 + i * 2);
-
-blkdyn.InitConditionByGroup("stress", BaseValue, Grad, 3 + i * 2, 3 + i * 2);
-
-dyna.Solve(10000);
-
-Iter = Math.round(dyna.GetValue("Iter_Now"));
-
-dyna.Save("Iter" + Iter  + ".sav");
-}
-
-
-
-
-
+// 求解50万步
+dyna.DynaCycle(500000);
```
