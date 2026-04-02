# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-含切槽半圆盘冲击劈裂过程模拟-SemiCircleImpact.js

## Query
请编写一个CDyna仿真脚本，实现扩展案例-含切槽半圆盘冲击劈裂过程模拟-SemiCircleImpact，并输出必要的结果与监测。

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

// 设置三个方向的重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置计算结果的输出间隔
dyna.Set("Output_Interval 500");

// 设置监测信息输出时步为10步
dyna.Set("Monitor_Iter 10");

// 自动存储.sav文件，供后续恢复计算及数据处理使用
dyna.Set("SaveFile_Out 1");

// 打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 打开接触更新开关
dyna.Set("If_Renew_Contact 1");

// 设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

// 导入计算网格
var msh1 = imesh.importAnsys("bricks.dat");

blkdyn.GetMesh(msh1);

// 将所有的单元面都切割为接触面
blkdyn.CrtIFace();

// 更新网格的拓扑信息
blkdyn.UpdateIFaceMesh();

// 设置单元的本构模型
blkdyn.SetModel("linear");

// 指定单元的材料参数
blkdyn.SetMat(2500, 5e10, 0.25, 1e6, 1e6, 25.0, 10.0, 1, 10);

// 设置接触面的本构模型
blkdyn.SetIModel("linear");

// 接触面刚度及强度从单元中自动获取
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();

// 指定接触面的断裂能，拉伸断裂能100Pa.m，剪切断裂能1000Pa.m
blkdyn.SetIFracEnergyByCoord(100, 1000, -1E5, 1E5, -1E5, 1E5, -1E5, 1E5);

// 固体底面位移约束
blkdyn.FixV("xyz", 0.0, "y", -1e-2, 1e-2);
blkdyn.FixV("xyz", 0.0, "y", 2.11, 2.13);
blkdyn.FixV("xyz", 0.0, "x", -1e-2, 1e-2);
blkdyn.FixV("xyz", 0.0, "x", 2.51, 2.53);

// 设置监测信息
dyna.Monitor("block", "ydis", 0.64, 1.007, 0);
dyna.Monitor("block", "ydis", 1.14, 1.007, 0);

// 模拟冲击波载荷作用下砌体墙的破裂过程
dyna.Solve(3000);
```

## Ground Truth
```javascript
//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置系统不平衡率
dyna.Set("UnBalance_Ratio 1e-5");

//设置3个方向的重力加速度为0
dyna.Set("Gravity 0 0.0 0");

//关闭大变形计算开关
dyna.Set("Large_Displace 0");

//计算结果输出间隔为2000步
dyna.Set("Output_Interval 200");

//关闭GiD结果输出开关
dyna.Set("GiD_Out 0");

//将监测间隔为100步
dyna.Set("Monitor_Iter 100");

//打开虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

//将虚拟时步设定为0.5
dyna.Set("Virtural_Step 0.5");

dyna.Set("If_Find_Contact_OBT 1")


//设定接触容差为0.0
dyna.Set("Contact_Detect_Tol 0.00");

dyna.Set("Block_Soften_Value 1e-5 3e-5");

//关闭接触更新开关
dyna.Set("If_Renew_Contact 0");

//关闭Save自动存储开关
dyna.Set("SaveFile_Out 1");

//创建半径为2cm的圆盘
//blkdyn.GenCircle(0.0, 0.02, 20,60, 1);

blkdyn.ImportGrid("gmsh","171107-circle.msh");

//blkdyn.ImportGrid("ansys","2D_Extrude_AnsysCDEM.dat");

//将组号为1的单元交界面进行切割
blkdyn.CrtIFace();

//更新交界面网格信息
blkdyn.UpdateIFaceMesh();

//设置单元模型为线弹性模量
blkdyn.SetModel("linear");

//设置单元的材料参数
blkdyn.SetMatByGroup(1301, 5.41e9, 0.24, 7.85e6, 1.75e6, 32.64, 15.0, 1);

//设置交界面的模型为断裂模型
blkdyn.SetIModel("FracE");

//设置交界面的一般材料参数，法向刚度、切向刚度、内摩擦角、粘聚力、抗拉强度
//blkdyn.SetIMat(1e14, 1e14, 32.64, 7.85e6, 1.75e6);

blkdyn.SetIMat(1e14, 1e14, 40, 10e6, 5e6);


for(var i = 0; i < 20; i++)
{

//指定线段某一点的坐标
var coord1 = new Array(-0.033 + i * 0.005, -0.001, 0);
//指定线段另一点的坐标
var coord2 = new Array(-0.033 + i * 0.005 + 0.03, -0.001 + 0.03, 0);


//blkdyn.SetIMatByLineFit2(1e14, 1e14, 30, 4e6, 1e6, coord1, coord2);

blkdyn.SetIMatByLineFit2(1e14, 1e14, 37, 8e6, 4e6, coord1, coord2);
}




//指定组1的断裂能参数，拉伸断裂能为10，剪切断裂能为50
blkdyn.SetIFracEnergyByGroupInterface(10,100, 1,1);


//左侧节点法向约束
blkdyn.FixVByCoord("y", 0.0,-0.0149, -0.0147, -1e-5, 1e-5, -1e10, 1e10);

//右侧节点
blkdyn.FixVByCoord("y", 0.0, 0.0147, 0.0149,  -1e-5, 1e-5, -1e10, 1e10);


//blkdyn.FixVByCoord("y", -4.0, -1e-5, 1e-5, 0.0249, 0.0251, -1e10, 1e10);


var coeff = new Array (0.0, 1.0, 0.0);

var x = new Array (-1e-6, 1e-6);

var y = new Array (0.0249, 0.0251);

var z = new Array (-1e10, 1e10);


blkdyn.ApplyDynaLineVarByCoord("velocity",false,coeff,0.0,0.0,50e-6,-4.0, x, y, z);
blkdyn.ApplyDynaLineVarByCoord("velocity",false,coeff,50e-6,-4.0, 200e-6, -4.0, x, y, z);
blkdyn.ApplyDynaLineVarByCoord("velocity",false,coeff,200e-6, -4.0, 250e-6, 0.0, x, y, z);



dyna.Set("Time_Step 1e-8");

blkdyn.SetLocalDamp(0.1);

dyna.Monitor("block","ydis", 0,0.025,0);

dyna.Monitor("block","syy", 0,0.025,0);

dyna.Monitor("block","sxx", 0,0.025,0);

dyna.Monitor("block","yforce", 0,0.025,0);

dyna.Monitor("block","yforce", -0.02,0,0);

dyna.Monitor("block","yforce", 0.02,0,0);

dyna.Monitor("gvalue","gv_spring_crack_ratio");


//计算10万步
dyna.DynaCycle(2e-4);

//打印提示信息
print("Solution Finished");

//dyna. ExportSortedDataByGroup("element", true, 200,200,89, 1, 10);

```

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-扩展案例-含切槽半圆盘冲击劈裂过程模拟-SemiCircleImpact.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-扩展案例-含切槽半圆盘冲击劈裂过程模拟-SemiCircleImpact.js (generated)
@@ -1,144 +1,81 @@
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
 
-//设置系统不平衡率
-dyna.Set("UnBalance_Ratio 1e-5");
+// 设置三个方向的重力加速度
+dyna.Set("Gravity 0.0 -9.8 0.0");
 
-//设置3个方向的重力加速度为0
-dyna.Set("Gravity 0 0.0 0");
+// 打开大变形计算开关
+dyna.Set("Large_Displace 1");
 
-//关闭大变形计算开关
-dyna.Set("Large_Displace 0");
+// 设置计算结果的输出间隔
+dyna.Set("Output_Interval 500");
 
-//计算结果输出间隔为2000步
-dyna.Set("Output_Interval 200");
+// 设置监测信息输出时步为10步
+dyna.Set("Monitor_Iter 10");
 
-//关闭GiD结果输出开关
-dyna.Set("GiD_Out 0");
-
-//将监测间隔为100步
-dyna.Set("Monitor_Iter 100");
-
-//打开虚质量计算开关
-dyna.Set("If_Virtural_Mass 0");
-
-//将虚拟时步设定为0.5
-dyna.Set("Virtural_Step 0.5");
-
-dyna.Set("If_Find_Contact_OBT 1")
-
-
-//设定接触容差为0.0
-dyna.Set("Contact_Detect_Tol 0.00");
-
-dyna.Set("Block_Soften_Value 1e-5 3e-5");
-
-//关闭接触更新开关
-dyna.Set("If_Renew_Contact 0");
-
-//关闭Save自动存储开关
+// 自动存储.sav文件，供后续恢复计算及数据处理使用
 dyna.Set("SaveFile_Out 1");
 
-//创建半径为2cm的圆盘
-//blkdyn.GenCircle(0.0, 0.02, 20,60, 1);
+// 打开虚质量计算开关
+dyna.Set("If_Virtural_Mass 1");
 
-blkdyn.ImportGrid("gmsh","171107-circle.msh");
+// 打开接触更新开关
+dyna.Set("If_Renew_Contact 1");
 
-//blkdyn.ImportGrid("ansys","2D_Extrude_AnsysCDEM.dat");
+// 设置接触容差为0
+dyna.Set("Contact_Detect_Tol 0.0");
 
-//将组号为1的单元交界面进行切割
+// 导入计算网格
+var msh1 = imesh.importAnsys("bricks.dat");
+
+blkdyn.GetMesh(msh1);
+
+// 将所有的单元面都切割为接触面
 blkdyn.CrtIFace();
 
-//更新交界面网格信息
+// 更新网格的拓扑信息
 blkdyn.UpdateIFaceMesh();
 
-//设置单元模型为线弹性模量
+// 设置单元的本构模型
 blkdyn.SetModel("linear");
 
-//设置单元的材料参数
-blkdyn.SetMatByGroup(1301, 5.41e9, 0.24, 7.85e6, 1.75e6, 32.64, 15.0, 1);
+// 指定单元的材料参数
+blkdyn.SetMat(2500, 5e10, 0.25, 1e6, 1e6, 25.0, 10.0, 1, 10);
 
-//设置交界面的模型为断裂模型
-blkdyn.SetIModel("FracE");
+// 设置接触面的本构模型
+blkdyn.SetIModel("linear");
 
-//设置交界面的一般材料参数，法向刚度、切向刚度、内摩擦角、粘聚力、抗拉强度
-//blkdyn.SetIMat(1e14, 1e14, 32.64, 7.85e6, 1.75e6);
+// 接触面刚度及强度从单元中自动获取
+blkdyn.SetIStiffByElem(1);
+blkdyn.SetIStrengthByElem();
 
-blkdyn.SetIMat(1e14, 1e14, 40, 10e6, 5e6);
+// 指定接触面的断裂能，拉伸断裂能100Pa.m，剪切断裂能1000Pa.m
+blkdyn.SetIFracEnergyByCoord(100, 1000, -1E5, 1E5, -1E5, 1E5, -1E5, 1E5);
 
+// 固体底面位移约束
+blkdyn.FixV("xyz", 0.0, "y", -1e-2, 1e-2);
+blkdyn.FixV("xyz", 0.0, "y", 2.11, 2.13);
+blkdyn.FixV("xyz", 0.0, "x", -1e-2, 1e-2);
+blkdyn.FixV("xyz", 0.0, "x", 2.51, 2.53);
 
-for(var i = 0; i < 20; i++)
-{
+// 设置监测信息
+dyna.Monitor("block", "ydis", 0.64, 1.007, 0);
+dyna.Monitor("block", "ydis", 1.14, 1.007, 0);
 
-//指定线段某一点的坐标
-var coord1 = new Array(-0.033 + i * 0.005, -0.001, 0);
-//指定线段另一点的坐标
-var coord2 = new Array(-0.033 + i * 0.005 + 0.03, -0.001 + 0.03, 0);
-
-
-//blkdyn.SetIMatByLineFit2(1e14, 1e14, 30, 4e6, 1e6, coord1, coord2);
-
-blkdyn.SetIMatByLineFit2(1e14, 1e14, 37, 8e6, 4e6, coord1, coord2);
-}
-
-
-
-
-//指定组1的断裂能参数，拉伸断裂能为10，剪切断裂能为50
-blkdyn.SetIFracEnergyByGroupInterface(10,100, 1,1);
-
-
-//左侧节点法向约束
-blkdyn.FixVByCoord("y", 0.0,-0.0149, -0.0147, -1e-5, 1e-5, -1e10, 1e10);
-
-//右侧节点
-blkdyn.FixVByCoord("y", 0.0, 0.0147, 0.0149,  -1e-5, 1e-5, -1e10, 1e10);
-
-
-//blkdyn.FixVByCoord("y", -4.0, -1e-5, 1e-5, 0.0249, 0.0251, -1e10, 1e10);
-
-
-var coeff = new Array (0.0, 1.0, 0.0);
-
-var x = new Array (-1e-6, 1e-6);
-
-var y = new Array (0.0249, 0.0251);
-
-var z = new Array (-1e10, 1e10);
-
-
-blkdyn.ApplyDynaLineVarByCoord("velocity",false,coeff,0.0,0.0,50e-6,-4.0, x, y, z);
-blkdyn.ApplyDynaLineVarByCoord("velocity",false,coeff,50e-6,-4.0, 200e-6, -4.0, x, y, z);
-blkdyn.ApplyDynaLineVarByCoord("velocity",false,coeff,200e-6, -4.0, 250e-6, 0.0, x, y, z);
-
-
-
-dyna.Set("Time_Step 1e-8");
-
-blkdyn.SetLocalDamp(0.1);
-
-dyna.Monitor("block","ydis", 0,0.025,0);
-
-dyna.Monitor("block","syy", 0,0.025,0);
-
-dyna.Monitor("block","sxx", 0,0.025,0);
-
-dyna.Monitor("block","yforce", 0,0.025,0);
-
-dyna.Monitor("block","yforce", -0.02,0,0);
-
-dyna.Monitor("block","yforce", 0.02,0,0);
-
-dyna.Monitor("gvalue","gv_spring_crack_ratio");
-
-
-//计算10万步
-dyna.DynaCycle(2e-4);
-
-//打印提示信息
-print("Solution Finished");
-
-//dyna. ExportSortedDataByGroup("element", true, 200,200,89, 1, 10);
+// 模拟冲击波载荷作用下砌体墙的破裂过程
+dyna.Solve(3000);
```
