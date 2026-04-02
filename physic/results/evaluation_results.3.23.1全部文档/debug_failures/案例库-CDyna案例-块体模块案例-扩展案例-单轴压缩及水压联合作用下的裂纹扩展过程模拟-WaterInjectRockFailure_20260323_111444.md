# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-单轴压缩及水压联合作用下的裂纹扩展过程模拟-WaterInjectRockFailure.js

## Query
请编写一个CDyna仿真脚本，实现扩展案例-单轴压缩及水压联合作用下的裂纹扩展过程模拟-WaterInjectRockFailure，并输出必要的结果与监测。

## Generated Code
```javascript
// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getCurDir());

igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

// 包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage 1");

// 开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal 1");

// 设置三个方向的重力加速度
dyna.Set("Gravity 0.0 -10.0 0.0");

// 将结果输出时步设定为500步
dyna.Set("Output_Interval 500");

// 监测结果输出时步间隔设定为100步
dyna.Set("Moniter_Iter 100");

// 计算时步
dyna.Set("Time_Step 0.001");

// 瞬态可压缩液体渗流
dyna.Set("Seepage_Mode 1");

// 宾汉流模型
dyna.Set("Liquid_Seepage_Law 2");

// 截止开度, 达到该值流体停止进入
dyna.Set("PS_CirInject_Width 1e-6");

// 设置整体模型的最小孔隙开度，对应的是最小孔隙率，各个地层的开度根据孔隙率大小调整
dyna.Set("Pore_Min_Width 1.4e-4");

// 创建网格
blkGen = blkGen2D(10, 0.2, 50, 1, 1);

// 定义X、Y、Z三个方向的渗透系数
var arrayK1 = new Array(1.66667e-7, 1.66667e-7, 1.66667e-7);

// 指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByGroup(1810.0, 1e6, 0.0, 0.01, arrayK1, 1.0, 1);

// 单独指定剪切强度
poresp.SetSinglePropByGroup("Strength", 11.75, 1);

// 定义梯度
var fArrayGrad = new Array(0.0, 0.0, 0.0);

// 设定模型四周的水压力边界条件
poresp.ApplyConditionByCoord("pp", 5e5, fArrayGrad, -0.5, 0.5, -1e5, 1e5, -1e5, 1e5, true);

dyna.Solve(50000);

// 打印提示信息
print("Solution Finished");
```

## Ground Truth
```javascript
//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置三个方向的重力加速度，均为0
dyna.Set("Gravity 0 0.0 0");

//关闭大变形计算开关
dyna.Set("Large_Displace 0");

//设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//打开虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

//设置虚质量时步为0.5
dyna.Set("Virtural_Step 0.3");

//设置满足稳定条件的系统不平衡率
dyna.Set("UnBalance_Ratio 1e-4");

//关闭接触更新计算开关
dyna.Set("If_Renew_Contact 0");

//设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

dyna.Set("If_Find_Contact_OBT 1");

dyna.Set("GiD_Out 0");

//包含裂隙渗流计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

//裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

//关闭裂隙渗流与固体耦合开关（孔隙渗流无此开关）
dyna.Set("FS_Solid_Interaction 1");


var msh1=imesh.importGmsh("1.msh");
blkdyn.GetMesh(msh1);


blkdyn.CrtIFace(1, 1);
//更新接触面网格
blkdyn.UpdateIFaceMesh();


//设定所有单元的本构为线弹性本构
blkdyn.SetModel("MC");

///弹性模量5e11，请确认
blkdyn.SetMatByGroup(2500, 6.5e9, 0.25, 3e6, 3e6, 30.0, 10.0, 1);

//设定所有接触面的本构为线弹性模型
blkdyn.SetIModel("brittleMC");

//接触面刚度需要为块体刚度的1-10倍
blkdyn.SetIMat(9e9, 9e9, 30, 3e6, 3e6,1);

//设接触面刚度为单元特征刚度的1倍
blkdyn.SetIStiffByElem(1.0);

//设定全部节点的局部阻尼系数为0.8
blkdyn.SetLocalDamp(0.6);

//从固体单元接触面创建裂隙单元，只有弹簧的位置才加渗流
fracsp.CreateGridFromBlock (2);

//设置裂隙渗流参数，依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
fracsp.SetPropByGroup(1000.0,1e7,1e-14,1e-8,1,1);



//*************************************************************************
//***********设定压力边界条件

var TotalFracElem = Math.round(dyna.GetValue("Total_FS_ElemNum"));
var ielem = 1;
for(ielem = 1; ielem <= TotalFracElem; ielem++)
{
var xc = fracsp.GetElemValue(ielem,"Centroid",1);
var yc = fracsp.GetElemValue(ielem,"Centroid",2);
var zc = fracsp.GetElemValue(ielem,"Centroid",3);

	if(xc >= 0.01 && xc <= 0.06 && yc >= 0.01 && yc <= 0.13 && zc >= -0.00001 && zc <= 0.0000012)
	{

	var ID1 = fracsp.GetElemValue (ielem, "RelaElemID1");
	var ID2 = fracsp.GetElemValue (ielem, "RelaElemID2");
	if(ID1 < 0 || ID2 < 0)
	{
		var TN = Math.round( fracsp.GetElemValue(ielem,"TotalVertex") );

		for(var inode = 1; inode <= TN; inode++)
		{
			var NodeID = Math.round(fracsp.GetElemValue(ielem, "NodeID", inode)  );

			fracsp.SetNodeValue(NodeID, "IfFixPP",1);
			fracsp.SetNodeValue(NodeID, "FixedPP",2e6);
			fracsp.SetNodeValue(NodeID, "Sat",1.0);

		}
	}

	}

}

//***********设定压力边界条件
//*************************************************************************



 
print("Finish Apply");


dyna.Monitor("block", "syy", 0.035, 0.035, 0.6);
dyna.Monitor("fracsp", "sc_pp", 0.035, 0, 0);
dyna.Monitor("fracsp", "sc_pp", 0.035, 0.07, 0);


blkdyn.FixV("y", 0.0, "y", -1, 0.0001);
blkdyn.FixV("y",-0.1, "y", 0.1399,0.141);


blkdyn.SetLocalDamp(0.1);

dyna.Set("Time_Step 5e-8");

dyna.Set("FS_MaxWid 2e-4");


dyna.Solve(50000);


//打印提示信息
print("Solution Finished");
```

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-扩展案例-单轴压缩及水压联合作用下的裂纹扩展过程模拟-WaterInjectRockFailure.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-扩展案例-单轴压缩及水压联合作用下的裂纹扩展过程模拟-WaterInjectRockFailure.js (generated)
@@ -1,144 +1,63 @@
-//设置当前工作路径为JavaScript脚本文件所在路径
-setCurDir(getSrcDir());
+// 设置当前工作路径为JavaScript脚本文件所在路径
+setCurDir(getCurDir());
 
-//打开力学计算开关
-dyna.Set("Mechanic_Cal 1");
+igeo.clear();
+imeshing.clear();
+dyna.Clear();
+doc.clearResult();
 
-//设置三个方向的重力加速度，均为0
-dyna.Set("Gravity 0 0.0 0");
+// 关闭力学计算开关
+dyna.Set("Mechanic_Cal 0");
 
-//关闭大变形计算开关
-dyna.Set("Large_Displace 0");
+// 包含孔隙渗流计算功能，开辟渗流相关的内存
+dyna.Set("Config_PoreSeepage 1");
 
-//设置计算结果的输出间隔为500步
+// 开启孔隙渗流开关
+dyna.Set("PoreSeepage_Cal 1");
+
+// 设置三个方向的重力加速度
+dyna.Set("Gravity 0.0 -10.0 0.0");
+
+// 将结果输出时步设定为500步
 dyna.Set("Output_Interval 500");
 
-//打开虚质量计算开关
-dyna.Set("If_Virtural_Mass 0");
+// 监测结果输出时步间隔设定为100步
+dyna.Set("Moniter_Iter 100");
 
-//设置虚质量时步为0.5
-dyna.Set("Virtural_Step 0.3");
+// 计算时步
+dyna.Set("Time_Step 0.001");
 
-//设置满足稳定条件的系统不平衡率
-dyna.Set("UnBalance_Ratio 1e-4");
+// 瞬态可压缩液体渗流
+dyna.Set("Seepage_Mode 1");
 
-//关闭接触更新计算开关
-dyna.Set("If_Renew_Contact 0");
+// 宾汉流模型
+dyna.Set("Liquid_Seepage_Law 2");
 
-//设置接触容差为0
-dyna.Set("Contact_Detect_Tol 0.0");
+// 截止开度, 达到该值流体停止进入
+dyna.Set("PS_CirInject_Width 1e-6");
 
-dyna.Set("If_Find_Contact_OBT 1");
+// 设置整体模型的最小孔隙开度，对应的是最小孔隙率，各个地层的开度根据孔隙率大小调整
+dyna.Set("Pore_Min_Width 1.4e-4");
 
-dyna.Set("GiD_Out 0");
+// 创建网格
+blkGen = blkGen2D(10, 0.2, 50, 1, 1);
 
-//包含裂隙渗流计算模块，开辟相应内存
-dyna.Set("Config_FracSeepage 1");
+// 定义X、Y、Z三个方向的渗透系数
+var arrayK1 = new Array(1.66667e-7, 1.66667e-7, 1.66667e-7);
 
-//裂隙渗流计算开关
-dyna.Set("FracSeepage_Cal 1");
+// 指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
+poresp.SetPropByGroup(1810.0, 1e6, 0.0, 0.01, arrayK1, 1.0, 1);
 
-//关闭裂隙渗流与固体耦合开关（孔隙渗流无此开关）
-dyna.Set("FS_Solid_Interaction 1");
+// 单独指定剪切强度
+poresp.SetSinglePropByGroup("Strength", 11.75, 1);
 
+// 定义梯度
+var fArrayGrad = new Array(0.0, 0.0, 0.0);
 
-var msh1=imesh.importGmsh("1.msh");
-blkdyn.GetMesh(msh1);
-
-
-blkdyn.CrtIFace(1, 1);
-//更新接触面网格
-blkdyn.UpdateIFaceMesh();
-
-
-//设定所有单元的本构为线弹性本构
-blkdyn.SetModel("MC");
-
-///弹性模量5e11，请确认
-blkdyn.SetMatByGroup(2500, 6.5e9, 0.25, 3e6, 3e6, 30.0, 10.0, 1);
-
-//设定所有接触面的本构为线弹性模型
-blkdyn.SetIModel("brittleMC");
-
-//接触面刚度需要为块体刚度的1-10倍
-blkdyn.SetIMat(9e9, 9e9, 30, 3e6, 3e6,1);
-
-//设接触面刚度为单元特征刚度的1倍
-blkdyn.SetIStiffByElem(1.0);
-
-//设定全部节点的局部阻尼系数为0.8
-blkdyn.SetLocalDamp(0.6);
-
-//从固体单元接触面创建裂隙单元，只有弹簧的位置才加渗流
-fracsp.CreateGridFromBlock (2);
-
-//设置裂隙渗流参数，依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
-fracsp.SetPropByGroup(1000.0,1e7,1e-14,1e-8,1,1);
-
-
-
-//*************************************************************************
-//***********设定压力边界条件
-
-var TotalFracElem = Math.round(dyna.GetValue("Total_FS_ElemNum"));
-var ielem = 1;
-for(ielem = 1; ielem <= TotalFracElem; ielem++)
-{
-var xc = fracsp.GetElemValue(ielem,"Centroid",1);
-var yc = fracsp.GetElemValue(ielem,"Centroid",2);
-var zc = fracsp.GetElemValue(ielem,"Centroid",3);
-
-	if(xc >= 0.01 && xc <= 0.06 && yc >= 0.01 && yc <= 0.13 && zc >= -0.00001 && zc <= 0.0000012)
-	{
-
-	var ID1 = fracsp.GetElemValue (ielem, "RelaElemID1");
-	var ID2 = fracsp.GetElemValue (ielem, "RelaElemID2");
-	if(ID1 < 0 || ID2 < 0)
-	{
-		var TN = Math.round( fracsp.GetElemValue(ielem,"TotalVertex") );
-
-		for(var inode = 1; inode <= TN; inode++)
-		{
-			var NodeID = Math.round(fracsp.GetElemValue(ielem, "NodeID", inode)  );
-
-			fracsp.SetNodeValue(NodeID, "IfFixPP",1);
-			fracsp.SetNodeValue(NodeID, "FixedPP",2e6);
-			fracsp.SetNodeValue(NodeID, "Sat",1.0);
-
-		}
-	}
-
-	}
-
-}
-
-//***********设定压力边界条件
-//*************************************************************************
-
-
-
- 
-print("Finish Apply");
-
-
-dyna.Monitor("block", "syy", 0.035, 0.035, 0.6);
-dyna.Monitor("fracsp", "sc_pp", 0.035, 0, 0);
-dyna.Monitor("fracsp", "sc_pp", 0.035, 0.07, 0);
-
-
-blkdyn.FixV("y", 0.0, "y", -1, 0.0001);
-blkdyn.FixV("y",-0.1, "y", 0.1399,0.141);
-
-
-blkdyn.SetLocalDamp(0.1);
-
-dyna.Set("Time_Step 5e-8");
-
-dyna.Set("FS_MaxWid 2e-4");
-
+// 设定模型四周的水压力边界条件
+poresp.ApplyConditionByCoord("pp", 5e5, fArrayGrad, -0.5, 0.5, -1e5, 1e5, -1e5, 1e5, true);
 
 dyna.Solve(50000);
 
-
-//打印提示信息
+// 打印提示信息
 print("Solution Finished");
```
