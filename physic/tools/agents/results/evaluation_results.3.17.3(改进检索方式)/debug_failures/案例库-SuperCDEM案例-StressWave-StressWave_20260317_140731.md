# Failure Analysis: 案例库-SuperCDEM案例-StressWave-StressWave.js

## Query
请编写一个SuperCDEM仿真脚本，实现StressWave-StressWave，并输出必要的结果与监测。

## Generated Code
```javascript

```

## Ground Truth
```javascript
setCurDir(getSrcDir());

scdem.outputInterval = 100;

scdem.set("RayleighDamp", 1e-5, 0);

var msh = imesh.importGmsh("Plate.msh");//可更换文件中不同网格数量的网格文件
scdem.getMesh(msh);

//设置单元模型为线弹性模量
scdem.setModel("linear");
scdem.setMat([2000, 1e10, 0.2, 3e6, 1e6, 30.0, 10.0]);

scdem.setIModel("linear");
scdem.setIMatByElem(50);

//右侧无反射
oSel1 = new SelElemFaces(scdem);
oSel1.box(19.999,-100,-100,20.001,100,100);
scdem.applyNonReflectionBySel(oSel1);

//左侧施加动态边界
var oSel = new SelElemFaces(scdem);
oSel.box(-0.01,-100,-100,0.01,100,100);
scdem.applyDynaBoundaryFromFileBySel("faceforce",false,1,0,0,oSel,"sinLoad.txt");

scdem.monitor("node", "xAcc", 5,0,0.5);
scdem.monitor("node", "xAcc", 10,0,0.5);
scdem.monitor("node", "xAcc", 15,0,0.5);

scdem.monitor("node", "xVel", 5,0,0.5);
scdem.monitor("node", "xVel", 10,0,0.5);
scdem.monitor("node", "xVel", 15,0,0.5);


scdem.timeStep= 5e-7;
scdem.dynaSolveGpu(0.02);

//释放GPU端内存
scdem.releaseGpuMem();

print("Solution Finished");
```

## Unified Diff
```diff
--- 案例库-SuperCDEM案例-StressWave-StressWave.js (ground_truth)
+++ 案例库-SuperCDEM案例-StressWave-StressWave.js (generated)
@@ -1,42 +0,0 @@
-setCurDir(getSrcDir());
-
-scdem.outputInterval = 100;
-
-scdem.set("RayleighDamp", 1e-5, 0);
-
-var msh = imesh.importGmsh("Plate.msh");//可更换文件中不同网格数量的网格文件
-scdem.getMesh(msh);
-
-//设置单元模型为线弹性模量
-scdem.setModel("linear");
-scdem.setMat([2000, 1e10, 0.2, 3e6, 1e6, 30.0, 10.0]);
-
-scdem.setIModel("linear");
-scdem.setIMatByElem(50);
-
-//右侧无反射
-oSel1 = new SelElemFaces(scdem);
-oSel1.box(19.999,-100,-100,20.001,100,100);
-scdem.applyNonReflectionBySel(oSel1);
-
-//左侧施加动态边界
-var oSel = new SelElemFaces(scdem);
-oSel.box(-0.01,-100,-100,0.01,100,100);
-scdem.applyDynaBoundaryFromFileBySel("faceforce",false,1,0,0,oSel,"sinLoad.txt");
-
-scdem.monitor("node", "xAcc", 5,0,0.5);
-scdem.monitor("node", "xAcc", 10,0,0.5);
-scdem.monitor("node", "xAcc", 15,0,0.5);
-
-scdem.monitor("node", "xVel", 5,0,0.5);
-scdem.monitor("node", "xVel", 10,0,0.5);
-scdem.monitor("node", "xVel", 15,0,0.5);
-
-
-scdem.timeStep= 5e-7;
-scdem.dynaSolveGpu(0.02);
-
-//释放GPU端内存
-scdem.releaseGpuMem();
-
-print("Solution Finished");
```
