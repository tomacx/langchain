# Failure Analysis: 案例库-SuperCDEM案例-UCTest-UCT2D.js

## Query
请编写一个SuperCDEM仿真脚本，实现UCTest-UCT2D，并输出必要的结果与监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// 初始化仿真控制参数
bcdem.outputInterval = 100;
bcdem.isVirtualMass = 1;
bcdem.virtualStep = 0.6;
bcdem.ubr = 1e-4;
bcdem.localDamp = 0.5;

// 导入二维网格模型
var msh = imesh.importGmsh("UCT2d.msh");
bcdem.getMesh(msh);

// 设置单元模型为线弹性
bcdem.setModel("linear");

// 设置单元材料参数 [密度, 杨氏模量, 泊松比, 粘聚力, 抗拉强度, 摩擦角, 膨胀角]
oMat = {
    density: 2500,
    young: 1e10,
    poission: 0.25,
    cohesive: 3e6,
    tension: 3e6,
    friction: 40,
    dilatation: 10
};
bcdem.setMat(oMat);

// 设置界面接触模型为脆性断裂模型
bcdem.setIModel("brittleMC");
bcdem.setIMatByElem(10);

// 施加位移边界条件 - 底部固定
oSel1 = new SelNodes(bcdem);
oSel1.box(-1e5, -0.001, -1e5, 1e5, 0.001, 1e5);
bcdem.setVel(oSel1, "y", 0);

// 施加位移边界条件 - 顶部压缩速度
oSel2 = new SelNodes(bcdem);
oSel2.box(-1e5, 0.099, -1e5, 1e5, 0.101, 1e5);
bcdem.setVel(oSel2, "y", -2e-8);

// 设置监测信息 - 应力应变监测
oSel = new SelNodes(bcdem);
oSel.box(-1e5, -0.099, -1e5, 1e5, 0.099, 1e5);
bcdem.regionMonitor("elem", "stress", 1, oSel);

// 设置监测信息 - 体积变化监测
oSel = new SelNodes(bcdem);
oSel.box(-1e5, -0.099, -1e5, 1e5, 0.099, 1e5);
bcdem.regionMonitor("elem", "volume", 2, oSel);

// 求解计算（启用GPU加速）
bcdem.solveGpu(30000);

// 释放GPU内存
bcdem.releaseGpuMem();

// 输出完成信息
print("Solution Finished");
```

## Ground Truth
```javascript
//设置文件路径
setCurDir(getSrcDir());

// 设置系统不平衡率为1e-4
scdem.ubr = 1e-4;

//设置云图更新间隔
scdem.outputInterval = 100;

//打开虚质量开关
scdem.isVirtualMass = 1;

//设置虚时步
scdem.virtualStep = 0.6;

//导入计算网格
var msh = imesh.importGmsh("UCT2d.msh");
scdem.getMesh(msh);

//施加单元材料参数(含单元模型设置)
oMat = new Object;
oMat.density = 2500;
oMat.young = 1e10;
oMat.poission = 0.25;
oMat.cohesive = 3e6;
oMat.tension = 3e6;
oMat.friction = 40;
oMat.dilatation = 10;
scdem.setModel("linear");
scdem.setMat(oMat);

//施加界面材料参数(含接触面模型设置)
scdem.setIModel("brittleMC");
scdem.setIMatByElem(10);

//施加位移边界条件
oSel1 = new SelNodes(scdem);
oSel1.box(-1e5,0.099,-1e5,1e5,0.101,1e5);
scdem.setVel(oSel1, "y", -2e-8);
oSel2 = new SelNodes(scdem);
oSel2.box(-1e5,-0.001,-1e5,1e5,0.001,1e5);
scdem.setVel(oSel2, "y", 0.0);

//设置局部阻尼
scdem.localDamp = 0.8

//求解30000步
scdem.solveGpu(30000);

//释放GPU端内存
scdem.releaseGpuMem();

print("Solution Finished");
```

## Unified Diff
```diff
--- 案例库-SuperCDEM案例-UCTest-UCT2D.js (ground_truth)
+++ 案例库-SuperCDEM案例-UCTest-UCT2D.js (generated)
@@ -1,53 +1,60 @@
-//设置文件路径
 setCurDir(getSrcDir());
 
-// 设置系统不平衡率为1e-4
-scdem.ubr = 1e-4;
+// 初始化仿真控制参数
+bcdem.outputInterval = 100;
+bcdem.isVirtualMass = 1;
+bcdem.virtualStep = 0.6;
+bcdem.ubr = 1e-4;
+bcdem.localDamp = 0.5;
 
-//设置云图更新间隔
-scdem.outputInterval = 100;
+// 导入二维网格模型
+var msh = imesh.importGmsh("UCT2d.msh");
+bcdem.getMesh(msh);
 
-//打开虚质量开关
-scdem.isVirtualMass = 1;
+// 设置单元模型为线弹性
+bcdem.setModel("linear");
 
-//设置虚时步
-scdem.virtualStep = 0.6;
+// 设置单元材料参数 [密度, 杨氏模量, 泊松比, 粘聚力, 抗拉强度, 摩擦角, 膨胀角]
+oMat = {
+    density: 2500,
+    young: 1e10,
+    poission: 0.25,
+    cohesive: 3e6,
+    tension: 3e6,
+    friction: 40,
+    dilatation: 10
+};
+bcdem.setMat(oMat);
 
-//导入计算网格
-var msh = imesh.importGmsh("UCT2d.msh");
-scdem.getMesh(msh);
+// 设置界面接触模型为脆性断裂模型
+bcdem.setIModel("brittleMC");
+bcdem.setIMatByElem(10);
 
-//施加单元材料参数(含单元模型设置)
-oMat = new Object;
-oMat.density = 2500;
-oMat.young = 1e10;
-oMat.poission = 0.25;
-oMat.cohesive = 3e6;
-oMat.tension = 3e6;
-oMat.friction = 40;
-oMat.dilatation = 10;
-scdem.setModel("linear");
-scdem.setMat(oMat);
+// 施加位移边界条件 - 底部固定
+oSel1 = new SelNodes(bcdem);
+oSel1.box(-1e5, -0.001, -1e5, 1e5, 0.001, 1e5);
+bcdem.setVel(oSel1, "y", 0);
 
-//施加界面材料参数(含接触面模型设置)
-scdem.setIModel("brittleMC");
-scdem.setIMatByElem(10);
+// 施加位移边界条件 - 顶部压缩速度
+oSel2 = new SelNodes(bcdem);
+oSel2.box(-1e5, 0.099, -1e5, 1e5, 0.101, 1e5);
+bcdem.setVel(oSel2, "y", -2e-8);
 
-//施加位移边界条件
-oSel1 = new SelNodes(scdem);
-oSel1.box(-1e5,0.099,-1e5,1e5,0.101,1e5);
-scdem.setVel(oSel1, "y", -2e-8);
-oSel2 = new SelNodes(scdem);
-oSel2.box(-1e5,-0.001,-1e5,1e5,0.001,1e5);
-scdem.setVel(oSel2, "y", 0.0);
+// 设置监测信息 - 应力应变监测
+oSel = new SelNodes(bcdem);
+oSel.box(-1e5, -0.099, -1e5, 1e5, 0.099, 1e5);
+bcdem.regionMonitor("elem", "stress", 1, oSel);
 
-//设置局部阻尼
-scdem.localDamp = 0.8
+// 设置监测信息 - 体积变化监测
+oSel = new SelNodes(bcdem);
+oSel.box(-1e5, -0.099, -1e5, 1e5, 0.099, 1e5);
+bcdem.regionMonitor("elem", "volume", 2, oSel);
 
-//求解30000步
-scdem.solveGpu(30000);
+// 求解计算（启用GPU加速）
+bcdem.solveGpu(30000);
 
-//释放GPU端内存
-scdem.releaseGpuMem();
+// 释放GPU内存
+bcdem.releaseGpuMem();
 
+// 输出完成信息
 print("Solution Finished");
```
