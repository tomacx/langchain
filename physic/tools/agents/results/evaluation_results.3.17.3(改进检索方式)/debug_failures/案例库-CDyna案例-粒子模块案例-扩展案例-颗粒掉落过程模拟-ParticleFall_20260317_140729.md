# Failure Analysis: 案例库-CDyna案例-粒子模块案例-扩展案例-颗粒掉落过程模拟-ParticleFall.js

## Query
请编写一个CDyna仿真脚本，实现扩展案例-颗粒掉落过程模拟-ParticleFall，并输出必要的结果与监测。

## Generated Code
```javascript

```

## Ground Truth
```javascript
setCurDir(getSrcDir());

dyna.Set("Output_Interval 200");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");

dyna.Set("Gravity 0 0 -9.8")

rdface.Import("ansys","Bound.dat");

pdyna.CreateByCoord(15000, 2, 2, 2, 8, 0,[400, 600], [400, 600],[310, 500]);

pdyna.SetModel("brittleMC");
pdyna.SetMat(2500, 1e9, 0.25, 0, 0, 25, 0.0, 0.1);

dyna.TimeStepCorrect(0.8);

dyna.Solve(10000);
```

## Unified Diff
```diff
--- 案例库-CDyna案例-粒子模块案例-扩展案例-颗粒掉落过程模拟-ParticleFall.js (ground_truth)
+++ 案例库-CDyna案例-粒子模块案例-扩展案例-颗粒掉落过程模拟-ParticleFall.js (generated)
@@ -1,19 +0,0 @@
-setCurDir(getSrcDir());
-
-dyna.Set("Output_Interval 200");
-dyna.Set("If_Renew_Contact 1");
-dyna.Set("Large_Displace 1");
-dyna.Set("If_Virtural_Mass 0");
-
-dyna.Set("Gravity 0 0 -9.8")
-
-rdface.Import("ansys","Bound.dat");
-
-pdyna.CreateByCoord(15000, 2, 2, 2, 8, 0,[400, 600], [400, 600],[310, 500]);
-
-pdyna.SetModel("brittleMC");
-pdyna.SetMat(2500, 1e9, 0.25, 0, 0, 25, 0.0, 0.1);
-
-dyna.TimeStepCorrect(0.8);
-
-dyna.Solve(10000);
```
