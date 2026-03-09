# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-库水涨落对边坡稳定性的影响-WaterSlope.js

## Query
我现在要做一个CDyna案例的数值模拟，场景大致是：设置当前工作路径为JavaScript脚本文件所在路径。请根据 CDEM 技术手册，合理选择blkdyn、dyna、poresp等模块，帮我写一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、边界条件与载荷、求解参数和结果监测。

## Generated Code
```javascript
//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

//清除GDEM-Env中的结果数据
doc.clearResult();

//设置粒子模型更新间隔
dyna.Set("Particle_Renew_Interval 1")

//设置输出的间隔为500步
dyna.Set("Output_Interval 500");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

//设置3个方向的全局重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

//设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

//设置计算时步为1e-4
dyna.Set("Time_Step 5e-5");

//导入刚性面网格
rdface.Import(2,"ring.msh");

//创建第一组随机颗粒
var x = [-0.6, 0.6];
var y = [-0.6, 0.0];
var z = [-1,1];
pdyna.CreateByCoord(5000,1,1, 0.01, 0.01, 0.0, x, y, z);

//创建第二组随机颗粒
y[0] = 0.0;
y[1] = 0.6;
pdyna.CreateByCoord(5000,2,1, 0.03, 0.03, 0.005,  x, y, z);

//设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

dyna.Solve(50000);
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
