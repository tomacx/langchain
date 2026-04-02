# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-高压气体渗流破岩-Frac-Gas-Seepage.js

## Query
请编写一个CDyna仿真脚本，实现Frac-Gas-Seepage，并输出必要的结果与监测。

## Generated Code
```javascript
// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 关闭力学计算开关
dyna.Set("Mechanic_Cal", 0);

// 包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage", 1);
print("ok");

// 开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal", 1);

// 设置三个方向的重力加速度
dyna.Set("Gravity", 0.0, -10.0, 0.0);

// 将结果输出时步设定为500步
dyna.Set("Output_Interval", 500);

// 监测结果输出时步间隔设定为100步
dyna.Set("Moniter_Iter", 100);

print("ok");

// 导入patran格式的网格
blkdyn.ImportGrid("patran", "RecDam.out");
print("ok");

// 定义X、Y、Z三个方向的渗透系数
var arrayK = new Array(1e-10, 1e-10, 1e-10);

// 指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByCoord(1000.0, 1e6, 0.0, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

// 定义梯度1
var fArrayGrad1 = new Array(0, -1e4, 0);

// 定义梯度2
var fArrayGrad2 = new Array(0.0, 0.0, 0.0);

// 设定模型四周的水压力边界条件
poresp.ApplyConditionByCoord("pp", 10e4, fArrayGrad1, 8.99, 9.01, -1, 10, -500, 500, false);
poresp.ApplyConditionByCoord("pp", 2e4, fArrayGrad1, -0.01, 0.01, -1, 2.0, -500, 500, false);
poresp.ApplyConditionByCoord("pp", 0, fArrayGrad2, 8.99, 9.01, 10.01, 200, -500, 500, false);
poresp.ApplyConditionByCoord("pp", 0, fArrayGrad2, -0.01, 0.01, 2.001, 200, -500, 500, false);

// 对典型位置的孔隙压力进行监测
dyna.Monitor("block", "fpp", 0, 5, 0);
dyna.Monitor("block", "fpp", 2, 5, 0);
dyna.Monitor("block", "fpp", 4, 5, 0);
dyna.Monitor("block", "fpp", 6, 5, 0);
dyna.Monitor("block", "fpp", 8, 5, 0);
dyna.Monitor("block", "fpp", 10, 5, 0);

// 设定计算时步为100s
dyna.Set("Time_Step", 100);

// 迭代2万步
dyna.Solve(20000);

// 打印提示信息
print("Solution Finished");
```

## Ground Truth
```javascript
//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

dyna.Clear();
igeo.clear();
imeshing.clear();
doc.clearResult();

igeo.genRectS(0,0,0,1,1,0,0.1,1);

imeshing.genMeshByGmsh(2);

//关闭力学计算开关
dyna.Set("Mechanic_Cal 1");

dyna.Set("Large_Displace 1");

dyna.Set("If_Renew_Contact 1");

dyna.Set("Contact_Detect_Tol 0.0");


//包含裂隙计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

dyna.Set("Seepage_Mode 2");

//打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

//设置3个方向的重力加速度
dyna.Set("Gravity 0.0 0.0 0.0");

//设置结果输出时步
dyna.Set("Output_Interval 1000");

//打开裂隙渗流与固体破裂耦合开关
dyna.Set("FS_Solid_Interaction 1");

blkdyn.GetMesh(imeshing);

blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 35, 15);

blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(1e11, 1e11, 35, 3e6, 1e6);

//创建裂隙
fracsp.CreateGridFromBlock (2);

//设置裂隙渗流参数，fDensity, fBulk, fScK, fInitCrackWid, fFrictionL, fFrictionU
//对于气体渗流模式，体积模量不起作用
fracsp.SetPropByGroup(1.293,1e7,7e-9,1e-6,1,11);

//初始化压力
fracsp.InitConditionByCoord("pp", 1e5, [0,0,0], -1e6, 1e6, -1e6, 1e6, -1e6, 1e6);

var ID = Math.round (fracsp.GetNodeID (0.5, 0.5, 0) );

var fx = fracsp.GetNodeValue(ID, "Coord", 1);
var fy = fracsp.GetNodeValue(ID, "Coord", 2);
//加气
fracsp.ApplyConditionByCoord("source", 1e-2,  [0.0, 0.0, 0.0], fx - 1e-3, fx + 1e-3, fy - 1e-3, fy + 1e-3, -1, 1);

//自动计算时步
dyna.Set("Time_Step 1e-6");

//求解5万步
dyna.Solve(50000);

//打印提示信息
print("Solution Finished");

```

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-扩展案例-高压气体渗流破岩-Frac-Gas-Seepage.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-扩展案例-高压气体渗流破岩-Frac-Gas-Seepage.js (generated)
@@ -1,75 +1,62 @@
-//设置当前工作路径为JavaScript脚本文件所在路径
+// 设置当前工作路径为JavaScript脚本文件所在路径
 setCurDir(getSrcDir());
 
-dyna.Clear();
-igeo.clear();
-imeshing.clear();
-doc.clearResult();
+// 关闭力学计算开关
+dyna.Set("Mechanic_Cal", 0);
 
-igeo.genRectS(0,0,0,1,1,0,0.1,1);
+// 包含孔隙渗流计算功能，开辟渗流相关的内存
+dyna.Set("Config_PoreSeepage", 1);
+print("ok");
 
-imeshing.genMeshByGmsh(2);
+// 开启孔隙渗流开关
+dyna.Set("PoreSeepage_Cal", 1);
 
-//关闭力学计算开关
-dyna.Set("Mechanic_Cal 1");
+// 设置三个方向的重力加速度
+dyna.Set("Gravity", 0.0, -10.0, 0.0);
 
-dyna.Set("Large_Displace 1");
+// 将结果输出时步设定为500步
+dyna.Set("Output_Interval", 500);
 
-dyna.Set("If_Renew_Contact 1");
+// 监测结果输出时步间隔设定为100步
+dyna.Set("Moniter_Iter", 100);
 
-dyna.Set("Contact_Detect_Tol 0.0");
+print("ok");
 
+// 导入patran格式的网格
+blkdyn.ImportGrid("patran", "RecDam.out");
+print("ok");
 
-//包含裂隙计算模块，开辟相应内存
-dyna.Set("Config_FracSeepage 1");
+// 定义X、Y、Z三个方向的渗透系数
+var arrayK = new Array(1e-10, 1e-10, 1e-10);
 
-dyna.Set("Seepage_Mode 2");
+// 指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
+poresp.SetPropByCoord(1000.0, 1e6, 0.0, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);
 
-//打开裂隙渗流计算开关
-dyna.Set("FracSeepage_Cal 1");
+// 定义梯度1
+var fArrayGrad1 = new Array(0, -1e4, 0);
 
-//设置3个方向的重力加速度
-dyna.Set("Gravity 0.0 0.0 0.0");
+// 定义梯度2
+var fArrayGrad2 = new Array(0.0, 0.0, 0.0);
 
-//设置结果输出时步
-dyna.Set("Output_Interval 1000");
+// 设定模型四周的水压力边界条件
+poresp.ApplyConditionByCoord("pp", 10e4, fArrayGrad1, 8.99, 9.01, -1, 10, -500, 500, false);
+poresp.ApplyConditionByCoord("pp", 2e4, fArrayGrad1, -0.01, 0.01, -1, 2.0, -500, 500, false);
+poresp.ApplyConditionByCoord("pp", 0, fArrayGrad2, 8.99, 9.01, 10.01, 200, -500, 500, false);
+poresp.ApplyConditionByCoord("pp", 0, fArrayGrad2, -0.01, 0.01, 2.001, 200, -500, 500, false);
 
-//打开裂隙渗流与固体破裂耦合开关
-dyna.Set("FS_Solid_Interaction 1");
+// 对典型位置的孔隙压力进行监测
+dyna.Monitor("block", "fpp", 0, 5, 0);
+dyna.Monitor("block", "fpp", 2, 5, 0);
+dyna.Monitor("block", "fpp", 4, 5, 0);
+dyna.Monitor("block", "fpp", 6, 5, 0);
+dyna.Monitor("block", "fpp", 8, 5, 0);
+dyna.Monitor("block", "fpp", 10, 5, 0);
 
-blkdyn.GetMesh(imeshing);
+// 设定计算时步为100s
+dyna.Set("Time_Step", 100);
 
-blkdyn.CrtIFace();
-blkdyn.UpdateIFaceMesh();
+// 迭代2万步
+dyna.Solve(20000);
 
-blkdyn.SetModel("linear");
-blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 35, 15);
-
-blkdyn.SetIModel("brittleMC");
-blkdyn.SetIMat(1e11, 1e11, 35, 3e6, 1e6);
-
-//创建裂隙
-fracsp.CreateGridFromBlock (2);
-
-//设置裂隙渗流参数，fDensity, fBulk, fScK, fInitCrackWid, fFrictionL, fFrictionU
-//对于气体渗流模式，体积模量不起作用
-fracsp.SetPropByGroup(1.293,1e7,7e-9,1e-6,1,11);
-
-//初始化压力
-fracsp.InitConditionByCoord("pp", 1e5, [0,0,0], -1e6, 1e6, -1e6, 1e6, -1e6, 1e6);
-
-var ID = Math.round (fracsp.GetNodeID (0.5, 0.5, 0) );
-
-var fx = fracsp.GetNodeValue(ID, "Coord", 1);
-var fy = fracsp.GetNodeValue(ID, "Coord", 2);
-//加气
-fracsp.ApplyConditionByCoord("source", 1e-2,  [0.0, 0.0, 0.0], fx - 1e-3, fx + 1e-3, fy - 1e-3, fy + 1e-3, -1, 1);
-
-//自动计算时步
-dyna.Set("Time_Step 1e-6");
-
-//求解5万步
-dyna.Solve(50000);
-
-//打印提示信息
+// 打印提示信息
 print("Solution Finished");
```
