# Failure Analysis: 案例库-CDyna案例-块体模块案例-基本案例-PoreFracSeepSolid-PoreFracSeepSolid.js

## Query
我现在要做一个CDyna案例的数值模拟，场景大致是：设置当前工作路径为JavaScript脚本文件所在路径。请根据 CDEM 技术手册，合理选择blkdyn、dyna、poresp等模块，帮我写一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、边界条件与载荷、求解参数和结果监测。

## Generated Code
```javascript
var searchResult = search_physics_knowledge({"query": "CDyna案例"});
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

//设置计算结果的输出间隔为1000步
dyna.Set("Output_Interval 1000");

//打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

//设置虚质量时步为0.5
dyna.Set("Virtural_Step 0.5");

//设置满足稳定条件的系统不平衡率
dyna.Set("UnBalance_Ratio 1e-4");

//关闭接触更新计算开关
dyna.Set("If_Renew_Contact 0");

//设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

//包含孔隙渗流计算模块，开辟相应内存
dyna.Set("Config_PoreSeepage 1");

//关闭孔隙渗流计算开关
dyna.Set("PoreSeepage_Cal 0");

//包含裂隙渗流计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

//关闭裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 0");

//关闭裂隙渗流与固体耦合开关（孔隙渗流无此开关）
dyna.Set("FS_Solid_Interaction 0");

//创建长100m，高50m的矩形
blkdyn.GenBrick2D(100,50,100,50,1);

//对公共面进行切割，形成接触面；四周自由面不切割
blkdyn.CrtIFaceByCoord(0.001, 99.99, 0.001, 49.99, -1e5, 1e5);

//更新接触面网格
blkdyn.UpdateIFaceMesh();

//设定所有单元的本构为线弹性本构
blkdyn.SetModel("linear");

//设定组号为1-100之间的材料参数
blkdyn.SetMat(2500, 5e10, 0.25, 8e6, 3e6, 40.0, 15.0, 1, 100);

//设定所有接触面的本构为线弹性模型
blkdyn.SetIModel("linear");

//接触面刚度从单元中获取
blkdyn.SetIStiffByElem(10.0);

//接触面强度从单元中获取
blkdyn.SetIStrengthByElem();

//设定全部节点的局部阻尼系数为0.8
blkdyn.SetLocalDamp(0.8);

//固定模型四周的法向速度，为0.0
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 99.99,101);
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);
blkdyn.FixV("y", 0.0, "y", 49.99, 51);


//*******************************************初始化地应力

//定义三个方向基础值
var values = new Array(-10e6, -5e6, -10e6);

//定义变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);

//将控制范围内的位移清零
blkdyn.InitConditionByCoord("stress", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

//*******************************************初始化地应力


//定义X、Y、Z三个方向的渗透系数
var arrayK = new Array(1e-10, 1e-10, 1e-10);

//指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByCoord (1000.0, 1e7, 0.0, 0.01, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

//从固体单元接触面创建裂隙单元
fracsp.CreateGridFromBlock (2);

//设置裂隙渗流参数，依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
fracsp.SetPropByGroup(1000.0,1e7,12e-9,12e-6,1,11);

//定义三个方向梯度值
var fArrayGrad = [0.0, 0.0, 0.0];

//左侧中间裂隙入口处指定入口单宽流量1.4e-3
fracsp.ApplyConditionByCoord("source", 1.4e-3, fArrayGrad, -0.01, 0.01, 24.99, 25.01, -1e5, 1e5);

//求解至稳定
dyna.Solve();

//将接触面模型切换至脆性断裂的Mohr-Coulomb模型
blkdyn.SetIModel("brittleMC");

//求解至稳定
dyna.Solve();

//监测入口处测点Y方向的位移
dyna.Monitor("block", "ydis", 0, 25, 0);

//监测典型测点的裂隙压力
dyna.Monitor("fracsp", "sc_pp", 0, 25, 0);
dyna.Monitor("fracsp", "sc_pp", 20, 25, 0);
dyna.Monitor("fracsp", "sc_pp", 40, 25, 0);
dyna.Monitor("fracsp", "sc_pp", 60, 25, 0);

//设置计算时步
dyna.Set("Time_Step 2e-4");

//打开孔隙渗流计算开关
dyna.Set("PoreSeepage_Cal 1");

//打开孔隙渗流与固体耦合的比奥固结计算开关
dyna.Set("If_Biot_Cal 1");

//打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

//打开裂隙渗流与固体耦合开关
dyna.Set("FS_Solid_Interaction 1");

//打开裂隙渗流与孔隙渗流的耦合开关
dyna.Set("FS_PoreS_Interaction 1");

//计算20万步
dyna.Solve(200000);

//打印提示信息
print("Solution Finished");






```
