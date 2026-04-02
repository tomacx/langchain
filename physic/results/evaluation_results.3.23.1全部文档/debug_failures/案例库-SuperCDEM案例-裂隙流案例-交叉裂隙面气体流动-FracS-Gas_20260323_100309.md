# Failure Analysis: 案例库-SuperCDEM案例-裂隙流案例-交叉裂隙面气体流动-FracS-Gas.js

## Query
请编写一个SuperCDEM仿真脚本，实现交叉裂隙面气体流动-FracS-Gas，并输出必要的结果与监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

scdem.outputInterval = 100;
scdem.monitorIter = 100;

scdem.set("isLargeDisplace", 1);
scdem.gravity = [0, 0, 0];
scdem.isVirtualMass = 0;
scdem.set("ubr", 1e-4);

// 裂隙渗流模块参数设置
scdem.set("Config_FracSeepage", 1); // 开启裂隙气体流动
scdem.set("FracSeepage_Cal", 1); // 进行裂隙气体流动计算
scdem.set("Seepage_Mode", 2); // 流动模式设置为气体
scdem.set("FS_Solid_Interaction", 1); // 开启裂隙场和固体场耦合计算
scdem.set("FS_MaxWid", 6e-5);

var msh = imesh.importGmsh("Tet4Gmsh.msh");
scdem.getMesh(msh);

scdem.setModel("linear");

scdem.setMat([2600, 5.5e10, 0.25, 10e6, 2.5e6, 30.0, 10.0]);

scdem.setIModel("FracE");
scdem.setContactFractureEnergy(10, 20);

scdem.setIMat(5e9, 5e9, 30, 10e6, 2.5e6); 
scdem.setIMatByElem(50);
scdem.setContactFractureEnergy(50, 100);

SFracsp.createGridFromBlock(1);

SFracsp.setPropByCoord([1.0, 1e7, 12e-13, 12e-9], -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
SFracsp.initConditionByCoord("pp", 1e5, 0, 0, 0, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 设置高压气体条件
var pressure = 30e6;
SFracsp.applyConditionByCylinder("pp", pressure, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0.151);

scdem.timeStep = 1e-7;

scdem.dynaSolveGpu(0.01);

print("finish");
```

## Ground Truth
```javascript
setCurDir(getSrcDir());

//包含裂隙计算模块，开辟相应内存
scdem.set("Config_FracSeepage", 1);

scdem.set("FracSeepage_Cal", 1);

scdem.set("Mechanic_Cal", 0);

SFracsp.importGrid("gid", "fracurenet.msh");

scdem.set("gravity",[0.0,-10.0,0.0]);

scdem.outputInterval = 100;

scdem.set("Seepage_Mode", 2);

SFracsp.setPropByCoord([1.00,1e7,12e-13,12e-9], -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

SFracsp.initConditionByCoord("pp",1e5, 0,0,0, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

SFracsp.applyConditionByCoord("pp", 30e6, 0,0,0, -1e5, 1e5, -0.001, 0.001, -1e5, 1e5)

scdem.timeStep = 100;
scdem.solveGpu(10000);

print("finish");


```

## Unified Diff
```diff
--- 案例库-SuperCDEM案例-裂隙流案例-交叉裂隙面气体流动-FracS-Gas.js (ground_truth)
+++ 案例库-SuperCDEM案例-裂隙流案例-交叉裂隙面气体流动-FracS-Gas.js (generated)
@@ -1,28 +1,45 @@
 setCurDir(getSrcDir());
 
-//包含裂隙计算模块，开辟相应内存
-scdem.set("Config_FracSeepage", 1);
+scdem.outputInterval = 100;
+scdem.monitorIter = 100;
 
-scdem.set("FracSeepage_Cal", 1);
+scdem.set("isLargeDisplace", 1);
+scdem.gravity = [0, 0, 0];
+scdem.isVirtualMass = 0;
+scdem.set("ubr", 1e-4);
 
-scdem.set("Mechanic_Cal", 0);
+// 裂隙渗流模块参数设置
+scdem.set("Config_FracSeepage", 1); // 开启裂隙气体流动
+scdem.set("FracSeepage_Cal", 1); // 进行裂隙气体流动计算
+scdem.set("Seepage_Mode", 2); // 流动模式设置为气体
+scdem.set("FS_Solid_Interaction", 1); // 开启裂隙场和固体场耦合计算
+scdem.set("FS_MaxWid", 6e-5);
 
-SFracsp.importGrid("gid", "fracurenet.msh");
+var msh = imesh.importGmsh("Tet4Gmsh.msh");
+scdem.getMesh(msh);
 
-scdem.set("gravity",[0.0,-10.0,0.0]);
+scdem.setModel("linear");
 
-scdem.outputInterval = 100;
+scdem.setMat([2600, 5.5e10, 0.25, 10e6, 2.5e6, 30.0, 10.0]);
 
-scdem.set("Seepage_Mode", 2);
+scdem.setIModel("FracE");
+scdem.setContactFractureEnergy(10, 20);
 
-SFracsp.setPropByCoord([1.00,1e7,12e-13,12e-9], -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
+scdem.setIMat(5e9, 5e9, 30, 10e6, 2.5e6); 
+scdem.setIMatByElem(50);
+scdem.setContactFractureEnergy(50, 100);
 
-SFracsp.initConditionByCoord("pp",1e5, 0,0,0, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
+SFracsp.createGridFromBlock(1);
 
-SFracsp.applyConditionByCoord("pp", 30e6, 0,0,0, -1e5, 1e5, -0.001, 0.001, -1e5, 1e5)
+SFracsp.setPropByCoord([1.0, 1e7, 12e-13, 12e-9], -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
+SFracsp.initConditionByCoord("pp", 1e5, 0, 0, 0, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
 
-scdem.timeStep = 100;
-scdem.solveGpu(10000);
+// 设置高压气体条件
+var pressure = 30e6;
+SFracsp.applyConditionByCylinder("pp", pressure, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0.151);
+
+scdem.timeStep = 1e-7;
+
+scdem.dynaSolveGpu(0.01);
 
 print("finish");
-
```
