# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-矿石冲击破坏过程模拟-RockCompressure.js

## Query
我现在要做一个CDyna案例的数值模拟，场景大致是：设置当前工作路径为JavaScript脚本文件所在路径。请根据 CDEM 技术手册，合理选择blkdyn、dyna、rdface等模块，帮我写一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、边界条件与载荷、求解参数和结果监测。

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

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//颗粒接触的更新时步为10
dyna.Set("Renew_Interval 10");

//设置接触容差为0
dyna.Set("Contact_Detect_Tol 5e-3");

dyna.Set("If_Renew_Contact 1");

dyna.Set("If_Cal_EE_Contact 1");

imeshing.genBrick3D("g1",5,5,5,5,5,5);

blkdyn.GetMesh(imeshing);

blkdyn.CrtIFace();

blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");

blkdyn.SetMat(2500,5e8, 0.25, 1e4, 1e4, 15, 10);

blkdyn.SetIModel("brittleMC");

blkdyn.SetIStiffByElem(1.0);
blkdyn.SetIStrengthByElem();

blkdyn.SetLocalDamp(0.01);

rdface.Create(2,2,4,[-10,0,-10, 15,0,-10, 15,0,15,  -10,0,15]);

rdface.ApplyDynaVel("nor-7-lef-hori.txt", [3,0,3], [1,0,1], 1, 11);
rdface.ApplyDynaVel("nor-7-lef-ver.txt", [0,3,0], [0,1,0], 1, 11);

//设定动态计算时步
dyna.TimeStepCorrect(0.5);

dyna.Monitor("rdface", "rg_xVel",  1, 11,0);
dyna.Monitor("rdface", "rg_yVel",  1, 11,0);
dyna.Monitor("rdface", "rg_zVel",  1, 11,0);

//动态求解28s
dyna.DynaCycle(28.0);

//打印提示信息
print("Solution Finished");
```

## Ground Truth
```javascript
//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置三个方向的重力加速度均为0
dyna.Set("Gravity 0.0 -9.8 0.0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//设置计算结果的输出间隔为100步
dyna.Set("Output_Interval 200");

//设置监测信息输出时步为10步
dyna.Set("Moniter_Iter 10");

dyna.Set("Contact_Detect_Tol 1e-5");

dyna.Set("If_Contact_Use_FaceMat 1");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

dyna.Set("If_Renew_Contact 1");

//打开瑞利阻尼计算开关
dyna.Set("If_Cal_Rayleigh 0");

dyna.Set("Contact_Search_Method 2");




//从当前文件夹导入Gmsh格式的网格
blkdyn.ImportGrid("gid", "ore.msh");



//对两侧单元均为组2的公共面进行切割，设置为接触面
blkdyn.CrtIFace(2, 2);

blkdyn.CrtBoundIFaceByCoord(-1e5,1e5,0.0479, 0.0501,-1e5,1e5);

//设置接触后，更新网格信息
blkdyn.UpdateIFaceMesh();




//指定组1的单元本构为线弹性本构
blkdyn.SetModel("linear");

//指定组1-2的材料参数
blkdyn.SetMatByGroupRange(2500, 5e10, 0.25, 15e6, 10e6, 40.0, 10.0, 2,2);

blkdyn.SetMatByGroupRange(7800, 2.1e11, 0.25, 15e6, 10e6, 40.0, 10.0, 1,1);

//将接触面模型设定为断裂能模型
blkdyn.SetIModel("FracE");

blkdyn.SetIModelByCoord("brittleMC",-1e5,1e5,0.0499, 0.0501,-1e5,1e5);

//指定所有接触面的基础材料参数
blkdyn.SetIMat(1e13, 1e13, 40.0, 15e6, 10e6);

blkdyn.SetIMatByCoord(1e13, 1e13, 5.0, 0.0, 0.0, -1e5,1e5,0.0499, 0.0501,-1e5,1e5);

//指定组1内部交界面的断裂能，拉伸断裂能100Pa.m，剪切断裂能1000Pa.m
blkdyn.SetIFracEnergyByGroupInterface(10, 10, 1, 1);






//监测接触面的破坏度及破裂度
dyna.Monitor("gvalue","gv_spring_broken_ratio");
dyna.Monitor("gvalue","gv_spring_crack_ratio");

//将局部阻尼设置为0.0
blkdyn.SetLocalDamp(0.05);

//将刚度阻尼系数设置为5e-7，质量阻尼系数设置为0.0
//blkdyn.SetRayleighDamp(5e-7, 0.0);

//设置全局计算时步
dyna.Set("Time_Step 5e-8");


//定义三个方向基础值
var values = new Array(0.0,-5.0, 0);
//定义变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
//将组号1到3范围内的节点速度初始化为设定值
blkdyn.InitConditionByGroup("velocity", values, gradient, 1, 1);



//blkdyn.FixV("y",0.0,"y", -1, 0.005);

//blkdyn.FixV("y",-5.0,"y", 0.045, 10);

//创建底部刚性面支撑
//刚性面的类型（1，线段  2，平面），组号， 刚性面上的总节点数，每个节点的额坐标
var fCoord=new Array();
fCoord[0]=new Array(-0.01,0.00,-0.01);
fCoord[1]=new Array(0.06,0.00,-0.01);
fCoord[2]=new Array(0.06,0.00,0.06);
fCoord[3]=new Array(-0.01,0.00,0.06);
rdface.Create (2, 1, 4, fCoord);

//设置底部刚性面参数
rdface.SetPropByGroup(1e10, 1e10, 0.0, 0.0, 5.0, 1,10);

//动力计算1ms
dyna.DynaCycle(1e-3);

//打印提示信息
print("Solution Finished");



```
