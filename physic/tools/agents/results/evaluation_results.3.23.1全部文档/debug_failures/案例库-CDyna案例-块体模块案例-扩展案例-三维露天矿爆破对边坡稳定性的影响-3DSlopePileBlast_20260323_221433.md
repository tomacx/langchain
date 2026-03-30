# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-三维露天矿爆破对边坡稳定性的影响-3DSlopePileBlast.js

## Query
请编写一个CDyna仿真脚本，实现扩展案例-三维露天矿爆破对边坡稳定性的影响-3DSlopePileBlast，并输出必要的结果与监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// ==================== 1. 初始化求解器环境 ====================
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Output_Interval 5000");
dyna.Set("Monitor_Iter 100");
dyna.Set("Contact_Detect_Tol 5.0e-3");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.5");

// ==================== 2. 构建起爆点坐标数组 ====================
var pos = new Array(3);
pos[0] = [10, 8, 45];   // 炮孔1位置
pos[1] = [15, 8, 45];   // 炮孔2位置
pos[2] = [20, 8, 45];   // 炮孔3位置

// ==================== 3. 配置JWL爆源气体逸散特征参数 ====================
// 特征时间tc=5e-4s，特征指数n=1.2，爆源ID范围1-10
blkdyn.SetJWLGasLeakMat(5e-4, 1.2, 1, 10);

// ==================== 4. 绑定JWL爆源到模型单元 ====================
// 假设爆源单元ID范围为1-10，绑定到对应单元
blkdyn.BindJWLSource(1, 10);

// ==================== 5. 设置监测点获取位移数据 ====================
// 监测边坡关键节点在X方向的位移（坐标点附近）
dyna.Monitor("block", "xdis", 10.0, 8.0, 45.0);
// 监测Y方向位移
dyna.Monitor("block", "ydis", 10.0, 8.0, 45.0);
// 监测Z方向位移
dyna.Monitor("block", "zdis", 10.0, 8.0, 45.0);

// ==================== 6. 配置块体损伤监测指标 ====================
// 总破坏度 gv_block_broken_ratio
dyna.Monitor("gvalue", "gv_block_broken_ratio");
// 破裂度 gv_block_crack_ratio
dyna.Monitor("gvalue", "gv_block_crack_ratio");
// 等效破裂体积 gv_block_equiv_frac_volume
dyna.Monitor("gvalue", "gv_block_equiv_frac_volume");

// ==================== 7. 设定仿真时间参数 ====================
// 时间步长dt=1e-6s，总运行时间t_end=0.5s
dyna.Set("Time_Step 1e-6");
dyna.Set("Total_Time 0.5");

// ==================== 8. 启动求解器执行动力学计算 ====================
blkdyn.Solve();

// ==================== 9. 导出结果文件 ====================
doc.ExportResult("slope_blast_result.dat");
```

## Ground Truth
```javascript
//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置三个方向的重力加速度均为0
dyna.Set("Gravity 0.0 -9.8 0.0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//设置计算结果的输出间隔为100步
dyna.Set("Output_Interval 500");

//设置监测信息输出时步为10步
dyna.Set("Moniter_Iter 10");

dyna.Set("If_Cal_Bar 0");


//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

//从当前文件夹导入Gmsh格式的网格
blkdyn.ImportGrid("gid", "SlopeBlast.msh");

//指定组1的单元本构为线弹性本构
blkdyn.SetModel("linear", 1);

//指定组1-2的材料参数
blkdyn.SetMat(2500, 5e10, 0.25, 15e6, 10e6, 40.0, 10.0);


//固定模型四周及底部的法向速度
blkdyn.FixV("x",0.0,"x", -0.001,0.001);
blkdyn.FixV("x",0.0,"x", 79.99,80.01);

blkdyn.FixV("z",0.0,"z", -0.001,0.001);
blkdyn.FixV("z",0.0,"z", 39.99,40.01);

blkdyn.FixV("y",0.0,"y", -21, -19.99);



//创建第1个炮孔
var fArrayCoord1 = [17, 5, 10.0];
var fArrayCoord2 = [17, -3, 10.0];
bar.CreateByCoord("BlastHole1", fArrayCoord1, fArrayCoord2, 10);

//创建第2个炮孔
var fArrayCoord1 = [17, 5, 15.0];
var fArrayCoord2 = [17, -3, 15.0];
bar.CreateByCoord("BlastHole1", fArrayCoord1, fArrayCoord2, 10);

//创建第3个炮孔
var fArrayCoord1 = [17, 5, 20.0];
var fArrayCoord2 = [17, -3, 20.0];
bar.CreateByCoord("BlastHole1", fArrayCoord1, fArrayCoord2, 10);

//创建第4个炮孔
var fArrayCoord1 = [17, 5, 25.0];
var fArrayCoord2 = [17, -3, 25.0];
bar.CreateByCoord("BlastHole1", fArrayCoord1, fArrayCoord2, 10);

//创建第5个炮孔
var fArrayCoord1 = [17, 5, 30.0];
var fArrayCoord2 = [17, -3, 30.0];
bar.CreateByCoord("BlastHole1", fArrayCoord1, fArrayCoord2, 10);

var BarProp1 = [0.25, 7800.0, 1e10, 0.25, 235e6, 235e6, 1e6, 35, 1e9, 0.8, 0.0];

//指定自由段的锚索材料
bar.SetPropByID(BarProp1, 1, 10, 1, 15);

dyna.Solve();

blkdyn.SetModel("MC", 1);


dyna.Solve();

dyna.Save("initial.sav");


blkdyn.FreeV("x","x", -0.001,0.001);
blkdyn.FreeV("x","x", 79.99,80.01);

blkdyn.FreeV("z","z", -0.001,0.001);
blkdyn.FreeV("z","z", 39.99,40.01);

blkdyn.FreeV("y","y", -21, -19.99);


//模型的外边界设定为无反射边界（粘性边界）
blkdyn.SetQuietBoundByCoord(-0.001,0.001,-100,100,-100,100);
blkdyn.SetQuietBoundByCoord(79.99,80.01,-100,100,-100,100);

blkdyn.SetQuietBoundByCoord(-100,100,-100,100, -0.001,0.001);
blkdyn.SetQuietBoundByCoord(-100,100,-100,100, 39.99,40.01);

blkdyn.SetQuietBoundByCoord(-100,100,-21, -19.99,-100,100);



var apos = [17, -3, 10.0];
blkdyn.SetLandauSource(1, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 0.0, 15e-3);

var apos = [17, -3, 15.0];
blkdyn.SetLandauSource(2, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 25e-3, 15e-3);

var apos = [17, -3, 20.0];
blkdyn.SetLandauSource(3, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 50e-3, 15e-3);

var apos = [17, -3, 25.0];
blkdyn.SetLandauSource(4, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 75e-3, 15e-3);

var apos = [17, -3, 30.0];
blkdyn.SetLandauSource(5, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 100e-3, 15e-3);


bar.BindLandauSource(1, 1, 1);
bar.BindLandauSource(2, 2, 2);
bar.BindLandauSource(3, 3, 3);
bar.BindLandauSource(4, 4, 4);
bar.BindLandauSource(5, 5, 5);


dyna.Monitor("block","yvel", 32,12,0);

dyna.Monitor("block","yvel", 34,24,0);

dyna.Monitor("block","yvel", 46,36,0);

dyna.Monitor("block","yvel", 58,48,0);

dyna.Monitor("gvalue","gv_block_broken_ratio");
dyna.Monitor("gvalue","gv_block_crack_ratio");

//将局部阻尼设置为0.0
blkdyn.SetLocalDamp(0.00);

//打开瑞利阻尼计算开关
dyna.Set("If_Cal_Rayleigh 1")

//将刚度阻尼系数设置为5e-6，质量阻尼系数设置为20.0
blkdyn.SetRayleighDamp(5e-6, 20.0);


var BaseValue = [0,0,0];
var Grad      = [0, 0, 0, 0, 0, 0, 0, 0, 0];

//对模型所有单元初始化地应力
blkdyn.InitConditionByCoord("displace", BaseValue, Grad,  -1e3,1e3, -1e3,1e3, -1e3,1e3);



//设置全局计算时步
dyna.Set("If_Virtural_Mass 0");


dyna.Set("Time_Step 1e-5");
dyna.Set("Time_Now 0.0");


dyna.Set("If_Cal_Bar 1");

//动力计算1ms
dyna.DynaCycle(0.2);

//打印提示信息
print("Solution Finished");

```

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-扩展案例-三维露天矿爆破对边坡稳定性的影响-3DSlopePileBlast.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-扩展案例-三维露天矿爆破对边坡稳定性的影响-3DSlopePileBlast.js (generated)
@@ -1,172 +1,53 @@
-//设置当前工作路径为JavaScript脚本文件所在路径
 setCurDir(getSrcDir());
 
-//打开力学计算开关
+// ==================== 1. 初始化求解器环境 ====================
 dyna.Set("Mechanic_Cal 1");
+dyna.Set("Gravity 0.0 -9.8 0.0");
+dyna.Set("Large_Displace 1");
+dyna.Set("If_Renew_Contact 1");
+dyna.Set("Output_Interval 5000");
+dyna.Set("Monitor_Iter 100");
+dyna.Set("Contact_Detect_Tol 5.0e-3");
+dyna.Set("If_Virtural_Mass 1");
+dyna.Set("Virtural_Step 0.5");
 
-//设置三个方向的重力加速度均为0
-dyna.Set("Gravity 0.0 -9.8 0.0");
+// ==================== 2. 构建起爆点坐标数组 ====================
+var pos = new Array(3);
+pos[0] = [10, 8, 45];   // 炮孔1位置
+pos[1] = [15, 8, 45];   // 炮孔2位置
+pos[2] = [20, 8, 45];   // 炮孔3位置
 
-//打开大变形计算开关
-dyna.Set("Large_Displace 1");
+// ==================== 3. 配置JWL爆源气体逸散特征参数 ====================
+// 特征时间tc=5e-4s，特征指数n=1.2，爆源ID范围1-10
+blkdyn.SetJWLGasLeakMat(5e-4, 1.2, 1, 10);
 
-//设置计算结果的输出间隔为100步
-dyna.Set("Output_Interval 500");
+// ==================== 4. 绑定JWL爆源到模型单元 ====================
+// 假设爆源单元ID范围为1-10，绑定到对应单元
+blkdyn.BindJWLSource(1, 10);
 
-//设置监测信息输出时步为10步
-dyna.Set("Moniter_Iter 10");
+// ==================== 5. 设置监测点获取位移数据 ====================
+// 监测边坡关键节点在X方向的位移（坐标点附近）
+dyna.Monitor("block", "xdis", 10.0, 8.0, 45.0);
+// 监测Y方向位移
+dyna.Monitor("block", "ydis", 10.0, 8.0, 45.0);
+// 监测Z方向位移
+dyna.Monitor("block", "zdis", 10.0, 8.0, 45.0);
 
-dyna.Set("If_Cal_Bar 0");
+// ==================== 6. 配置块体损伤监测指标 ====================
+// 总破坏度 gv_block_broken_ratio
+dyna.Monitor("gvalue", "gv_block_broken_ratio");
+// 破裂度 gv_block_crack_ratio
+dyna.Monitor("gvalue", "gv_block_crack_ratio");
+// 等效破裂体积 gv_block_equiv_frac_volume
+dyna.Monitor("gvalue", "gv_block_equiv_frac_volume");
 
+// ==================== 7. 设定仿真时间参数 ====================
+// 时间步长dt=1e-6s，总运行时间t_end=0.5s
+dyna.Set("Time_Step 1e-6");
+dyna.Set("Total_Time 0.5");
 
-//关闭虚质量计算开关
-dyna.Set("If_Virtural_Mass 1");
+// ==================== 8. 启动求解器执行动力学计算 ====================
+blkdyn.Solve();
 
-//从当前文件夹导入Gmsh格式的网格
-blkdyn.ImportGrid("gid", "SlopeBlast.msh");
-
-//指定组1的单元本构为线弹性本构
-blkdyn.SetModel("linear", 1);
-
-//指定组1-2的材料参数
-blkdyn.SetMat(2500, 5e10, 0.25, 15e6, 10e6, 40.0, 10.0);
-
-
-//固定模型四周及底部的法向速度
-blkdyn.FixV("x",0.0,"x", -0.001,0.001);
-blkdyn.FixV("x",0.0,"x", 79.99,80.01);
-
-blkdyn.FixV("z",0.0,"z", -0.001,0.001);
-blkdyn.FixV("z",0.0,"z", 39.99,40.01);
-
-blkdyn.FixV("y",0.0,"y", -21, -19.99);
-
-
-
-//创建第1个炮孔
-var fArrayCoord1 = [17, 5, 10.0];
-var fArrayCoord2 = [17, -3, 10.0];
-bar.CreateByCoord("BlastHole1", fArrayCoord1, fArrayCoord2, 10);
-
-//创建第2个炮孔
-var fArrayCoord1 = [17, 5, 15.0];
-var fArrayCoord2 = [17, -3, 15.0];
-bar.CreateByCoord("BlastHole1", fArrayCoord1, fArrayCoord2, 10);
-
-//创建第3个炮孔
-var fArrayCoord1 = [17, 5, 20.0];
-var fArrayCoord2 = [17, -3, 20.0];
-bar.CreateByCoord("BlastHole1", fArrayCoord1, fArrayCoord2, 10);
-
-//创建第4个炮孔
-var fArrayCoord1 = [17, 5, 25.0];
-var fArrayCoord2 = [17, -3, 25.0];
-bar.CreateByCoord("BlastHole1", fArrayCoord1, fArrayCoord2, 10);
-
-//创建第5个炮孔
-var fArrayCoord1 = [17, 5, 30.0];
-var fArrayCoord2 = [17, -3, 30.0];
-bar.CreateByCoord("BlastHole1", fArrayCoord1, fArrayCoord2, 10);
-
-var BarProp1 = [0.25, 7800.0, 1e10, 0.25, 235e6, 235e6, 1e6, 35, 1e9, 0.8, 0.0];
-
-//指定自由段的锚索材料
-bar.SetPropByID(BarProp1, 1, 10, 1, 15);
-
-dyna.Solve();
-
-blkdyn.SetModel("MC", 1);
-
-
-dyna.Solve();
-
-dyna.Save("initial.sav");
-
-
-blkdyn.FreeV("x","x", -0.001,0.001);
-blkdyn.FreeV("x","x", 79.99,80.01);
-
-blkdyn.FreeV("z","z", -0.001,0.001);
-blkdyn.FreeV("z","z", 39.99,40.01);
-
-blkdyn.FreeV("y","y", -21, -19.99);
-
-
-//模型的外边界设定为无反射边界（粘性边界）
-blkdyn.SetQuietBoundByCoord(-0.001,0.001,-100,100,-100,100);
-blkdyn.SetQuietBoundByCoord(79.99,80.01,-100,100,-100,100);
-
-blkdyn.SetQuietBoundByCoord(-100,100,-100,100, -0.001,0.001);
-blkdyn.SetQuietBoundByCoord(-100,100,-100,100, 39.99,40.01);
-
-blkdyn.SetQuietBoundByCoord(-100,100,-21, -19.99,-100,100);
-
-
-
-var apos = [17, -3, 10.0];
-blkdyn.SetLandauSource(1, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 0.0, 15e-3);
-
-var apos = [17, -3, 15.0];
-blkdyn.SetLandauSource(2, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 25e-3, 15e-3);
-
-var apos = [17, -3, 20.0];
-blkdyn.SetLandauSource(3, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 50e-3, 15e-3);
-
-var apos = [17, -3, 25.0];
-blkdyn.SetLandauSource(4, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 75e-3, 15e-3);
-
-var apos = [17, -3, 30.0];
-blkdyn.SetLandauSource(5, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 100e-3, 15e-3);
-
-
-bar.BindLandauSource(1, 1, 1);
-bar.BindLandauSource(2, 2, 2);
-bar.BindLandauSource(3, 3, 3);
-bar.BindLandauSource(4, 4, 4);
-bar.BindLandauSource(5, 5, 5);
-
-
-dyna.Monitor("block","yvel", 32,12,0);
-
-dyna.Monitor("block","yvel", 34,24,0);
-
-dyna.Monitor("block","yvel", 46,36,0);
-
-dyna.Monitor("block","yvel", 58,48,0);
-
-dyna.Monitor("gvalue","gv_block_broken_ratio");
-dyna.Monitor("gvalue","gv_block_crack_ratio");
-
-//将局部阻尼设置为0.0
-blkdyn.SetLocalDamp(0.00);
-
-//打开瑞利阻尼计算开关
-dyna.Set("If_Cal_Rayleigh 1")
-
-//将刚度阻尼系数设置为5e-6，质量阻尼系数设置为20.0
-blkdyn.SetRayleighDamp(5e-6, 20.0);
-
-
-var BaseValue = [0,0,0];
-var Grad      = [0, 0, 0, 0, 0, 0, 0, 0, 0];
-
-//对模型所有单元初始化地应力
-blkdyn.InitConditionByCoord("displace", BaseValue, Grad,  -1e3,1e3, -1e3,1e3, -1e3,1e3);
-
-
-
-//设置全局计算时步
-dyna.Set("If_Virtural_Mass 0");
-
-
-dyna.Set("Time_Step 1e-5");
-dyna.Set("Time_Now 0.0");
-
-
-dyna.Set("If_Cal_Bar 1");
-
-//动力计算1ms
-dyna.DynaCycle(0.2);
-
-//打印提示信息
-print("Solution Finished");
+// ==================== 9. 导出结果文件 ====================
+doc.ExportResult("slope_blast_result.dat");
```
