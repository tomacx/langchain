# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-简单水力压裂-破裂加压-HydroFracture.js

## Query
请生成一个CDyna案例的脚本，功能是块体模块案例-扩展案例-简单水力压裂-破裂加压-HydroFracture

## Generated Code
```javascript
//打开裂隙渗流与固体耦合开关
dyna.Set("FS_Solid_Interaction 1");

//打开裂隙渗流与孔隙渗流的耦合开关
dyna.Set("FS_PoreS_Interaction 1");

//计算810s
dyna.DynaCycle(810);
dyna.Save("DynaCycle.sav");
//dyna.Restore("DynaCycle.sav");
//打印提示信息
print("Solution Finished");

////////////////////获取破裂的裂隙单元及对应的裂隙开度/////////////////////////
//创建文件
var fso = new ActiveXObject("Scripting.FileSystemObject");
var FracInfo = fso.CreateTextFile("FracInfo.txt", true);

//获取裂隙单元总数
var nFSElemNum = dyna.GetValue("Total_FS_ElemNum");
nFSElemNum = Math.round(nFSElemNum);

//获取裂隙初始开度
var InitWidth = fracsp.GetElemValue(1, "CWidthIni");

var TotalFracElem = 0;
var FracElemInfo = new Array();

for (var i = 0; i < nFSElemNum; i++)
{
    //获取裂隙单元的ID
    var elemId = fracsp.GetElemValue(i, "CFS_ElemID");
    
    //获取裂隙单元的两侧有限元单元体心
    var leftNode = fracsp.GetElemValue(i, "CFace_LeftNode");
    var rightNode = fracsp.GetElemValue(i, "CFace_RightNode");

    //计算裂隙开度
    var width = Math.abs(leftNode - rightNode);

    //添加到FracElemInfo数组中
    FracElemInfo.push([elemId, leftNode, rightNode, width]);
}

//写入文件
var fso = new ActiveXObject("Scripting.FileSystemObject");
var FracInfo = fso.CreateTextFile("FracInfo.txt", true);

for (var i = 0; i < TotalFracElem; i++)
{
    //裂隙开度、两侧有限元单元体心
    FracInfo.WriteLine(FracElemInfo[i][0]+ "\t" + FracElemInfo[i][1]+ "\t" + FracElemInfo[i][2]+ "\t" + FracElemInfo[i][3]);
}

//关闭文件
FracInfo.Close();
```

## Ground Truth
```javascript
//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置三个方向的重力加速度
dyna.Set("Gravity 0.0 0.0 0.0");

//打开大变形计算开关
dyna.Set("Large_Displace 0");

//设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//设置监测信息输出时步为100步
dyna.Set("Moniter_Iter 100");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

//打开接触更新计算开关
dyna.Set("If_Renew_Contact 0");

//设置子空间更新时步为100步
dyna.Set("Renew_Interval 100");

//设置接触容差为1mm
dyna.Set("Contact_Detect_Tol 1e-3");

//打开save文件自动保存开关
dyna.Set("SaveFile_Out 0");

//从当前文件夹下导入patran格式的网格文件
blkdyn.ImportGrid("gmsh", "180524-100m100m.msh");


//对组号为1的单元进行接触面切割生成
blkdyn.CrtIFace();

//更新接触面网格
blkdyn.UpdateIFaceMesh();

//设定所有单元的本构为线弹性本构
blkdyn.SetModel("linear");

//设定组号为1-100之间的材料参数
blkdyn.SetMat(2500, 3e10, 0.25, 6e6, 1e6, 35.0, 10.0, 1, 100);

//设定所有接触面的本构为脆性断裂的Mohr-Coulomb本构
blkdyn.SetIModel("linear");

//设定接触面上的材料，依次为单位面积法向刚度、单位面积切向刚度、内摩擦角、粘聚力、抗拉强度
blkdyn.SetIMat(1e11, 1e11, 35.0, 6e6, 1e6);

//var coord1 = [35,60,0];
//var coord2 = [65,80,0];
//blkdyn.SetIMatByLineFit2(1e11, 1e11, 20, 1e5, 1e5, coord1, coord2);


blkdyn.SetPreIFaceByCoord(1,50.1,50.3,50.8,51.0,-1,1);


//对设定范围内的节点固定其x及y方向的速度
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 99.99,201);
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);
blkdyn.FixV("y", 0.0, "y", 99.99,201);


//设定全部节点的局部阻尼系数为0.01
blkdyn.SetLocalDamp(0.8);

//监测三个典型测点的竖直方向的位移
dyna.Monitor("block", "ydis", 200, 140, 0);
dyna.Monitor("block", "ydis", 400, 140, 0);
dyna.Monitor("block", "ydis", 600, 140, 0);


//初始化地应力
var stress = [-10e6, -20e6, -15e6];

var gradient = [0,0,0,0,0,0,0,0,0];

blkdyn.InitConditionByCoord("stress",stress, gradient,-1e5,1e5,-1e5,1e5,-1e5,1e5);

dyna.Solve();

var fc = [50,50,0];

blkdyn.SetIModel("brittleMC");

blkdyn.SetSimpleHyFracPram(1,1,25e6,1e5,fc,true);

dyna.Set("Time_Step 1");

//计算5万步
dyna.Solve(50000);

//打印提示信息
print("Solution Finished");



```
