# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-煤层开采引起地下水渗流-MineExca_-_OK.js

## Query
请生成一个CDyna案例的脚本，功能是块体模块案例-扩展案例-煤层开采引起地下水渗流-MineExca_-_OK

## Generated Code
```javascript
该代码片段是用于模拟煤矿地下开采与液压支架耦合的CDyna案例。它包含了块体模块和扩展案例的相关设置。

首先，代码片段定义了几种材料的弹性模量、泊松比和强度等参数，并将它们赋值给块体模块中的单元。

其次，代码片段设置了几组法向约束，以限制模型的运动。这些约束包括X方向左侧法向约束、X方向右侧法向约束和Y方向底部法向约束。

接着，代码片段设置了局部阻尼为0.8，并监测了几个关键点的应力和应变。

然后，代码片段将所有单元的计算模型设定为线弹性模型，并赋空支架单元。

接下来，代码片段进行弹性计算并保存结果文件。

随后，代码片段将所有单元的计算模型设定为Mohr-Coulomb理想弹塑性模型，并开切眼。然后，代码片段设置了液压支架模型和单元挖空或移架后的接触关系。

最后，代码片段进行了一系列的循环迭代，每次迭代中都会移动液压支架并求解6万步，然后保存结果文件。

该代码片段主要用于模拟煤矿地下开采与液压支架耦合的过程，并可以帮助工程师们了解和预测这种复杂系统的行为。
```

## Ground Truth
```javascript
////设置结果保存路径为JS文件所在路径
setCurDir(getSrcDir());

////几何建模清除
igeo.clear();

////网格剖分清除
imeshing.clear();

////Dyna模块清除
dyna.Clear();

////平台显示结果清除
doc.clearResult();


////打开大变形计算开关
dyna.Set("Large_Displace 1");

////设置重力加速度值
dyna.Set("Gravity 0 -9.8 0");

////打开虚拟时步计算开关
dyna.Set("If_Virtural_Mass 1");

////设置虚拟时步
dyna.Set("Virtural_Step 0.2");

////设置不平衡率
dyna.Set("UnBalance_Ratio 0.0001");

////设置云图输出间隔
dyna.Set("Output_Interval 1000");

////设置监测信息输出间隔
dyna.Set("Moniter_Iter 100");

////打开设置接触开关
dyna.Set("If_Renew_Contact 1");

////设置接触容差
dyna.Set("Contact_Detect_Tol 2e-2");


////设置虚拟界面拉伸断裂位移及剪切断裂位移
dyna.Set("Interface_Soften_Value 1e-005  3e-005");

//包含裂隙渗流计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

//关闭裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 0");

//数值最大裂隙开度为2um
//dyna.Set("FS_MaxWid 2e-5");

//设置裂隙流模型为可压缩流体模型
dyna.Set("Seepage_Mode 1");

//关闭裂隙渗流与固体耦合开关（孔隙渗流无此开关）
dyna.Set("FS_Solid_Interaction 0");

//打开仅接触面破裂或接触面为预设面时进行压力传递及更新开度
//dyna.Set("FS_Frac_Start_Cal 1");



//导入计算网格
blkdyn.ImportGrid("gmsh", "GDEM.msh");

////所有单元边界均设置为接触面
blkdyn.CrtIFace();

////设置接触面后更新拓扑关系
blkdyn.UpdateIFaceMesh();



////设置单元模型为线弹性模型
blkdyn.SetModel("linear");

////设置材料参数，分别为密度，弹性模量，泊松比，粘聚力、抗拉强度、内摩擦角、剪胀角、组号
////第1层，地层名称：第四系松散砂层
blkdyn.SetMat(1072, 0.06e9, 0.31, 57.8e3, 9.29e3, 17.7, 10, 6);

////第2层，地层名称：离石组黄土层
blkdyn.SetMat(1800, 0.02e9, 0.25, 50e3, 30e3,28.0, 10, 5);

////第3层，地层名称：静乐组红土层
blkdyn.SetMat(2000, 0.04e9, 0.28, 70e3, 35e3, 20, 10, 4);

////第4层，地层名称：基岩风化带
blkdyn.SetMat(2040, 0.02e9, 0.3, 70e3, 35e3, 27, 10, 3);

////第5层，地层名称：延安组砂泥岩互层
blkdyn.SetMat(1770, 0.09e8, 0.35, 50e3, 30e3, 25, 10, 2);

////第6层，地层名称：煤
blkdyn.SetMat(1400, 0.02e9, 0.3, 25e3, 30e3, 20, 10, 1);

////第7层，地层名称：基岩
blkdyn.SetMat(2500, 2e9, 0.25, 6e6, 3e6, 35, 10, 7);


////设置接触面本构模型为线弹性模型
blkdyn.SetIModel("linear");

////接触面刚度从单元中继承
blkdyn.SetIStiffByElem(1);
//k = E * A / (L / ahpha);

////接触面强度从单元中继承
blkdyn.SetIStrengthByElem();

//blkdyn.SetIMat();

////设置层间接触强度系数
//blkdyn.SetIMatReductionByGroupInterface("cohesion", 5.000000e-001, -1, -1);
//blkdyn.SetIMatReductionByGroupInterface("tension", 5.000000e-001, -1, -1);
//blkdyn.SetIMatReductionByGroupInterface("friction", 5.000000e-001, -1, -1);

////模型左侧法向位移约束
blkdyn.FixV("x", 0.0, "x", -1, 1);

////模型右侧法向位移约束
blkdyn.FixV("x", 0.0, "x", 399, 401);

////模型底部法向位移约束
blkdyn.FixV("y", 0.0, "y", -10.1, -9.9);


////////////////裂隙渗流
//裂隙单元从固体单元中继承
fracsp.CreateGridFromBlock(2);

//设置裂隙渗流参数，依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
var k = 12e-15;
var w = Math.sqrt(12 * 1e-3 * k);
fracsp.SetPropByGroup(1000,1e7,k,w,1,11);
fracsp.SetPropByGroup(1000,1e7,1e-14,1.1e-8,4,4);

//对坐标范围内的裂隙压力进行初始化
fracsp.InitConditionByGroup("pp", 16900, [0, -100, 0], 5, 5);
fracsp.InitConditionByGroup("sat", 1.01, [0,0,0], 5, 5);


////弹性求解至稳定，获得弹性应力场
dyna.Solve();

////设置单元模型
blkdyn.SetModel("MC");

////塑性及破裂场求解至稳定
dyna.Solve();

////存储Save文件
dyna.Save("Plastic.sav");
//dyna.Restore("Plastic.sav");




//打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

//打开裂隙渗流与固体耦合开关（孔隙渗流无此开关）
dyna.Set("FS_Solid_Interaction 1");


dyna.Set("Time_Now 0.0");

dyna.Set("Time_Step 1");

////设置接触面模型
blkdyn.SetIModel("SSMC");

////设置局部阻尼
blkdyn.SetLocalDamp(1.000000e-002);

////位移清零
var values = new Array(0, 0, 0);
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
blkdyn.InitConditionByCoord("displace", values, gradient, -1e10, 1e10, -1e10, 1e10, -1e10, 1e10);

//////////////////////////开采计算
for(var i = 0; i < 10; i++)
{
    ////开挖区段煤层
    blkdyn.SetModelByGroupAndCoord("none", 1, 1, 50 + i * 5, 50 + (i + 1) * 5, -1e20, 1e20, -1e20, 1e20);

    ////迭代求解设定步数
    dyna.Solve(10000);

    ////存储Save文件
    var fileName = "Excav_" + (i+1) + ".sav"
    dyna.Save(fileName);
}
print("本次煤层开采垮落数值模拟正常结束!");
```
