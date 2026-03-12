# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-库水涨落对边坡稳定性的影响-WaterSlope.js

## Query
我现在要做一个CDyna案例的数值模拟，场景大致是：设置当前工作路径为JavaScript脚本文件所在路径。请根据 CDEM 技术手册，合理选择blkdyn、dyna、poresp等模块，帮我写一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、边界条件与载荷、求解参数和结果监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

//关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

//包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage 1");

//开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal 1");

//设置三个方向的重力加速度
dyna.Set("Gravity 0.0 -10.0 0.0");

//将结果输出时步设定为500步
dyna.Set("Output_Interval 500");

//监测结果输出时步间隔设定为100步
dyna.Set("Moniter_Iter 100");

//计算时步
dyna.Set("Time_Step 0.001");

//瞬态可压缩液体渗流
dyna.Set("Seepage_Mode 1");

//1-牛顿流体 2-宾汉流模型
dyna.Set("Liquid_Seepage_Law 2");

//截止开度,达到该值流体停止进入
dyna.Set("PS_CirInject_Width 1e-6");

//设置整体模型的最小孔隙开度，对应的是最小孔隙率，各个地层的开度根据孔隙率大小调整
dyna.Set("Pore_Min_Width 1.4e-4");

//创建网格
blkdyn.GenBrick2D(10, 0.2, 50, 1, 1);

//定义X、Y、Z三个方向的渗透系数
var arrayK1 = new Array(1.66667e-7, 1.66667e-7, 1.66667e-7);

//指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByGroup (1810.0, 1e6, 0.0, 0.01, arrayK1, 1.0, 1);

//单独指定剪切强度
poresp.SetSinglePropByGroup("Strength", 11.75, 1);

//定义梯度
var fArrayGrad = new Array(0.0, 0.0, 0.0);

//设定模型四周的水压力边界条件
poresp.ApplyConditionByCoord("pp", 5e5, fArrayGrad, -0.5, 0.5, -1e5, 1e5, -1e5, 1e5, true);

dyna.Solve(50000);

//打印提示信息
print("Solution Finished");
```

## Ground Truth
```javascript
//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//关闭力学计算开关
dyna.Set("Mechanic_Cal 1");

//包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage 1");

//开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal 0");


//设置3个方向的重力加速度
dyna.Set("Gravity 0.0 -10 0.0");

//设置结果输出时步
dyna.Set("Output_Interval 2000");

dyna.Set("PoreSP_Bound_To_Solid 1");


blkdyn.ImportGrid("gid","slope50m.msh");


blkdyn.SetModel("linear");

blkdyn.SetMat(2000,3e8,0.3,2.8e4, 2.8e4, 25,10);

blkdyn.FixV("x", 0.0, "x", -0.01, 0.001);

blkdyn.FixV("x",0.0,"x",49.99,51);

blkdyn.FixV("y",0.0,"y",-0.001, 0.001);



//定义X、Y、Z三个方向的渗透系数
var arrayK = new Array(1e-10, 1e-10, 1e-10);

//指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByCoord (1000.0, 1e6, 0.0, 0.05, arrayK, 1.0, -500, 500, -500, 500, -500, 500);


//定义梯度1
var fArrayGrad1 = new Array(0, -1e4, 0);

var fArrayGrad2 = new Array(0, 0, 0);

//设定模型四周的水压力边界条件
poresp.ApplyConditionByCoord("pp", 10e4, fArrayGrad1, -1, 11,  0.001, 10.01, -500, 500, true);

poresp.InitConditionByCoord("pp", 10e4, fArrayGrad1,  -500, 500,-1, 10.01, -500, 500, false);
poresp.InitConditionByCoord("sat", 1.01, fArrayGrad2, -500, 500, -500, 10.01, -500, 500, false);




dyna.Solve();

blkdyn.SetModel("MC");

dyna.Solve();


//打开孔隙渗流与固体耦合的比奥固结计算开关
dyna.Set("If_Biot_Cal 1");
dyna.Set("PoreSeepage_Cal 1");
dyna.Solve();
dyna.Solve();

//定义BaseValue（三个方向基础值）及Grad（三个方向梯度值）两个数组
var BaseValue = [0, 0, 0];
var Grad      = [0, 0, 0, 0, 0, 0, 0, 0, 0];

//对模型所有单元初始化地应力
blkdyn.InitConditionByCoord("displace", BaseValue, Grad,  -1e3,1e3, -1e3,1e3, -1e3,1e3);



var fArrayGrad = [0.0, -1e4, 0.0];
var aValue = new Array();
aValue[0] = [0,  1.0e5];
aValue[1] = [0.5e5,1.2e5];
aValue[2] = [1.0e5,1.4e5];
aValue[3] = [1.5e5,1.6e5];
aValue[4] = [2.0e5,1.8e5];
aValue[5] = [2.5e5,2.0e5];
aValue[6] = [2.6e5,1.8e5];
aValue[7] = [2.7e5,1.6e5];
aValue[8] = [2.8e5,1.4e5];
aValue[9] = [2.9e5,1.2e5];
aValue[10] = [3.0e5,1.0e5];

poresp.ApplyDynaConditionByCoord("pp",aValue, fArrayGrad, -1, 11,  0.001, 19.999, -1,1, true);
poresp.ApplyDynaConditionByCoord("pp",aValue, fArrayGrad, -1, 0.001,  -0.001, 0.001, -1,1, true);



dyna.Monitor("block", "xdis", 8,8,0);
dyna.Monitor("block", "xdis", 9,14,0);
dyna.Monitor("block", "xdis", 10,20,0);

dyna.Monitor("block", "shear_plastic_strain", 8,8,0);
dyna.Monitor("block", "shear_plastic_strain", 9,14,0);
dyna.Monitor("block", "shear_plastic_strain", 10,20,0);

dyna.Monitor("block", "fpp", 8,8,0);
dyna.Monitor("block", "fpp", 9,14,0);


blkdyn.InitialBlockState();


//自动计算时步
dyna.TimeStepCorrect();

dyna.Set("Time_Step 10");

//求解10万步
dyna.Solve(100000);

//打印提示信息
print("Solution Finished");

```
