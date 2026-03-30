# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-高压气体致裂固体材料模拟-HighPressFrac.js

## Query
请编写一个CDyna仿真脚本，实现扩展案例-高压气体致裂固体材料模拟-HighPressFrac，并输出必要的结果与监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// 初始化环境
dyna.Clear();
igeo.clear();
imeshing.clear();
doc.clearResult();

// 创建矩形块体几何模型（模拟固体材料）
igeo.genRectS(0, 0, 0, 2.0, 1.0, 0.5, 0.1, 0.1);

// 网格划分
imeshing.genMeshByGmsh(2);

// 获取块体网格
blkdyn.GetMesh(imeshing);

// 创建接触面以支持破裂传播
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置模型为线性弹性模型
blkdyn.SetModel("linear");

// 设置固体材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼
blkdyn.SetMat(2500, 3e10, 0.25, 1e6, 1e6, 35, 15);

// 设置脆性断裂模型
blkdyn.SetIModel("brittleMC");

// 设置单元刚度由单元控制
blkdyn.SetIStiffByElem(1);

// 设置单元强度由单元控制（允许破裂）
blkdyn.SetIStrengthByElem();

// 设置局部阻尼
blkdyn.SetLocalDamp(0.01);

// 设置简单水力压裂模式参数
// IDNo=1, BoundType=1(压力边界), fBoundV1=注入压力(Pa), fBoundV2=每米压力衰减值(Pa/m)
var fC = new Array(0.5, 0.5, 0.25); // 注入点坐标（块体中心）
blkdyn.SetSimpleHyFracPram(1, 1, 1e7, 9e6, fC, true);

// 设置裂隙渗流计算模块
dyna.Set("Config_FracSeepage 1");
dyna.Set("Seepage_Mode 2"); // 气体渗流模式
dyna.Set("FracSeepage_Cal 1");

// 打开裂隙渗流与固体破裂耦合开关
dyna.Set("FS_Solid_Interaction 1");

// 设置重力加速度（无重力或自定义）
dyna.Set("Gravity 0.0 0.0 0.0");

// 设置结果输出时步
dyna.Set("Output_Interval 500");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 打开大变形开关
dyna.Set("Large_Displace 1");

// 更新接触检测
dyna.Set("If_Renew_Contact 1");

// 设置接触容差
dyna.Set("Contact_Detect_Tol 0.0");

// 初始化裂隙压力（可选）
fracsp.InitConditionByCoord("pp", 1e5, [0, 0, 0], -1e6, 1e6, -1e6, 1e6, -1e6, 1e6);

// 设置气体注入条件
var ID = Math.round(fracsp.GetNodeID(0.5, 0.5, 0.25));
var fx = fracsp.GetNodeValue(ID, "Coord", 1);
var fy = fracsp.GetNodeValue(ID, "Coord", 2);
fracsp.ApplyConditionByCoord("source", 1e-2, [fx, fy, 0.25], fx - 1e-3, fx + 1e-3, fy - 1e-3, fy + 1e-3, -1, 1);

// 设置裂隙渗流参数：密度、体积模量、渗透率、初始裂纹宽度、下摩擦系数、上摩擦系数
fracsp.SetPropByGroup(1.293, 1e7, 7e-9, 1e-6, 1, 11);

// 设置计算时步（确保气体绝热膨胀模型稳定性）
dyna.Set("Time_Step 1e-5");

// 设置输出请求：监测应力、应变及裂纹扩展路径
dyna.Monitor("blkdyn", "stress", 1, 1, 0);
dyna.Monitor("blkdyn", "strain", 1, 1, 0);
dyna.Monitor("blkdyn", "damage", 1, 1, 0);

// 设置结果导出参数（破片信息及密度统计）
blkdyn.ExportGradationCurveByGroup(1, 1);

// 执行仿真计算
dyna.Solve(5000);

// 输出破裂块度信息
blkdyn.ExportGradationCurveByGroup(1, 1);
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
dyna.Set("Large_Displace 1");

//设置计算结果的输出间隔为100步
dyna.Set("Output_Interval 100");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

//设置满足稳定条件的系统不平衡率
dyna.Set("UnBalance_Ratio 1e-4");

//打开接触更新计算开关
dyna.Set("If_Renew_Contact 1");

//设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");


//包含裂隙渗流计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

//关闭裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

//打开save文件自动存储开关
dyna.Set("SaveFile_Out 1");

//数值最大裂隙开度为2um
dyna.Set("FS_MaxWid 2e-6");

//设置裂隙流模型为可压缩气体模型
dyna.Set("Seepage_Mode 2");

//打开瑞利阻尼开关
dyna.Set("If_Cal_Rayleigh 1");


//设置接触面断裂拉伸应变及断裂剪切应变，剪切应变设定很大，表示不让模型发生剪切断裂
//默认接触面特征厚度为1，故2e-6可认为是拉断位移
dyna.Set("Interface_Soften_Value 2e-6 5");


//打开裂隙渗流与固体耦合开关（孔隙渗流无此开关）
dyna.Set("FS_Solid_Interaction 1");

//导入gmsh格式网格
var msh1 = imesh.importGmsh("GDEM.msh");

blkdyn.GetMesh(msh1);

//对公共面进行切割，形成接触面
blkdyn.CrtIFace();

//更新接触面网格
blkdyn.UpdateIFaceMesh();

//设定所有单元的本构为线弹性本构
blkdyn.SetModel("MC");

//设定固体材料参数
blkdyn.SetMat(1700, 3e9, 0.2, 14.4e6, 3e6, 30, 15);



//设定所有接触面的本构为应变软化模型
blkdyn.SetIModel("SSMC");

//设置接触面参数，粘聚力设置大值，不让其发生剪切断裂
blkdyn.SetIMat(1e15, 1e15, 30, 200e6, 3e6);

//设定全部节点的局部阻尼系数为0.00
blkdyn.SetLocalDamp(0.00);

//设置瑞利阻尼
blkdyn.SetRayleighDamp(1e-7, 0.0);

///裂隙单元从固体单元中继承
fracsp.CreateGridFromBlock (2);

//设置裂隙渗流参数，依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
fracsp.SetPropByGroup(1.00,1e7,12e-13,12e-9,1,11);

//初始化所有裂隙单元的压力为0.1MPa
fracsp.InitConditionByCoord("pp",1e5, grad, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

//设置圆孔中心高压区的参数
fracsp.SetPropByCylinder(170.0,1e7,12e-13,12e-9,   0.0, 0.0, -1.0 , 0.0, 0.0, 1.0, 0.0, 5.05e-4);

//初始化高压区压力30MPa
var grad = new Array(0, 0, 0); 
fracsp.ApplyConditionByCylinder("pp", 30e6, grad, 0.0, 0.0, -1.0 , 0.0, 0.0, 1.0, 0.0, 5.05e-4);

//监测破裂度、等效破裂度及流体总质量
dyna.Monitor("gvalue","gv_spring_crack_ratio");
dyna.Monitor("gvalue","gv_spring_equiv_crack_ratio");
dyna.Monitor("gvalue","gv_fracsp_total_mass");

//循环设置监测点
for(var i = 0; i <= 9; i++)
{
dyna.Monitor("block", "xvel",  5e-4 + i * 1e-3,  0, 0);
}

for(var i = 0; i <= 9; i++)
{
dyna.Monitor("block", "sxx",  5e-4 + i * 1e-3,  0, 0);
}


//设置计算时步
dyna.Set("Time_Step 3e-9");

//计算35us
dyna.DynaCycle(35e-6);

//打印提示信息
print("Solution Finished");






```

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-扩展案例-高压气体致裂固体材料模拟-HighPressFrac.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-扩展案例-高压气体致裂固体材料模拟-HighPressFrac.js (generated)
@@ -1,132 +1,98 @@
-//设置当前工作路径为JavaScript脚本文件所在路径
 setCurDir(getSrcDir());
 
-//打开力学计算开关
-dyna.Set("Mechanic_Cal 1");
+// 初始化环境
+dyna.Clear();
+igeo.clear();
+imeshing.clear();
+doc.clearResult();
 
-//设置三个方向的重力加速度，均为0
-dyna.Set("Gravity 0 0.0 0");
+// 创建矩形块体几何模型（模拟固体材料）
+igeo.genRectS(0, 0, 0, 2.0, 1.0, 0.5, 0.1, 0.1);
 
-//关闭大变形计算开关
+// 网格划分
+imeshing.genMeshByGmsh(2);
+
+// 获取块体网格
+blkdyn.GetMesh(imeshing);
+
+// 创建接触面以支持破裂传播
+blkdyn.CrtIFace();
+blkdyn.UpdateIFaceMesh();
+
+// 设置模型为线性弹性模型
+blkdyn.SetModel("linear");
+
+// 设置固体材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼
+blkdyn.SetMat(2500, 3e10, 0.25, 1e6, 1e6, 35, 15);
+
+// 设置脆性断裂模型
+blkdyn.SetIModel("brittleMC");
+
+// 设置单元刚度由单元控制
+blkdyn.SetIStiffByElem(1);
+
+// 设置单元强度由单元控制（允许破裂）
+blkdyn.SetIStrengthByElem();
+
+// 设置局部阻尼
+blkdyn.SetLocalDamp(0.01);
+
+// 设置简单水力压裂模式参数
+// IDNo=1, BoundType=1(压力边界), fBoundV1=注入压力(Pa), fBoundV2=每米压力衰减值(Pa/m)
+var fC = new Array(0.5, 0.5, 0.25); // 注入点坐标（块体中心）
+blkdyn.SetSimpleHyFracPram(1, 1, 1e7, 9e6, fC, true);
+
+// 设置裂隙渗流计算模块
+dyna.Set("Config_FracSeepage 1");
+dyna.Set("Seepage_Mode 2"); // 气体渗流模式
+dyna.Set("FracSeepage_Cal 1");
+
+// 打开裂隙渗流与固体破裂耦合开关
+dyna.Set("FS_Solid_Interaction 1");
+
+// 设置重力加速度（无重力或自定义）
+dyna.Set("Gravity 0.0 0.0 0.0");
+
+// 设置结果输出时步
+dyna.Set("Output_Interval 500");
+
+// 关闭虚质量计算开关
+dyna.Set("If_Virtural_Mass 0");
+
+// 打开大变形开关
 dyna.Set("Large_Displace 1");
 
-//设置计算结果的输出间隔为100步
-dyna.Set("Output_Interval 100");
-
-//关闭虚质量计算开关
-dyna.Set("If_Virtural_Mass 0");
-
-//设置满足稳定条件的系统不平衡率
-dyna.Set("UnBalance_Ratio 1e-4");
-
-//打开接触更新计算开关
+// 更新接触检测
 dyna.Set("If_Renew_Contact 1");
 
-//设置接触容差为0
+// 设置接触容差
 dyna.Set("Contact_Detect_Tol 0.0");
 
+// 初始化裂隙压力（可选）
+fracsp.InitConditionByCoord("pp", 1e5, [0, 0, 0], -1e6, 1e6, -1e6, 1e6, -1e6, 1e6);
 
-//包含裂隙渗流计算模块，开辟相应内存
-dyna.Set("Config_FracSeepage 1");
+// 设置气体注入条件
+var ID = Math.round(fracsp.GetNodeID(0.5, 0.5, 0.25));
+var fx = fracsp.GetNodeValue(ID, "Coord", 1);
+var fy = fracsp.GetNodeValue(ID, "Coord", 2);
+fracsp.ApplyConditionByCoord("source", 1e-2, [fx, fy, 0.25], fx - 1e-3, fx + 1e-3, fy - 1e-3, fy + 1e-3, -1, 1);
 
-//关闭裂隙渗流计算开关
-dyna.Set("FracSeepage_Cal 1");
+// 设置裂隙渗流参数：密度、体积模量、渗透率、初始裂纹宽度、下摩擦系数、上摩擦系数
+fracsp.SetPropByGroup(1.293, 1e7, 7e-9, 1e-6, 1, 11);
 
-//打开save文件自动存储开关
-dyna.Set("SaveFile_Out 1");
+// 设置计算时步（确保气体绝热膨胀模型稳定性）
+dyna.Set("Time_Step 1e-5");
 
-//数值最大裂隙开度为2um
-dyna.Set("FS_MaxWid 2e-6");
+// 设置输出请求：监测应力、应变及裂纹扩展路径
+dyna.Monitor("blkdyn", "stress", 1, 1, 0);
+dyna.Monitor("blkdyn", "strain", 1, 1, 0);
+dyna.Monitor("blkdyn", "damage", 1, 1, 0);
 
-//设置裂隙流模型为可压缩气体模型
-dyna.Set("Seepage_Mode 2");
+// 设置结果导出参数（破片信息及密度统计）
+blkdyn.ExportGradationCurveByGroup(1, 1);
 
-//打开瑞利阻尼开关
-dyna.Set("If_Cal_Rayleigh 1");
+// 执行仿真计算
+dyna.Solve(5000);
 
-
-//设置接触面断裂拉伸应变及断裂剪切应变，剪切应变设定很大，表示不让模型发生剪切断裂
-//默认接触面特征厚度为1，故2e-6可认为是拉断位移
-dyna.Set("Interface_Soften_Value 2e-6 5");
-
-
-//打开裂隙渗流与固体耦合开关（孔隙渗流无此开关）
-dyna.Set("FS_Solid_Interaction 1");
-
-//导入gmsh格式网格
-var msh1 = imesh.importGmsh("GDEM.msh");
-
-blkdyn.GetMesh(msh1);
-
-//对公共面进行切割，形成接触面
-blkdyn.CrtIFace();
-
-//更新接触面网格
-blkdyn.UpdateIFaceMesh();
-
-//设定所有单元的本构为线弹性本构
-blkdyn.SetModel("MC");
-
-//设定固体材料参数
-blkdyn.SetMat(1700, 3e9, 0.2, 14.4e6, 3e6, 30, 15);
-
-
-
-//设定所有接触面的本构为应变软化模型
-blkdyn.SetIModel("SSMC");
-
-//设置接触面参数，粘聚力设置大值，不让其发生剪切断裂
-blkdyn.SetIMat(1e15, 1e15, 30, 200e6, 3e6);
-
-//设定全部节点的局部阻尼系数为0.00
-blkdyn.SetLocalDamp(0.00);
-
-//设置瑞利阻尼
-blkdyn.SetRayleighDamp(1e-7, 0.0);
-
-///裂隙单元从固体单元中继承
-fracsp.CreateGridFromBlock (2);
-
-//设置裂隙渗流参数，依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
-fracsp.SetPropByGroup(1.00,1e7,12e-13,12e-9,1,11);
-
-//初始化所有裂隙单元的压力为0.1MPa
-fracsp.InitConditionByCoord("pp",1e5, grad, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
-
-//设置圆孔中心高压区的参数
-fracsp.SetPropByCylinder(170.0,1e7,12e-13,12e-9,   0.0, 0.0, -1.0 , 0.0, 0.0, 1.0, 0.0, 5.05e-4);
-
-//初始化高压区压力30MPa
-var grad = new Array(0, 0, 0); 
-fracsp.ApplyConditionByCylinder("pp", 30e6, grad, 0.0, 0.0, -1.0 , 0.0, 0.0, 1.0, 0.0, 5.05e-4);
-
-//监测破裂度、等效破裂度及流体总质量
-dyna.Monitor("gvalue","gv_spring_crack_ratio");
-dyna.Monitor("gvalue","gv_spring_equiv_crack_ratio");
-dyna.Monitor("gvalue","gv_fracsp_total_mass");
-
-//循环设置监测点
-for(var i = 0; i <= 9; i++)
-{
-dyna.Monitor("block", "xvel",  5e-4 + i * 1e-3,  0, 0);
-}
-
-for(var i = 0; i <= 9; i++)
-{
-dyna.Monitor("block", "sxx",  5e-4 + i * 1e-3,  0, 0);
-}
-
-
-//设置计算时步
-dyna.Set("Time_Step 3e-9");
-
-//计算35us
-dyna.DynaCycle(35e-6);
-
-//打印提示信息
-print("Solution Finished");
-
-
-
-
-
+// 输出破裂块度信息
+blkdyn.ExportGradationCurveByGroup(1, 1);
```
