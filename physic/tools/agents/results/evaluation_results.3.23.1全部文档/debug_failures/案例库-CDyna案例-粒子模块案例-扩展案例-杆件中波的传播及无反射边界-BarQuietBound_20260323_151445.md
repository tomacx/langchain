# Failure Analysis: 案例库-CDyna案例-粒子模块案例-扩展案例-杆件中波的传播及无反射边界-BarQuietBound.js

## Query
请编写一个CDyna仿真脚本，实现扩展案例-杆件中波的传播及无反射边界-BarQuietBound，并输出必要的结果与监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// 初始化仿真环境
dyna.Clear();
doc.clearResult();

// 设置全局参数
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 0.0 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("Monitor_Iter 10");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 1e-2");

// 创建杆件几何（长20m，截面0.6m x 0.6m）
var loopid1 = igeo.genRect(0, 0, 0, 20, 0.6, 0, 1);
var loopid2 = igeo.genRect(0, 0, 0, 20, -0.6, 0, 1);

// 创建杆件表面
igeo.genSurface([loopid1, loopid2], 1);

// 生成二维网格
imeshing.genMeshByGmsh(1);

// 从平台获取网格
blkdyn.GetMesh(imeshing);

// 设置块体单元接触面
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置线弹性模型
blkdyn.SetModel("linear");

// 设置材料参数：密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角、组号
blkdyn.SetMatByGroup(2500, 3e10, 0.2, 6e7, 6e7, 36.0, 10.0, 1);

// 设置局部阻尼为0
blkdyn.SetLocalDamp(0.0);

// 打开瑞利阻尼计算开关
dyna.Set("If_Cal_Rayleigh 1");

// 设置刚度阻尼和质量阻尼
blkdyn.SetRayleighDamp(1e-5, 0.0);

// 在杆件右端（x=20m附近）施加无反射边界条件
pdyna.ApplyQuietBoundByCoord(19.8, 20.2, -0.3, 0.3, -0.3, 0.3);

// 在杆件左端（x=0m附近）施加无反射边界条件
pdyna.ApplyQuietBoundByCoord(-0.2, 0.2, -0.3, 0.3, -0.3, 0.3);

// 设置初始速度载荷，在左端产生冲击波
var coeff = new Array(10, 0.0, 0.0);
var x = new Array(-0.2, 0.2);
var y = new Array(-0.3, 0.3);
var z = new Array(-0.3, 0.3);

// 施加动态速度边界条件（半个正弦波，幅值1m/s，周期5ms）
pdyna.ApplyDynaCondSinByCoord("velocity", coeff, 0.0, 1, 2e-3, 0.0, 0.0, 1e-3, x, y, z);

// 设置监测点记录位移和应力历史
dyna.Monitor("block", "xvel", 5, 0.3, 0);
dyna.Monitor("block", "xvel", 10, 0.3, 0);
dyna.Monitor("block", "xvel", 15, 0.3, 0);

dyna.Monitor("block", "sxx", 5, 0.3, 0);
dyna.Monitor("block", "sxx", 10, 0.3, 0);
dyna.Monitor("block", "sxx", 15, 0.3, 0);

// 设置计算总时长（20ms）和时间步长
dyna.Set("Time_Step 1e-6");
dyna.Set("Total_Time 0.02");

// 执行动态计算
dyna.Solve(20000);

// 导出结果信息
doc.ExportResult();
```

## Ground Truth
```javascript
//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());


//设置输出的间隔为500步
dyna.Set("Output_Interval 500");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

//设置三个方向的全局重力加速度为0
dyna.Set("Gravity 0.0 0.0 0.0");

//打开单元大变形计算开关
dyna.Set("Large_Displace 1");

//打开单元接触更新开关
dyna.Set("If_Renew_Contact 1");

//设置接触容差为1cm
dyna.Set("Contact_Detect_Tol 1e-2");

//设置计算时步为5e-5
dyna.Set("Time_Step 1e-6");

//从GiD导入颗粒
pdyna.Import("gid","20m1m-bar.msh");

//设置颗粒模型为脆性断裂模型
pdyna.SetModel("linear");

//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 3e10, 0.2, 3e7, 6e7, 36, 0.0, 0.01);

var fvalue = new Array(0.0, -10, 0.0);



//设定三个方向载荷系数
var coeff=new Array(10,0.0,0.0)
//x方向下限及上限
var x= new Array(-0.2,0.2);
//y方向下限及上限
var y= new Array(-10.0,10.0);
//z方向下限及上限
var z= new Array(-10.0,10.0);
//设定动态速度边界
pdyna.ApplyDynaCondSinByCoord ("velocity", coeff, 0.0, 1, 2e-3, 0.0, 0.0, 1e-3, x, y, z);

pdyna.ApplyQuietBoundByCoord(19.8,21,-1000,1000,-1,1);


dyna.Monitor("particle","pa_xvel",0,0.5,0);
dyna.Monitor("particle","pa_xvel",5,0.5,0);
dyna.Monitor("particle","pa_xvel",10,0.5,0);
dyna.Monitor("particle","pa_xvel",15,0.5,0);
dyna.Monitor("particle","pa_xvel",20,0.5,0);

dyna.Monitor("particle","pa_sxx",0,0.5,0);
dyna.Monitor("particle","pa_sxx",5,0.5,0);
dyna.Monitor("particle","pa_sxx",10,0.5,0);
dyna.Monitor("particle","pa_sxx",15,0.5,0);
dyna.Monitor("particle","pa_sxx",20,0.5,0);

//求解2万步
dyna.DynaCycle(0.015);

//打印信息
print("Solution is ok!");


```

## Unified Diff
```diff
--- 案例库-CDyna案例-粒子模块案例-扩展案例-杆件中波的传播及无反射边界-BarQuietBound.js (ground_truth)
+++ 案例库-CDyna案例-粒子模块案例-扩展案例-杆件中波的传播及无反射边界-BarQuietBound.js (generated)
@@ -1,70 +1,81 @@
-//设置当前路径为JavaScript脚本所在的路径
 setCurDir(getSrcDir());
 
+// 初始化仿真环境
+dyna.Clear();
+doc.clearResult();
 
-//设置输出的间隔为500步
+// 设置全局参数
+dyna.Set("Mechanic_Cal 1");
+dyna.Set("Gravity 0.0 0.0 0.0");
+dyna.Set("Large_Displace 1");
 dyna.Set("Output_Interval 500");
-
-//关闭虚质量计算开关
+dyna.Set("Monitor_Iter 10");
 dyna.Set("If_Virtural_Mass 0");
-
-//设置三个方向的全局重力加速度为0
-dyna.Set("Gravity 0.0 0.0 0.0");
-
-//打开单元大变形计算开关
-dyna.Set("Large_Displace 1");
-
-//打开单元接触更新开关
 dyna.Set("If_Renew_Contact 1");
-
-//设置接触容差为1cm
 dyna.Set("Contact_Detect_Tol 1e-2");
 
-//设置计算时步为5e-5
+// 创建杆件几何（长20m，截面0.6m x 0.6m）
+var loopid1 = igeo.genRect(0, 0, 0, 20, 0.6, 0, 1);
+var loopid2 = igeo.genRect(0, 0, 0, 20, -0.6, 0, 1);
+
+// 创建杆件表面
+igeo.genSurface([loopid1, loopid2], 1);
+
+// 生成二维网格
+imeshing.genMeshByGmsh(1);
+
+// 从平台获取网格
+blkdyn.GetMesh(imeshing);
+
+// 设置块体单元接触面
+blkdyn.CrtIFace();
+blkdyn.UpdateIFaceMesh();
+
+// 设置线弹性模型
+blkdyn.SetModel("linear");
+
+// 设置材料参数：密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角、组号
+blkdyn.SetMatByGroup(2500, 3e10, 0.2, 6e7, 6e7, 36.0, 10.0, 1);
+
+// 设置局部阻尼为0
+blkdyn.SetLocalDamp(0.0);
+
+// 打开瑞利阻尼计算开关
+dyna.Set("If_Cal_Rayleigh 1");
+
+// 设置刚度阻尼和质量阻尼
+blkdyn.SetRayleighDamp(1e-5, 0.0);
+
+// 在杆件右端（x=20m附近）施加无反射边界条件
+pdyna.ApplyQuietBoundByCoord(19.8, 20.2, -0.3, 0.3, -0.3, 0.3);
+
+// 在杆件左端（x=0m附近）施加无反射边界条件
+pdyna.ApplyQuietBoundByCoord(-0.2, 0.2, -0.3, 0.3, -0.3, 0.3);
+
+// 设置初始速度载荷，在左端产生冲击波
+var coeff = new Array(10, 0.0, 0.0);
+var x = new Array(-0.2, 0.2);
+var y = new Array(-0.3, 0.3);
+var z = new Array(-0.3, 0.3);
+
+// 施加动态速度边界条件（半个正弦波，幅值1m/s，周期5ms）
+pdyna.ApplyDynaCondSinByCoord("velocity", coeff, 0.0, 1, 2e-3, 0.0, 0.0, 1e-3, x, y, z);
+
+// 设置监测点记录位移和应力历史
+dyna.Monitor("block", "xvel", 5, 0.3, 0);
+dyna.Monitor("block", "xvel", 10, 0.3, 0);
+dyna.Monitor("block", "xvel", 15, 0.3, 0);
+
+dyna.Monitor("block", "sxx", 5, 0.3, 0);
+dyna.Monitor("block", "sxx", 10, 0.3, 0);
+dyna.Monitor("block", "sxx", 15, 0.3, 0);
+
+// 设置计算总时长（20ms）和时间步长
 dyna.Set("Time_Step 1e-6");
+dyna.Set("Total_Time 0.02");
 
-//从GiD导入颗粒
-pdyna.Import("gid","20m1m-bar.msh");
+// 执行动态计算
+dyna.Solve(20000);
 
-//设置颗粒模型为脆性断裂模型
-pdyna.SetModel("linear");
-
-//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
-pdyna.SetMat(2500, 3e10, 0.2, 3e7, 6e7, 36, 0.0, 0.01);
-
-var fvalue = new Array(0.0, -10, 0.0);
-
-
-
-//设定三个方向载荷系数
-var coeff=new Array(10,0.0,0.0)
-//x方向下限及上限
-var x= new Array(-0.2,0.2);
-//y方向下限及上限
-var y= new Array(-10.0,10.0);
-//z方向下限及上限
-var z= new Array(-10.0,10.0);
-//设定动态速度边界
-pdyna.ApplyDynaCondSinByCoord ("velocity", coeff, 0.0, 1, 2e-3, 0.0, 0.0, 1e-3, x, y, z);
-
-pdyna.ApplyQuietBoundByCoord(19.8,21,-1000,1000,-1,1);
-
-
-dyna.Monitor("particle","pa_xvel",0,0.5,0);
-dyna.Monitor("particle","pa_xvel",5,0.5,0);
-dyna.Monitor("particle","pa_xvel",10,0.5,0);
-dyna.Monitor("particle","pa_xvel",15,0.5,0);
-dyna.Monitor("particle","pa_xvel",20,0.5,0);
-
-dyna.Monitor("particle","pa_sxx",0,0.5,0);
-dyna.Monitor("particle","pa_sxx",5,0.5,0);
-dyna.Monitor("particle","pa_sxx",10,0.5,0);
-dyna.Monitor("particle","pa_sxx",15,0.5,0);
-dyna.Monitor("particle","pa_sxx",20,0.5,0);
-
-//求解2万步
-dyna.DynaCycle(0.015);
-
-//打印信息
-print("Solution is ok!");
-
+// 导出结果信息
+doc.ExportResult();
```
