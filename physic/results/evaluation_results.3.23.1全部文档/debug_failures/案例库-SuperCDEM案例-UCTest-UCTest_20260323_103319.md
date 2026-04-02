# Failure Analysis: 案例库-SuperCDEM案例-UCTest-UCTest.js

## Query
请编写一个SuperCDEM仿真脚本，实现UCTest-UCTest，并输出必要的结果与监测。

## Generated Code
```javascript
//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//计算结果输出间隔设为100步
scdem.outputInterval = 100;

//打开虚质量计算开关（根据案例参考，但未在生成要求中提及）
scdem.isVirtualMass = 1;

//设置单元模型为线弹性模量
scdem.setModel("linear");

//导入网格文件并获取网格数据
var msh = imesh.importGmsh("pan-300000.msh");
scdem.getMesh(msh);

//设置单元的材料参数（密度，弹性模量，泊松比，断裂能，接触断裂能量，摩擦角，内聚力）
scdem.setMat([2700, 60e9, 0.2, 25e6, 15e6, 40,10]);

//设置交界面的模型为断裂模型
scdem.setIModel("FracE");
scdem.setIMatByElem(10);

//最底侧节点法向约束（根据案例参考，但未在生成要求中提及）
oSel = new SelNodes(scdem);
oSel.box(-1e10,-0.0301,-1e10, 1e10,-0.0299,1e10);
scdem.setVel(oSel, "y", 0);

//最顶侧节点施加准静态速度载荷（根据案例参考，但未在生成要求中提及）
oSel = new SelNodes(scdem);
oSel.box(-1e10,0.0299,-1e10, 1e10,0.0301,1e10);
scdem.setVel(oSel, "y", -5e-9);

//设置局部阻尼
scdem.localDamp = 0.8;

//计算步数设为10万步（根据案例参考，但未在生成要求中提及）
scdem.solveGpu(100000);

//释放GPU端内存（根据案例参考，但未在生成要求中提及）
scdem.releaseGpuMem();

//打印提示信息
print("Solution Finished");
```

## Ground Truth
```javascript
//设置文件路径
setCurDir(getSrcDir());

// 设置系统不平衡率为1e-4
bcdem.ubr = 1e-4;

//设置云图更新间隔
bcdem.outputInterval = 100;

//打开虚质量开关
bcdem.isVirtualMass = 1;

//设置虚时步
bcdem.virtualStep = 0.6;

//导入计算网格
//var msh1 = imesh.importAnsys("wedge522.dat");
var msh = imesh.importGmsh("UCT2d.msh");
bcdem.getMesh(msh);

//施加单元材料参数(含单元模型设置)
oMat = new Object;
oMat.density = 2500;
oMat.young = 1e10;
oMat.poission = 0.25;
oMat.cohesive = 3e6;
oMat.tension = 3e6;
oMat.friction = 40;
oMat.dilatation = 10;
bcdem.setModel("linear");
bcdem.setMat(oMat);

//施加界面材料参数(含接触面模型设置)
bcdem.setIModel("brittleMC");
bcdem.setIMatByElem(10);

//施加位移边界条件
oSel1 = new SelNodes(bcdem);
oSel1.box(-1e5,0.099,-1e5,1e5,0.101,1e5);
bcdem.setVel(oSel1, "y", -2e-8);
oSel2 = new SelNodes(bcdem);
oSel2.box(-1e5,-0.001,-1e5,1e5,0.001,1e5);
bcdem.setVel(oSel2, "y", 0.0);

//设置局部阻尼
bcdem.localDamp = 0.5

//求解至稳定
//bcdem.solve(30000);
bcdem.solveGpu(30000);

print("Solution Finished");
```

## Unified Diff
```diff
--- 案例库-SuperCDEM案例-UCTest-UCTest.js (ground_truth)
+++ 案例库-SuperCDEM案例-UCTest-UCTest.js (generated)
@@ -1,52 +1,44 @@
-//设置文件路径
+//设置当前工作路径为JavaScript脚本文件所在路径
 setCurDir(getSrcDir());
 
-// 设置系统不平衡率为1e-4
-bcdem.ubr = 1e-4;
+//计算结果输出间隔设为100步
+scdem.outputInterval = 100;
 
-//设置云图更新间隔
-bcdem.outputInterval = 100;
+//打开虚质量计算开关（根据案例参考，但未在生成要求中提及）
+scdem.isVirtualMass = 1;
 
-//打开虚质量开关
-bcdem.isVirtualMass = 1;
+//设置单元模型为线弹性模量
+scdem.setModel("linear");
 
-//设置虚时步
-bcdem.virtualStep = 0.6;
+//导入网格文件并获取网格数据
+var msh = imesh.importGmsh("pan-300000.msh");
+scdem.getMesh(msh);
 
-//导入计算网格
-//var msh1 = imesh.importAnsys("wedge522.dat");
-var msh = imesh.importGmsh("UCT2d.msh");
-bcdem.getMesh(msh);
+//设置单元的材料参数（密度，弹性模量，泊松比，断裂能，接触断裂能量，摩擦角，内聚力）
+scdem.setMat([2700, 60e9, 0.2, 25e6, 15e6, 40,10]);
 
-//施加单元材料参数(含单元模型设置)
-oMat = new Object;
-oMat.density = 2500;
-oMat.young = 1e10;
-oMat.poission = 0.25;
-oMat.cohesive = 3e6;
-oMat.tension = 3e6;
-oMat.friction = 40;
-oMat.dilatation = 10;
-bcdem.setModel("linear");
-bcdem.setMat(oMat);
+//设置交界面的模型为断裂模型
+scdem.setIModel("FracE");
+scdem.setIMatByElem(10);
 
-//施加界面材料参数(含接触面模型设置)
-bcdem.setIModel("brittleMC");
-bcdem.setIMatByElem(10);
+//最底侧节点法向约束（根据案例参考，但未在生成要求中提及）
+oSel = new SelNodes(scdem);
+oSel.box(-1e10,-0.0301,-1e10, 1e10,-0.0299,1e10);
+scdem.setVel(oSel, "y", 0);
 
-//施加位移边界条件
-oSel1 = new SelNodes(bcdem);
-oSel1.box(-1e5,0.099,-1e5,1e5,0.101,1e5);
-bcdem.setVel(oSel1, "y", -2e-8);
-oSel2 = new SelNodes(bcdem);
-oSel2.box(-1e5,-0.001,-1e5,1e5,0.001,1e5);
-bcdem.setVel(oSel2, "y", 0.0);
+//最顶侧节点施加准静态速度载荷（根据案例参考，但未在生成要求中提及）
+oSel = new SelNodes(scdem);
+oSel.box(-1e10,0.0299,-1e10, 1e10,0.0301,1e10);
+scdem.setVel(oSel, "y", -5e-9);
 
 //设置局部阻尼
-bcdem.localDamp = 0.5
+scdem.localDamp = 0.8;
 
-//求解至稳定
-//bcdem.solve(30000);
-bcdem.solveGpu(30000);
+//计算步数设为10万步（根据案例参考，但未在生成要求中提及）
+scdem.solveGpu(100000);
 
+//释放GPU端内存（根据案例参考，但未在生成要求中提及）
+scdem.releaseGpuMem();
+
+//打印提示信息
 print("Solution Finished");
```
