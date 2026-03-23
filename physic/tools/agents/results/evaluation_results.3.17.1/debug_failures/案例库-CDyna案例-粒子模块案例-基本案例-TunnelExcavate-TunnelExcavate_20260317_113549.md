# Failure Analysis: 案例库-CDyna案例-粒子模块案例-基本案例-TunnelExcavate-TunnelExcavate.js

## Query
请编写一个CDyna仿真脚本，实现基本案例-TunnelExcavate-TunnelExcavate，并输出必要的结果与监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// 清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

// 清除GDEM-Env中的结果数据
doc.clearResult();

// ==================== 1. 初始化求解器设置 ====================
dyna.Set("Mechanic_Cal 1");
dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Output_Interval 500");
dyna.Set("Moniter_Iter 100");
dyna.Set("Time_Step 1e-3");
dyna.Set("Gravity 0.0 -9.8 0.0");

// ==================== 2. 生成椭圆形隧道几何模型 ====================
// 模型高度30m, 宽度40m, 椭圆竖向半轴3m, 水平半轴4m
// 隧道底部到模型底部距离10m, 模型网格尺寸1.0m, 隧道网格尺寸0.2m
// ShellFlag=1表示包含衬砌, 衬砌厚度0.3m
igeo.genEllipseTunnelS(30, 40, 3, 4, 10, 1.0, 0.2, 1, 0.3);

// ==================== 3. 获取网格并设置材料 ====================
var msh = blkdyn.GetMesh();

// 设置实体单元为线弹性模型
blkdyn.SetModel("linear");

// 设置固体单元的材料参数
// 密度(kg/m³), 弹性模量(Pa), 泊松比, 抗拉强度(Pa), 粘聚力(Pa), 内摩擦角(度), 局部阻尼, 粘性阻尼系数
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e1, 1e1, 25.0, 10.0, 1);

// ==================== 4. 应用边界约束 ====================
// 固定模型底部Y方向位移
blkdyn.FixVByCoord("xyz", 0.0, -1e10, 1e10, -1e10, 0.001, -1e10, 1e10);

// 固定模型左右两侧X方向位移
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 39.999, 40.01);

// ==================== 5. 计算瑞利阻尼 ====================
blkdyn.CalRayleighDamp();

// ==================== 6. 设置监测点 ====================
// 监测典型测点的竖向位移
dyna.Monitor("block", "ydis", 20, 15, 0);
dyna.Monitor("block", "ydis", 20, 20, 0);
dyna.Monitor("block", "ydis", 20, 25, 0);

// 监测典型测点的竖向应力
dyna.Monitor("block", "syy", 15, 13, 0);
dyna.Monitor("block", "syy", 15, 16, 0);
dyna.Monitor("block", "syy", 15, 19, 0);

// ==================== 7. 初始平衡计算 ====================
// 求解至稳定状态
dyna.Solve();

// ==================== 8. 配置开挖序列 ====================
// 定义开挖区域坐标范围 [xmin, xmax, ymin, ymax, zmin, zmax]
// 隧道中心位置约在[20, 15, 0], 半径约4m
var excavateRange = [16, 24, 11, 19, -1, 1];

// 逐步进行开挖操作
for(var i = 1; i <= 3; i++) {
    // 设定开挖区域的单元模型为none(挖除)
    blkdyn.SetModel("none", i);
    
    // 求解至稳定
    dyna.Solve();
    
    // 输出监测数据
    dyna.OutputMonitorData();
    
    // 推送结果信息至平台
    if(i % 1 == 0) {
        dyna.PutStep(1, i, 0.1);
    }
}

// ==================== 9. 最终结果输出 ====================
// 输出监测信息到Result文件夹
dyna.OutputMonitorData();

// 输出模型结果到其他软件可导入的格式
dyna.OutputModelResult();

print("隧道开挖仿真完成!");
```

## Ground Truth
```javascript
//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

//清除GDEM-Env中的结果数据
doc.clearResult();

//设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

//设置颗粒间的接触容差
dyna.Set("Contact_Detect_Tol 8e-2");

//设置求解不平衡率
dyna.Set("UnBalance_Ratio 1e-4");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//设置计算时步
dyna.Set("Time_Step 1e-3");

//导入gid格式的网格
pdyna.Import("gid","tunnel100m-60m.msh");

//设置颗粒接触为线弹性模型
pdyna.SetModel("linear");

//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e8, 0.25, 1e5, 5e5, 35, 0.8, 0.0);

//固定模型左右两侧及底部的法向速度
pdyna.FixV("x",0.0,"x", -1,2.0);
pdyna.FixV("x",0.0,"x", 98,101);
pdyna.FixV("y",0.0,"y", -1,2);

//固定模型左右两侧及底部的转角速度
pdyna.FixRotaV("xyz",0.0,"x", -1,2.0);
pdyna.FixRotaV("xyz",0.0,"x", 98,101);
pdyna.FixRotaV("xyz",0.0,"y", -1,2);

//设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

//求解至稳定
dyna.Solve();

//将颗粒接触模型设定为脆性模型
pdyna.SetModel("brittleMC");

//求解至稳定
dyna.Solve();

//单独设定局部阻尼为0
pdyna.SetSingleMat("LocalDamp", 0.0);

//单独设定粘性阻尼比为0.05
pdyna.SetSingleMat("ViscDamp", 0.05);

//对坐标范围内的颗粒进行挖空操作
pdyna.SetModelByCoord("none",46,54,30,40,-1,1);

//计算至稳定
dyna.Solve();

```

## Unified Diff
```diff
--- 案例库-CDyna案例-粒子模块案例-基本案例-TunnelExcavate-TunnelExcavate.js (ground_truth)
+++ 案例库-CDyna案例-粒子模块案例-基本案例-TunnelExcavate-TunnelExcavate.js (generated)
@@ -1,69 +1,88 @@
-//设置当前路径为JavaScript脚本所在的路径
 setCurDir(getSrcDir());
 
-//清除GDEM-Pdyna计算核心中的内存数据
+// 清除GDEM-Pdyna计算核心中的内存数据
 dyna.Clear();
 
-//清除GDEM-Env中的结果数据
+// 清除GDEM-Env中的结果数据
 doc.clearResult();
 
-//设置结果的输出间隔为500步
+// ==================== 1. 初始化求解器设置 ====================
+dyna.Set("Mechanic_Cal 1");
+dyna.Set("UnBalance_Ratio 1e-5");
 dyna.Set("Output_Interval 500");
-
-//设置重力加速度
+dyna.Set("Moniter_Iter 100");
+dyna.Set("Time_Step 1e-3");
 dyna.Set("Gravity 0.0 -9.8 0.0");
 
-//设置颗粒间的接触容差
-dyna.Set("Contact_Detect_Tol 8e-2");
+// ==================== 2. 生成椭圆形隧道几何模型 ====================
+// 模型高度30m, 宽度40m, 椭圆竖向半轴3m, 水平半轴4m
+// 隧道底部到模型底部距离10m, 模型网格尺寸1.0m, 隧道网格尺寸0.2m
+// ShellFlag=1表示包含衬砌, 衬砌厚度0.3m
+igeo.genEllipseTunnelS(30, 40, 3, 4, 10, 1.0, 0.2, 1, 0.3);
 
-//设置求解不平衡率
-dyna.Set("UnBalance_Ratio 1e-4");
+// ==================== 3. 获取网格并设置材料 ====================
+var msh = blkdyn.GetMesh();
 
-//关闭虚拟质量开关
-dyna.Set("If_Virtural_Mass 0");
+// 设置实体单元为线弹性模型
+blkdyn.SetModel("linear");
 
-//设置计算时步
-dyna.Set("Time_Step 1e-3");
+// 设置固体单元的材料参数
+// 密度(kg/m³), 弹性模量(Pa), 泊松比, 抗拉强度(Pa), 粘聚力(Pa), 内摩擦角(度), 局部阻尼, 粘性阻尼系数
+blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e1, 1e1, 25.0, 10.0, 1);
 
-//导入gid格式的网格
-pdyna.Import("gid","tunnel100m-60m.msh");
+// ==================== 4. 应用边界约束 ====================
+// 固定模型底部Y方向位移
+blkdyn.FixVByCoord("xyz", 0.0, -1e10, 1e10, -1e10, 0.001, -1e10, 1e10);
 
-//设置颗粒接触为线弹性模型
-pdyna.SetModel("linear");
+// 固定模型左右两侧X方向位移
+blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
+blkdyn.FixV("x", 0.0, "x", 39.999, 40.01);
 
-//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
-pdyna.SetMat(2500, 1e8, 0.25, 1e5, 5e5, 35, 0.8, 0.0);
+// ==================== 5. 计算瑞利阻尼 ====================
+blkdyn.CalRayleighDamp();
 
-//固定模型左右两侧及底部的法向速度
-pdyna.FixV("x",0.0,"x", -1,2.0);
-pdyna.FixV("x",0.0,"x", 98,101);
-pdyna.FixV("y",0.0,"y", -1,2);
+// ==================== 6. 设置监测点 ====================
+// 监测典型测点的竖向位移
+dyna.Monitor("block", "ydis", 20, 15, 0);
+dyna.Monitor("block", "ydis", 20, 20, 0);
+dyna.Monitor("block", "ydis", 20, 25, 0);
 
-//固定模型左右两侧及底部的转角速度
-pdyna.FixRotaV("xyz",0.0,"x", -1,2.0);
-pdyna.FixRotaV("xyz",0.0,"x", 98,101);
-pdyna.FixRotaV("xyz",0.0,"y", -1,2);
+// 监测典型测点的竖向应力
+dyna.Monitor("block", "syy", 15, 13, 0);
+dyna.Monitor("block", "syy", 15, 16, 0);
+dyna.Monitor("block", "syy", 15, 19, 0);
 
-//设置接触容差为0
-dyna.Set("Contact_Detect_Tol 0.0");
-
-//求解至稳定
+// ==================== 7. 初始平衡计算 ====================
+// 求解至稳定状态
 dyna.Solve();
 
-//将颗粒接触模型设定为脆性模型
-pdyna.SetModel("brittleMC");
+// ==================== 8. 配置开挖序列 ====================
+// 定义开挖区域坐标范围 [xmin, xmax, ymin, ymax, zmin, zmax]
+// 隧道中心位置约在[20, 15, 0], 半径约4m
+var excavateRange = [16, 24, 11, 19, -1, 1];
 
-//求解至稳定
-dyna.Solve();
+// 逐步进行开挖操作
+for(var i = 1; i <= 3; i++) {
+    // 设定开挖区域的单元模型为none(挖除)
+    blkdyn.SetModel("none", i);
+    
+    // 求解至稳定
+    dyna.Solve();
+    
+    // 输出监测数据
+    dyna.OutputMonitorData();
+    
+    // 推送结果信息至平台
+    if(i % 1 == 0) {
+        dyna.PutStep(1, i, 0.1);
+    }
+}
 
-//单独设定局部阻尼为0
-pdyna.SetSingleMat("LocalDamp", 0.0);
+// ==================== 9. 最终结果输出 ====================
+// 输出监测信息到Result文件夹
+dyna.OutputMonitorData();
 
-//单独设定粘性阻尼比为0.05
-pdyna.SetSingleMat("ViscDamp", 0.05);
+// 输出模型结果到其他软件可导入的格式
+dyna.OutputModelResult();
 
-//对坐标范围内的颗粒进行挖空操作
-pdyna.SetModelByCoord("none",46,54,30,40,-1,1);
-
-//计算至稳定
-dyna.Solve();
+print("隧道开挖仿真完成!");
```
