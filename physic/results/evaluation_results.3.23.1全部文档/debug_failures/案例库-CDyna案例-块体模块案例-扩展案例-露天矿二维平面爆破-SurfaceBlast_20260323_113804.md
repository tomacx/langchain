# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-露天矿二维平面爆破-SurfaceBlast.js

## Query
请编写一个CDyna仿真脚本，实现扩展案例-露天矿二维平面爆破-SurfaceBlast，并输出必要的结果与监测。

## Generated Code
```javascript
// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 清除Mesh模块几何数据
igeo.clear();

// 清除Mesh模块网格数据
imeshing.clear();

// 清除BlockDyna模型数据
dyna.Clear();

// 清除Genvi平台数据
doc.clearResult();

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置三个方向的重力加速度均为0
dyna.Set("Gravity 0.0 0.0 0.0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置计算结果输出间隔为500步
dyna.Set("Output_Interval 500");

// 设置监测信息输出时步为10步
dyna.Set("Monitor_Iter 10");

// 关闭虚质量计算开关
dyna.Set("If_Virtual_Mass 1");

// 打开接触更新开关
dyna.Set("If_Renew_Contact 1");

// 设置接触容差为0
dyna.Set("Contact_Detect_Tolerance 0.0");

// 创建矩形环1
var loopid1 = igeo.genRect(-20, -20, 0, 20, 20, 0, 1.0);

// 创建矩形环2
var loopid2 = igeo.genRect(-8, -8.5, 0, 8, 8.5, 0, 0.2);

// 创建外边界的面（含矩形空洞）
igeo.genSurface([loopid1, loopid2], 1);

// 创建矩形巷道，填实
igeo.genSurface([loopid2], 2);

// 产生二维网格
imeshing.genMeshByGmsh(2);

// BlockDyna从平台下载网格
blkdyn.GetMesh(imeshing);

// 对两侧单元均为组1的公共面进行切割，设置为接触面
blkdyn.CrtIFace();

// 设置接触后，更新网格信息
blkdyn.UpdateIFaceMesh();

// 指定材料参数
blkdyn.SetMat(2300, 1e10, 0.25, 5e6, 5e6, 35.0, 15.0);

// 将接触面模型设定为线弹性模型
blkdyn.SetIModel("linear");

// 虚拟接触面刚度及强度从单元中自动获取
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();
```

## Ground Truth
```javascript
//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置三个方向的重力加速度均为0
dyna.Set("Gravity 0.0 0.0 0.0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//设置计算结果的输出间隔为100步
dyna.Set("Output_Interval 100");

//设置监测信息输出时步为10步
dyna.Set("Monitor_Iter 10");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

dyna.Set("If_Renew_Contact 1");

//打开瑞利阻尼计算开关
dyna.Set("If_Cal_Rayleigh 0")

//从当前文件夹导入Gmsh格式的网格
blkdyn.ImportGrid("gid", "surface.msh");

//对两侧单元均为组1的公共面进行切割，设置为接触面
blkdyn.CrtIFace(1, 1);

//不同组间离散
blkdyn.CrtIFace(-1, -1);

//设置接触后，更新网格信息
blkdyn.UpdateIFaceMesh();

//指定组1的单元本构为线弹性本构
blkdyn.SetModel("linear", 1);

//指定组2的单元本构为JWL爆源模型本构
blkdyn.SetModel("Landau", 2, 100);

//指定组1-2的材料参数
blkdyn.SetMatByGroupRange(2500, 5e10, 0.25, 15e6, 10e6, 40.0, 10.0, 1, 100);

//将接触面模型设定为断裂能模型
blkdyn.SetIModel("FracE");

//指定所有接触面的基础材料参数
blkdyn.SetIMat(1e13, 1e13, 40.0, 15e6, 10e6);

//指定组1与组2交界面的材料参数，摩擦角、粘聚力及抗拉强度均为0.0
blkdyn.SetIMatByGroupInterface(1e13, 1e13, 0.0, 0.0, 0.0, -1, -1);

//指定组1与组2交界面上的断裂能，均为0
blkdyn.SetIFracEnergyByGroupInterface(0.0, 0.0, -1, -1);

//指定组1内部交界面的断裂能，拉伸断裂能100Pa.m，剪切断裂能1000Pa.m
blkdyn.SetIFracEnergyByGroupInterface(100, 1000, 1, 1);

//设置全局的JWL炸药参数，为TNT，材料序号1
var apos = [5.0, 5.0, 0.0];
blkdyn.SetLandauSource(1, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 0.0, 15e-3);

var apos = [10.0, 5.0, 0.0];
blkdyn.SetLandauSource(2, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 25e-3, 15e-3);

var apos = [15.0, 5.0, 0.0];
blkdyn.SetLandauSource(3, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 50e-3, 15e-3);


blkdyn.BindLandauSource(1, 2, 2);
blkdyn.BindLandauSource(2, 3, 3);
blkdyn.BindLandauSource(3, 4, 4);



dyna.Monitor("gvalue","gv_spring_broken_ratio");
dyna.Monitor("gvalue","gv_spring_crack_ratio");

//将局部阻尼设置为0.0
blkdyn.SetLocalDamp(0.05);

//将刚度阻尼系数设置为5e-7，质量阻尼系数设置为0.0
//blkdyn.SetRayleighDamp(5e-7, 0.0);

//设置全局计算时步
dyna.Set("Time_Step 2e-6");

//模型的外边界设定为无反射边界（粘性边界）
blkdyn.SetQuietBoundByCoord(19.999, 31,-100,100,-100,100);
blkdyn.SetQuietBoundByCoord(-100,100,-0.001,0.001,-100,100);


//动力计算1ms
dyna.DynaCycle(1);

//打印提示信息
print("Solution Finished");

```

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-扩展案例-露天矿二维平面爆破-SurfaceBlast.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-扩展案例-露天矿二维平面爆破-SurfaceBlast.js (generated)
@@ -1,101 +1,72 @@
-//设置当前工作路径为JavaScript脚本文件所在路径
+// 设置当前工作路径为JavaScript脚本文件所在路径
 setCurDir(getSrcDir());
 
-//打开力学计算开关
+// 清除Mesh模块几何数据
+igeo.clear();
+
+// 清除Mesh模块网格数据
+imeshing.clear();
+
+// 清除BlockDyna模型数据
+dyna.Clear();
+
+// 清除Genvi平台数据
+doc.clearResult();
+
+// 打开力学计算开关
 dyna.Set("Mechanic_Cal 1");
 
-//设置三个方向的重力加速度均为0
+// 设置三个方向的重力加速度均为0
 dyna.Set("Gravity 0.0 0.0 0.0");
 
-//打开大变形计算开关
+// 打开大变形计算开关
 dyna.Set("Large_Displace 1");
 
-//设置计算结果的输出间隔为100步
-dyna.Set("Output_Interval 100");
+// 设置计算结果输出间隔为500步
+dyna.Set("Output_Interval 500");
 
-//设置监测信息输出时步为10步
+// 设置监测信息输出时步为10步
 dyna.Set("Monitor_Iter 10");
 
-//关闭虚质量计算开关
-dyna.Set("If_Virtural_Mass 0");
+// 关闭虚质量计算开关
+dyna.Set("If_Virtual_Mass 1");
 
+// 打开接触更新开关
 dyna.Set("If_Renew_Contact 1");
 
-//打开瑞利阻尼计算开关
-dyna.Set("If_Cal_Rayleigh 0")
+// 设置接触容差为0
+dyna.Set("Contact_Detect_Tolerance 0.0");
 
-//从当前文件夹导入Gmsh格式的网格
-blkdyn.ImportGrid("gid", "surface.msh");
+// 创建矩形环1
+var loopid1 = igeo.genRect(-20, -20, 0, 20, 20, 0, 1.0);
 
-//对两侧单元均为组1的公共面进行切割，设置为接触面
-blkdyn.CrtIFace(1, 1);
+// 创建矩形环2
+var loopid2 = igeo.genRect(-8, -8.5, 0, 8, 8.5, 0, 0.2);
 
-//不同组间离散
-blkdyn.CrtIFace(-1, -1);
+// 创建外边界的面（含矩形空洞）
+igeo.genSurface([loopid1, loopid2], 1);
 
-//设置接触后，更新网格信息
+// 创建矩形巷道，填实
+igeo.genSurface([loopid2], 2);
+
+// 产生二维网格
+imeshing.genMeshByGmsh(2);
+
+// BlockDyna从平台下载网格
+blkdyn.GetMesh(imeshing);
+
+// 对两侧单元均为组1的公共面进行切割，设置为接触面
+blkdyn.CrtIFace();
+
+// 设置接触后，更新网格信息
 blkdyn.UpdateIFaceMesh();
 
-//指定组1的单元本构为线弹性本构
-blkdyn.SetModel("linear", 1);
+// 指定材料参数
+blkdyn.SetMat(2300, 1e10, 0.25, 5e6, 5e6, 35.0, 15.0);
 
-//指定组2的单元本构为JWL爆源模型本构
-blkdyn.SetModel("Landau", 2, 100);
+// 将接触面模型设定为线弹性模型
+blkdyn.SetIModel("linear");
 
-//指定组1-2的材料参数
-blkdyn.SetMatByGroupRange(2500, 5e10, 0.25, 15e6, 10e6, 40.0, 10.0, 1, 100);
-
-//将接触面模型设定为断裂能模型
-blkdyn.SetIModel("FracE");
-
-//指定所有接触面的基础材料参数
-blkdyn.SetIMat(1e13, 1e13, 40.0, 15e6, 10e6);
-
-//指定组1与组2交界面的材料参数，摩擦角、粘聚力及抗拉强度均为0.0
-blkdyn.SetIMatByGroupInterface(1e13, 1e13, 0.0, 0.0, 0.0, -1, -1);
-
-//指定组1与组2交界面上的断裂能，均为0
-blkdyn.SetIFracEnergyByGroupInterface(0.0, 0.0, -1, -1);
-
-//指定组1内部交界面的断裂能，拉伸断裂能100Pa.m，剪切断裂能1000Pa.m
-blkdyn.SetIFracEnergyByGroupInterface(100, 1000, 1, 1);
-
-//设置全局的JWL炸药参数，为TNT，材料序号1
-var apos = [5.0, 5.0, 0.0];
-blkdyn.SetLandauSource(1, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 0.0, 15e-3);
-
-var apos = [10.0, 5.0, 0.0];
-blkdyn.SetLandauSource(2, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 25e-3, 15e-3);
-
-var apos = [15.0, 5.0, 0.0];
-blkdyn.SetLandauSource(3, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 50e-3, 15e-3);
-
-
-blkdyn.BindLandauSource(1, 2, 2);
-blkdyn.BindLandauSource(2, 3, 3);
-blkdyn.BindLandauSource(3, 4, 4);
-
-
-
-dyna.Monitor("gvalue","gv_spring_broken_ratio");
-dyna.Monitor("gvalue","gv_spring_crack_ratio");
-
-//将局部阻尼设置为0.0
-blkdyn.SetLocalDamp(0.05);
-
-//将刚度阻尼系数设置为5e-7，质量阻尼系数设置为0.0
-//blkdyn.SetRayleighDamp(5e-7, 0.0);
-
-//设置全局计算时步
-dyna.Set("Time_Step 2e-6");
-
-//模型的外边界设定为无反射边界（粘性边界）
-blkdyn.SetQuietBoundByCoord(19.999, 31,-100,100,-100,100);
-blkdyn.SetQuietBoundByCoord(-100,100,-0.001,0.001,-100,100);
-
-
-//动力计算1ms
-dyna.DynaCycle(1);
-
-//打印提示信息
-print("Solution Finished");
+// 虚拟接触面刚度及强度从单元中自动获取
+blkdyn.SetIStiffByElem(1);
+blkdyn.SetIStrengthByElem();
```
