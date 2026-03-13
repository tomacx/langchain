# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-含切槽半圆盘冲击劈裂过程模拟-SemiCircleImpact.js

## Query
请复现一个CDyna案例的 JavaScript 案例脚本，案例文件名为「案例库-CDyna案例-块体模块案例-扩展案例-含切槽半圆盘冲击劈裂过程模拟-SemiCircleImpact.js」，场景/主题为：块体模块案例 - 扩展案例 - 含切槽半圆盘冲击劈裂过程模拟 - SemiCircleImpact。请严格依据 CDEM 技术手册/API（优先）来选择与确认接口与参数含义。必须使用到这些模块：blkdyn、dyna。请按“几何建模→网格划分→材料/模型→边界/载荷→求解参数→结果输出/监测”的顺序组织脚本，并确保脚本以 setCurDir(getSrcDir()); 开头。脚本注释/意图线索：设置当前工作路径为JavaScript脚本文件所在路径；打开力学计算开关；设置系统不平衡率；设置3个方向的重力加速度为0；关闭大变形计算开关；计算结果输出间隔为2000步；关闭GiD结果输出开关；将监测间隔为100步；打开虚质量计算开关；将虚拟时步设定为0.5；设定接触容差为0.0；关闭接触更新开关；关闭Save自动存储开关；创建半径为2cm的圆盘；blkdyn.GenCircle(0.0, 0.02, 20,60, 1);；blkdyn.ImportGrid("ansys","2D_Extrude_AnsysCDEM.dat");；将组号为1的单元交界。API 调用关键词（用于检索技术手册）：dyna.Set，dyna.Monitor，blkdyn.ApplyDynaLineVarByCoord，blkdyn.FixVByCoord，blkdyn.ImportGrid，blkdyn.SetIMat，blkdyn.SetIMatByLineFit2，blkdyn.CrtIFace。

## Generated Code
```javascript

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
