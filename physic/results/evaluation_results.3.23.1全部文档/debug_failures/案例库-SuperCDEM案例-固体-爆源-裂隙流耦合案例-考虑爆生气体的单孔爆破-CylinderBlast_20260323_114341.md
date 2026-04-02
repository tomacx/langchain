# Failure Analysis: 案例库-SuperCDEM案例-固体-爆源-裂隙流耦合案例-考虑爆生气体的单孔爆破-CylinderBlast.js

## Query
请编写一个SuperCDEM仿真脚本，实现裂隙流耦合案例-考虑爆生气体的单孔爆破-CylinderBlast，并输出必要的结果与监测。

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
scdem.set("Config_FracSeepage", 1);
scdem.set("FracSeepage_Cal", 1);
scdem.set("Seepage_Mode", 2); // 气体流动模式
scdem.set("FS_Solid_Interaction", 1);

var msh = imesh.importGmsh("Cylinder-5mm.msh");
scdem.getMesh(msh);

// 设置材料模型和参数
scdem.setModel("linear");
scdem.setMat([1700, 3e9, 0.2, 14.4e6, 3e6, 30, 15]);

// 裂隙渗流模块设置
SFracsp.createGridFromBlock(1);
SFracsp.setProp([0.00, 1e7, 12e-13, 12e-9]);
SFracsp.setPropByCylinder([170.0, 1e7, 12e-13, 12e-9], 0.0, 0.0, -10.0, 0.0, 0.0, 10.0, 0.0, 3.05e-3);

// 高压气体计算C值
var pressure = 20e6;
var Cof_C = pressure / 170;

scdem.set("EoSCof_C", Cof_C);

SFracsp.applyConditionByCylinder("pp", pressure, 0, 0, 0, 0.0, 0.0, -10.0, 0.0, 0.0, 10.0, 0.0, 3.2e-3);

scdem.timeStep = 1e-7;
scdem.dynaSolveGpu(0.01);
print("finish");
```

## Ground Truth
```javascript
setCurDir(getSrcDir());

scdem.outputInterval = 2000;
scdem.monitorIter = 10;

scdem.isVirtualMass = 0;

scdem.set("isLargeDisplace", 1);
scdem.set("RayleighDamp", 4e-7, 0);

scdem.set("isVtk", 1);

// scdem.set("specialOutputInterval", 0, 20000, 500);

// 裂隙渗流模块参数设置
scdem.set("Config_FracSeepage", 1); // 开启裂隙气体流动
scdem.set("FracSeepage_Cal", 1); // 进行裂隙气体流动计算
scdem.set("Seepage_Mode", 2); // 流动模式设置为气体
scdem.set("FS_Solid_Interaction", 1); // 开启裂隙场和固体场耦合计算
scdem.set("FS_Gas_Index", 4/3); //气体常数值设置 

scdem.set("FS_MaxWid", 1e-2);
scdem.set("FS_MinWid", 0.0); //最小开度设置为0.0
scdem.set("FS_Frac_Start_Cal", 1); // 开启破裂才进行气体压力计算
scdem.set("isJWLBlastGasFlow", 1); // 开启JWL爆生气体流动计算
scdem.set("GasFlowModel", 2); //开启湍流流动模型

scdem.set("CSRoughness", 4e-4); //设置粗糙度为0.1，这个值后续可能需要调整
scdem.set("GasEos", 2); //采用多方方程进行气体流动计算
scdem.set("ErosionMassThreshold", 0.05); //删除炸药单元的临界质量比，炸药单元质量衰减至该值后，认为炸药单元不再其作用，溶蚀掉

var msh = imesh.importGmsh("Cylinder-130W.msh");//可更换文件中不同网格数量的网格文件
scdem.getMesh(msh);

scdem.setModel("linear");
scdem.setModel(1, "JWL");

scdem.setMat([2660, 54e9, 0.16, 6e6, 6e6, 54, 10]); //岩石材料参数

scdem.setMat(1, [931, 20e9, 0.2, 1e3, 1e3, 30, 10]); //材料参数

// JWL参数设置
// Usage: scdem.setJWLBlastSource(<iNum, density, E0, A, B, R1, R2, Omiga, Pcj, D, BeginTime, LastTime, [ArrayFirePos]> ;
var pos = [0, 0, 0.075];
// scdem.setJWLBlastSource(1, 1100, 4.1e9, 162.7e9, 10.82e9, 5.4, 1.8, 0.25, 7.5e9, 5100, 0.0, 1, pos);
// scdem.setJWLBlastSource(1, 1600, 7e9, 371.2e9, 3.2e9, 4.2, 0.95, 0.3, 20e9, 6800, 0.0, 1e-2, pos);
scdem.setJWLBlastSource(1, 931, 2.484e9, 49.46e9, 1.891e6, 3.907, 1.118, 0.333, 5.15e9, 4160, 0.0, 1e-2, pos);

scdem.bindJWLBlastSource(1, 1, 1);

scdem.setIModel("Linear", 1);
scdem.setIModel("FracE", 2);
scdem.setIModel("FracE", 1, 2); 

scdem.setContactFractureEnergy(20,50);
scdem.setContactFractureEnergy(0, 0, 1, 2); // 炸药和堵塞的接触面断裂能为0

// 设置炸药单元与固体单元的接触面参数，强度全部为0设置大刚度，防止网格畸变
scdem.setIMatByElem(10.0);

scdem.setIMat(1e15, 1e15, 0, 0, 0, 1, 2);

//底部固定边界 + 四周无反射
var oSel1 = new SelElemFaces(scdem);
oSel1.cylinder(0, 0, -1, 0, 0, 1, 0.07, 0.0721);
scdem.applyNonReflectionBySel(oSel1);

var oSel2 = new SelElemFaces(scdem);
oSel2.box(-100,-100,-0.0001,100,100,0.0001);
scdem.setVel(oSel2, "xyz", 0);

/////////////////////裂隙网格部分
SFracsp.setFlowCrackFace(2);
SFracsp.disableFlowCrackByGroup(1, 2);
SFracsp.createGridFromBlock(2);

SFracsp.setProp([0, 1e7, 12e-13, 0]);

// 模型顶部为大气压边界条件
SFracsp.applyConditionByCoord("pp", 0, 0, 0, 0, -100, 100, -100, 100, -0.001, 0.001);
SFracsp.applyConditionByCoord("pp", 0, 0, 0, 0, -100, 100, -100, 100, -0.001, 0.001);
SFracsp.applyConditionByCylinder("pp", 0, 0, 0, 0, 0, 0, -100, 0, 0, 100, 0.071, 0.0721);

scdem.monitor("elem", "sxx", 0, 0, 0.075);
scdem.monitor("fracsp", "outMass");
scdem.monitor("fracsp", "exGasDens");
scdem.monitor("spring", "crackRatio", 2, 2);

scdem.monitor("elem", "sxx", 0.002, 0, 0.075);
scdem.monitor("elem", "sxx", 0.003, 0, 0.075);
scdem.monitor("elem", "sxx", 0.004, 0, 0.075);
scdem.monitor("elem", "sxx", 0.005, 0, 0.075);
scdem.monitor("elem", "sxx", 0.006, 0, 0.075);
scdem.monitor("elem", "sxx", 0.007, 0, 0.075);

scdem.timeStep = 1e-9;
scdem.dynaSolveGpu(500e-6);

print("finish!");
```

## Unified Diff
```diff
--- 案例库-SuperCDEM案例-固体-爆源-裂隙流耦合案例-考虑爆生气体的单孔爆破-CylinderBlast.js (ground_truth)
+++ 案例库-SuperCDEM案例-固体-爆源-裂隙流耦合案例-考虑爆生气体的单孔爆破-CylinderBlast.js (generated)
@@ -1,99 +1,42 @@
 setCurDir(getSrcDir());
 
-scdem.outputInterval = 2000;
-scdem.monitorIter = 10;
+scdem.outputInterval = 100;
+scdem.monitorIter = 100;
+
+scdem.set("isLargeDisplace", 1);
+
+scdem.gravity = [0, 0, 0];
 
 scdem.isVirtualMass = 0;
 
-scdem.set("isLargeDisplace", 1);
-scdem.set("RayleighDamp", 4e-7, 0);
-
-scdem.set("isVtk", 1);
-
-// scdem.set("specialOutputInterval", 0, 20000, 500);
+scdem.set("ubr", 1e-4);
 
 // 裂隙渗流模块参数设置
-scdem.set("Config_FracSeepage", 1); // 开启裂隙气体流动
-scdem.set("FracSeepage_Cal", 1); // 进行裂隙气体流动计算
-scdem.set("Seepage_Mode", 2); // 流动模式设置为气体
-scdem.set("FS_Solid_Interaction", 1); // 开启裂隙场和固体场耦合计算
-scdem.set("FS_Gas_Index", 4/3); //气体常数值设置 
+scdem.set("Config_FracSeepage", 1);
+scdem.set("FracSeepage_Cal", 1);
+scdem.set("Seepage_Mode", 2); // 气体流动模式
+scdem.set("FS_Solid_Interaction", 1);
 
-scdem.set("FS_MaxWid", 1e-2);
-scdem.set("FS_MinWid", 0.0); //最小开度设置为0.0
-scdem.set("FS_Frac_Start_Cal", 1); // 开启破裂才进行气体压力计算
-scdem.set("isJWLBlastGasFlow", 1); // 开启JWL爆生气体流动计算
-scdem.set("GasFlowModel", 2); //开启湍流流动模型
-
-scdem.set("CSRoughness", 4e-4); //设置粗糙度为0.1，这个值后续可能需要调整
-scdem.set("GasEos", 2); //采用多方方程进行气体流动计算
-scdem.set("ErosionMassThreshold", 0.05); //删除炸药单元的临界质量比，炸药单元质量衰减至该值后，认为炸药单元不再其作用，溶蚀掉
-
-var msh = imesh.importGmsh("Cylinder-130W.msh");//可更换文件中不同网格数量的网格文件
+var msh = imesh.importGmsh("Cylinder-5mm.msh");
 scdem.getMesh(msh);
 
+// 设置材料模型和参数
 scdem.setModel("linear");
-scdem.setModel(1, "JWL");
+scdem.setMat([1700, 3e9, 0.2, 14.4e6, 3e6, 30, 15]);
 
-scdem.setMat([2660, 54e9, 0.16, 6e6, 6e6, 54, 10]); //岩石材料参数
+// 裂隙渗流模块设置
+SFracsp.createGridFromBlock(1);
+SFracsp.setProp([0.00, 1e7, 12e-13, 12e-9]);
+SFracsp.setPropByCylinder([170.0, 1e7, 12e-13, 12e-9], 0.0, 0.0, -10.0, 0.0, 0.0, 10.0, 0.0, 3.05e-3);
 
-scdem.setMat(1, [931, 20e9, 0.2, 1e3, 1e3, 30, 10]); //材料参数
+// 高压气体计算C值
+var pressure = 20e6;
+var Cof_C = pressure / 170;
 
-// JWL参数设置
-// Usage: scdem.setJWLBlastSource(<iNum, density, E0, A, B, R1, R2, Omiga, Pcj, D, BeginTime, LastTime, [ArrayFirePos]> ;
-var pos = [0, 0, 0.075];
-// scdem.setJWLBlastSource(1, 1100, 4.1e9, 162.7e9, 10.82e9, 5.4, 1.8, 0.25, 7.5e9, 5100, 0.0, 1, pos);
-// scdem.setJWLBlastSource(1, 1600, 7e9, 371.2e9, 3.2e9, 4.2, 0.95, 0.3, 20e9, 6800, 0.0, 1e-2, pos);
-scdem.setJWLBlastSource(1, 931, 2.484e9, 49.46e9, 1.891e6, 3.907, 1.118, 0.333, 5.15e9, 4160, 0.0, 1e-2, pos);
+scdem.set("EoSCof_C", Cof_C);
 
-scdem.bindJWLBlastSource(1, 1, 1);
+SFracsp.applyConditionByCylinder("pp", pressure, 0, 0, 0, 0.0, 0.0, -10.0, 0.0, 0.0, 10.0, 0.0, 3.2e-3);
 
-scdem.setIModel("Linear", 1);
-scdem.setIModel("FracE", 2);
-scdem.setIModel("FracE", 1, 2); 
-
-scdem.setContactFractureEnergy(20,50);
-scdem.setContactFractureEnergy(0, 0, 1, 2); // 炸药和堵塞的接触面断裂能为0
-
-// 设置炸药单元与固体单元的接触面参数，强度全部为0设置大刚度，防止网格畸变
-scdem.setIMatByElem(10.0);
-
-scdem.setIMat(1e15, 1e15, 0, 0, 0, 1, 2);
-
-//底部固定边界 + 四周无反射
-var oSel1 = new SelElemFaces(scdem);
-oSel1.cylinder(0, 0, -1, 0, 0, 1, 0.07, 0.0721);
-scdem.applyNonReflectionBySel(oSel1);
-
-var oSel2 = new SelElemFaces(scdem);
-oSel2.box(-100,-100,-0.0001,100,100,0.0001);
-scdem.setVel(oSel2, "xyz", 0);
-
-/////////////////////裂隙网格部分
-SFracsp.setFlowCrackFace(2);
-SFracsp.disableFlowCrackByGroup(1, 2);
-SFracsp.createGridFromBlock(2);
-
-SFracsp.setProp([0, 1e7, 12e-13, 0]);
-
-// 模型顶部为大气压边界条件
-SFracsp.applyConditionByCoord("pp", 0, 0, 0, 0, -100, 100, -100, 100, -0.001, 0.001);
-SFracsp.applyConditionByCoord("pp", 0, 0, 0, 0, -100, 100, -100, 100, -0.001, 0.001);
-SFracsp.applyConditionByCylinder("pp", 0, 0, 0, 0, 0, 0, -100, 0, 0, 100, 0.071, 0.0721);
-
-scdem.monitor("elem", "sxx", 0, 0, 0.075);
-scdem.monitor("fracsp", "outMass");
-scdem.monitor("fracsp", "exGasDens");
-scdem.monitor("spring", "crackRatio", 2, 2);
-
-scdem.monitor("elem", "sxx", 0.002, 0, 0.075);
-scdem.monitor("elem", "sxx", 0.003, 0, 0.075);
-scdem.monitor("elem", "sxx", 0.004, 0, 0.075);
-scdem.monitor("elem", "sxx", 0.005, 0, 0.075);
-scdem.monitor("elem", "sxx", 0.006, 0, 0.075);
-scdem.monitor("elem", "sxx", 0.007, 0, 0.075);
-
-scdem.timeStep = 1e-9;
-scdem.dynaSolveGpu(500e-6);
-
-print("finish!");
+scdem.timeStep = 1e-7;
+scdem.dynaSolveGpu(0.01);
+print("finish");
```
