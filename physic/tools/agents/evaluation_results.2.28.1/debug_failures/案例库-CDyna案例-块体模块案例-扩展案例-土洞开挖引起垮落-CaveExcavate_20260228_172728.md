# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-土洞开挖引起垮落-CaveExcavate.js

## Query
我现在要做一个CDyna案例的数值模拟，场景大致是：设置当前工作路径为JavaScript脚本文件所在路径。请根据 CDEM 技术手册，合理选择blkdyn、dyna等模块，帮我写一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、边界条件与载荷、求解参数和结果监测。

## Generated Code
```javascript
//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

//清除GDEM-Env中的结果数据
doc.clearResult();

//设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

//设置接触容差
dyna.Set("Contact_Detect_Tol 5e-3");

dyna.Set("Bounding_Box 1 1.0");

//设置底部刚性面
var fCoord = new Array();
fCoord[0]=new Array(-4.0,-2.0,0.0);
fCoord[1]=new Array(4.0,-2.0,0.0);
rdface.Create (1, 1, 2, fCoord);

//导入gid格式的颗粒
pdyna.Import("gid","D2mCircel.msh");

//设置颗粒接触模型为考虑应变软化的Mohr-Coulomb模型
pdyna.SetModel("SSMC");

//设置颗粒的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e8, 0.25, 1e6, 5e6, 30, 0.0, 0.1);

//设置动态计算时步为1e-4秒
dyna.Set("Time_Step 5e-5");
```

## Ground Truth
```javascript
//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置不平衡率为1e-5
dyna.Set("UnBalance_Ratio 1e-4");

//设置3个方向的重力加速度均为0.0
dyna.Set("Gravity 0 -9.8 0");

//关闭大变形计算开关
dyna.Set("Large_Displace 1");

dyna.Set("If_Renew_Contact 1")

//设置结果输出时步为1000步
dyna.Set("Output_Interval 1000");

//监测信息的输出时步为100步
dyna.Set("Moniter_Iter 100");

//打开虚拟质量计算开关
dyna.Set("If_Virtural_Mass 1");

//设置虚拟时步为0.5
dyna.Set("Virtural_Step 0.5");

dyna.Set("Contact_Detect_Tol 1e-5");

dyna.Set("Contact_Search_Method 2");

//导入Gmsh格式的巷道网格文件
blkdyn.ImportGrid("Gmsh", "171222-cave.msh");


blkdyn.CrtIFace();

blkdyn.UpdateIFaceMesh();


//设置实体单元为线弹性模型
blkdyn.SetModel("linear");

//设置固体单元的材料参数
blkdyn.SetMat(1800,70e6,0.3,25e3,3e3,25,15);


//设定所有接触面的本构为脆性断裂的Mohr-Coulomb本构
blkdyn.SetIModel("linear");

//设定接触面上的材料，依次为单位面积法向刚度、单位面积切向刚度、内摩擦角、粘聚力、抗拉强度
blkdyn.SetIStiffByElem(1.0);

blkdyn.SetIStrengthByElem();

//底部法向约束
blkdyn.FixV("xy", 0.0, "y", -0.001, 0.001);

//左侧法向约束
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);

//右侧法向约束
blkdyn.FixV("x", 0.0, "x", 65.999, 66.7);

//设置局部阻尼为0.8
blkdyn.SetLocalDamp(0.8);


//顶部竖直位移监测
for(var i = 0; i < 15; i++)
{
    var fvalue = 12 + 3 * i;
    dyna.Monitor("block","ydis",fvalue, 39, 0);
}

//顶部水平位移监测
for(var i = 0; i < 15; i++)
{
    var fvalue = 12 + 3 * i;
    dyna.Monitor("block","xdis",fvalue, 39, 0);
}


//中部竖直应力监测
for(var i = 0; i < 15; i++)
{
    var fvalue = 12 + 3 * i;
    dyna.Monitor("block","syy",fvalue, 6, 0);
}

//中部水平应力监测
for(var i = 0; i < 15; i++)
{
    var fvalue = 12 + 3 * i;
    dyna.Monitor("block","sxx",fvalue, 6, 0);
}

//系统破裂度监测
dyna.Monitor("gvalue","gv_spring_crack_ratio");

//求解至稳定
dyna.Solve();

dyna.Save("Initial.sav");


blkdyn.SetModel("MC");

blkdyn.SetIModel("FracE");

blkdyn.SetIFracEnergyByGroupInterface(100.0,500.0, 1,1);

//**************************************************初始化位移
//定义三个方向基础值
var values = new Array(0.0,0.0, 0);

//定义变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);

//将控制范围内的位移清零
blkdyn.InitConditionByCoord("displace", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
//**************************************************初始化位移


//设置局部阻尼为0.01
blkdyn.SetLocalDamp(0.01);

//求解1.5w
dyna.Solve(15000);




```
