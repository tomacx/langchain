# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-含圆孔试样冲击生热及热传导-SampleImpact-不考虑热传导.js

## Query
请编写一个CDyna仿真脚本，实现含圆孔试样冲击生热及热传导-SampleImpact-不考虑热传导，并输出必要的结果与监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// 初始化环境
dyna.Clear();

// 设置基础参数
dyna.Set("Gravity 0.0 0.0 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Output_Interval 500");
dyna.Set("Moniter_Iter 10");

// 关闭热传导计算模块
dyna.Set("Config_Heat 0");
dyna.Set("Heat_Cal 0");
dyna.Set("If_Contact_Transf_Heat 0");

// 创建含圆孔的试样几何模型
igeo.clear();
var geom = igeo.CreateBox([0, 0, 0], [100, 20, 20]);
igeo.AddHole(geom, [50, 10, 0], 10, 0, 0);

// 生成网格
imeshing.clear();
var mesh = imeshing.genBox("sample", geom, [10, 10, 10]);

// 导入网格到块体模块
blkdyn.ImportGrid("gid", mesh);

// 设置试样材料属性（密度、比热容，导热系数置零）
blkdyn.SetMat(2500, 3e8, 0.22, 8e6, 5e6, 35, 10);
blkdyn.SetIMat(1e9, 1e9, 20.0, 0, 0);

// 创建冲击体部件
var impactGeom = igeo.CreateBox([0, 0, 0], [50, 20, 20]);
var impactMesh = imeshing.genBox("impact", impactGeom, [10, 10, 10]);
blkdyn.ImportGrid("impactGid", impactMesh);

// 设置冲击体材料属性
blkdyn.SetMat(impactGid, 2500, 3e8, 0.22, 8e6, 5e6, 35, 10);
blkdyn.SetIMat(impactGid, 1e9, 1e9, 20.0, 0, 0);

// 设置冲击体初始速度边界条件
blkdyn.ApplyConditionByCoord("vel", impactGid, [0, 0, -500], 0, 0, 0, 0, 0, 0, false);

// 固定试样底部
blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);

// 设置时间步长
dyna.Set("Time_Step 1e-6");

// 在圆孔中心区域添加监测点
var centerNode = blkdyn.GetNodeID(50, 10, 0);
blkdyn.Monitor("center", "temp", centerNode, "Coord0", 0);
blkdyn.Monitor("center", "energy", centerNode, "Coord0", 0);

// 设置输出请求记录节点温度及内能变化
blkdyn.SetOutput("node_temp", "temp");
blkdyn.SetOutput("node_energy", "energy");

// 执行求解
dyna.DynaCycle(10000);

print("**********************求解完毕**********************");
```

## Ground Truth
```javascript
setCurDir(getSrcDir());

imeshing.clear();
igeo.clear();
dyna.Clear();

var Width = 0.1;
var Height = 0.2;
var fSize = 0.0025;
var fRad = 0.01;
var CircleSum = 2;
var Dist = Height / (CircleSum + 1);

//冲击速度 m/s
var ImpactVel = 1.0; 

var ComputeTime = Height / ImpactVel * 0.5;

var id1 = igeo.genRect(0,0,0,Width, Height, 0, fSize);
var aLineLoop = new Array();
aLineLoop.push(id1);

for(var i = 0; i < CircleSum; i++)
{
var id2 = igeo.genCircle(0.5 * Width , Dist * (i + 1),  0.0 , fRad ,fSize);
aLineLoop.push(id2);
}

igeo. genSurface ( aLineLoop, 1 );

imeshing.genMeshByGmsh(2);


/////////核心计算


//设置三个方向的重力加速度值
dyna.Set("Gravity 0.0 0.0 0.0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//设置云图输出间隔为500
dyna.Set("Output_Interval 500");

//设置监测信息提取间隔为10时步
dyna.Set("Moniter_Iter 10");

//打开虚质量计算开关
dyna.Set("If_Virtural_Mass 0");


//设置单元体积膨胀断裂应变及等效剪切断裂应变
dyna.Set("Block_Soften_Value 0.003 0.009");

blkdyn.GetMesh(imeshing);

blkdyn.SetModel("SoftenMC");

//设置组号为1的单元材料，基岩
blkdyn.SetMat(2500, 3e10, 0.22, 8e6, 5e6, 35, 10);

blkdyn.SetLocalDamp(0.01);

blkdyn.FixV("y", -ImpactVel, "y", Height-0.001, Height+0.001);

blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);


dyna.TimeStepCorrect(0.5);


dyna.Monitor("block", "ydis", 0.5 * Width, Height, 0);
dyna.Monitor("block", "syy", 0.5 * Width, Height, 0);

dyna.DynaCycle(ComputeTime);


print("**********************求解完毕**********************");





```

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-扩展案例-含圆孔试样冲击生热及热传导-SampleImpact-不考虑热传导.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-扩展案例-含圆孔试样冲击生热及热传导-SampleImpact-不考虑热传导.js (generated)
@@ -1,83 +1,64 @@
 setCurDir(getSrcDir());
 
-imeshing.clear();
-igeo.clear();
+// 初始化环境
 dyna.Clear();
 
-var Width = 0.1;
-var Height = 0.2;
-var fSize = 0.0025;
-var fRad = 0.01;
-var CircleSum = 2;
-var Dist = Height / (CircleSum + 1);
-
-//冲击速度 m/s
-var ImpactVel = 1.0; 
-
-var ComputeTime = Height / ImpactVel * 0.5;
-
-var id1 = igeo.genRect(0,0,0,Width, Height, 0, fSize);
-var aLineLoop = new Array();
-aLineLoop.push(id1);
-
-for(var i = 0; i < CircleSum; i++)
-{
-var id2 = igeo.genCircle(0.5 * Width , Dist * (i + 1),  0.0 , fRad ,fSize);
-aLineLoop.push(id2);
-}
-
-igeo. genSurface ( aLineLoop, 1 );
-
-imeshing.genMeshByGmsh(2);
-
-
-/////////核心计算
-
-
-//设置三个方向的重力加速度值
+// 设置基础参数
 dyna.Set("Gravity 0.0 0.0 0.0");
-
-//打开大变形计算开关
 dyna.Set("Large_Displace 1");
-
-//设置云图输出间隔为500
+dyna.Set("If_Renew_Contact 1");
 dyna.Set("Output_Interval 500");
-
-//设置监测信息提取间隔为10时步
 dyna.Set("Moniter_Iter 10");
 
-//打开虚质量计算开关
-dyna.Set("If_Virtural_Mass 0");
+// 关闭热传导计算模块
+dyna.Set("Config_Heat 0");
+dyna.Set("Heat_Cal 0");
+dyna.Set("If_Contact_Transf_Heat 0");
 
+// 创建含圆孔的试样几何模型
+igeo.clear();
+var geom = igeo.CreateBox([0, 0, 0], [100, 20, 20]);
+igeo.AddHole(geom, [50, 10, 0], 10, 0, 0);
 
-//设置单元体积膨胀断裂应变及等效剪切断裂应变
-dyna.Set("Block_Soften_Value 0.003 0.009");
+// 生成网格
+imeshing.clear();
+var mesh = imeshing.genBox("sample", geom, [10, 10, 10]);
 
-blkdyn.GetMesh(imeshing);
+// 导入网格到块体模块
+blkdyn.ImportGrid("gid", mesh);
 
-blkdyn.SetModel("SoftenMC");
+// 设置试样材料属性（密度、比热容，导热系数置零）
+blkdyn.SetMat(2500, 3e8, 0.22, 8e6, 5e6, 35, 10);
+blkdyn.SetIMat(1e9, 1e9, 20.0, 0, 0);
 
-//设置组号为1的单元材料，基岩
-blkdyn.SetMat(2500, 3e10, 0.22, 8e6, 5e6, 35, 10);
+// 创建冲击体部件
+var impactGeom = igeo.CreateBox([0, 0, 0], [50, 20, 20]);
+var impactMesh = imeshing.genBox("impact", impactGeom, [10, 10, 10]);
+blkdyn.ImportGrid("impactGid", impactMesh);
 
-blkdyn.SetLocalDamp(0.01);
+// 设置冲击体材料属性
+blkdyn.SetMat(impactGid, 2500, 3e8, 0.22, 8e6, 5e6, 35, 10);
+blkdyn.SetIMat(impactGid, 1e9, 1e9, 20.0, 0, 0);
 
-blkdyn.FixV("y", -ImpactVel, "y", Height-0.001, Height+0.001);
+// 设置冲击体初始速度边界条件
+blkdyn.ApplyConditionByCoord("vel", impactGid, [0, 0, -500], 0, 0, 0, 0, 0, 0, false);
 
-blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);
+// 固定试样底部
+blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);
 
+// 设置时间步长
+dyna.Set("Time_Step 1e-6");
 
-dyna.TimeStepCorrect(0.5);
+// 在圆孔中心区域添加监测点
+var centerNode = blkdyn.GetNodeID(50, 10, 0);
+blkdyn.Monitor("center", "temp", centerNode, "Coord0", 0);
+blkdyn.Monitor("center", "energy", centerNode, "Coord0", 0);
 
+// 设置输出请求记录节点温度及内能变化
+blkdyn.SetOutput("node_temp", "temp");
+blkdyn.SetOutput("node_energy", "energy");
 
-dyna.Monitor("block", "ydis", 0.5 * Width, Height, 0);
-dyna.Monitor("block", "syy", 0.5 * Width, Height, 0);
-
-dyna.DynaCycle(ComputeTime);
-
+// 执行求解
+dyna.DynaCycle(10000);
 
 print("**********************求解完毕**********************");
-
-
-
-
```
