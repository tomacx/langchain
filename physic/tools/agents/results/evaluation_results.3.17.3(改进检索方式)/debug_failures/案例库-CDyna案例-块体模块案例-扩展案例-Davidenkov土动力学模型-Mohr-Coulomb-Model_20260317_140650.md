# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-Davidenkov土动力学模型-Mohr-Coulomb-Model.js

## Query
请编写一个CDyna仿真脚本，实现Mohr-Coulomb-Model，并输出必要的结果与监测。

## Generated Code
```javascript

```

## Ground Truth
```javascript
//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());


dyna.Clear();


//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置不平衡率为1e-5
dyna.Set("UnBalance_Ratio 1e-5");

//设置三个方向的重力加速度值
dyna.Set("Gravity 0.0 0.0 -9.8");

//打开大变形计算开关
dyna.Set("Large_Displace 0");

//设置云图输出间隔为500
dyna.Set("Output_Interval 1000");

//设置监测信息提取间隔为1000时步
dyna.Set("Moniter_Iter 100");


//打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

//设置虚质量计算时步
dyna.Set("Virtural_Step 0.6");

//设置单元体积膨胀断裂应变及等效剪切断裂应变
dyna.Set("Block_Soften_Value 0.01 0.03");

//导入Midas格式的网格
blkdyn.ImportGrid("Midas", "ZFT25.fpn");

//设置单元模型为线弹性模型
blkdyn.SetModel("linear");

//设置组号为1的单元材料，正方体
blkdyn.SetMat(2000, 50e6, 0.3, 0, 0, 35, 1);

//设置所有节点的局部阻尼0.8
blkdyn.SetLocalDamp(0.8);

//对模型左右两侧及底部进行法向约束
blkdyn.FixV("z", 0.0, "z", -0.05, 0.05);
blkdyn.FixV("x", 0.0, "x", -0.05, 0.05);
blkdyn.FixV("x", 0.0, "x", 0.95, 1.05);
blkdyn.FixV("y", 0.0, "y", -0.05, 0.05);
blkdyn.FixV("y", 0.0, "y", 0.95, 1.05);

//施加重力
blkdyn.ApplyGravity();


//求解至稳定
dyna.Solve();


blkdyn.SetModel ("MC");

//求解至稳定
dyna.Solve();

//保持save文件
dyna.Save("Ini-equil-20231103.sav");



//*************************初始化位移*************************
//定义三个方向基础值
var values = new Array(0.0, 0.0, 0.0);

//定义变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);

//将控制范围内的位移清零
blkdyn.InitConditionByCoord("displace", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
//**************************************************初始化位移


///////////////////////////////////以下为动力计算

//设置所有节点的局部阻尼0.0
blkdyn.SetLocalDamp(0.0);

//打开瑞利阻尼计算开关
dyna.Set("If_Cal_Rayleigh 1");

//将输入方式改为临界阻尼比和显著频率模式
dyna.Set("RDamp_Input_Option 2");

//设置瑞利阻尼（临近阻尼比，显著频率，上组号，下组号）
blkdyn.SetRayleighDampByGroup(0.03, 3, 1, 1);


//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

//设置当前时间为0
dyna.Set("Time_Now 0");


//计算时步自动修正
dyna.TimeStepCorrect(0.1);

//对模型左右两侧及底部的约束进行解除
blkdyn.FreeV("z", "z", -0.05, 0.05);
blkdyn.FreeV("x", "x", -0.05, 0.05);
blkdyn.FreeV("x", "x", 0.95, 1.05);
blkdyn.FreeV("y", "y", -0.05, 0.05);
blkdyn.FreeV("y", "y", 0.95, 1.05);



//模型周围施加自由场边界
//模型施加三维Plane自由场单元
blkdyn.SetFreeFieldBound("x", -0.01, 0.01);
blkdyn.SetFreeFieldBound("x", 0.99, 1.01);
blkdyn.SetFreeFieldBound("y", -0.01, 0.01);
blkdyn.SetFreeFieldBound("y", 0.99, 1.01);

//三维情况下需要施加Column自由场单元（必须在三维Plane自由场单元施加完毕后进行）
blkdyn.SetFreeFieldBound3DColumn ();

//模型底部施加无反射边界条件
blkdyn.SetQuietBoundByCoord(-2e5, 2e5, -2e5, 2e5, -0.01, 0.01);

//*********************施加地震应力**************************
//指定三个方向的载荷系数
var coeff1= new Array(1e5, 0, 0);

//x方向下限及上限
var x= new Array(-2e5,2e5);

//y方向下限及上限
var y= new Array(-2e5,2e5);

//z方向下限及上限
var z= new Array(-0.01, 0.01);

//水平方向地震应力-正弦时程曲线
//剪切波-面力、载荷系数、衰减指数、振幅、周期、初相位、开始时间、结束时间
blkdyn.ApplyDynaSinVarByCoord ("face_force", false, coeff1, 0, 1.0, 0.5, 0, 0, 20, x, y, z);

//监测基岩中水平及竖直方向的速度
dyna.Monitor("block", "xacc", 0.5, 0, 0.1);
dyna.Monitor("block", "xacc", 0.5, 0, 0.3);
dyna.Monitor("block", "xacc", 0.5, 0, 0.5);
dyna.Monitor("block", "xacc", 0.5, 0, 0.7);
dyna.Monitor("block", "xacc", 0.5, 0, 1.0);


//动态求解20s
dyna.DynaCycle(5.0);

//打印提示信息
print("Solution Finished");
```

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-扩展案例-Davidenkov土动力学模型-Mohr-Coulomb-Model.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-扩展案例-Davidenkov土动力学模型-Mohr-Coulomb-Model.js (generated)
@@ -1,161 +0,0 @@
-//设置当前工作路径为JavaScript脚本文件所在路径
-setCurDir(getSrcDir());
-
-
-dyna.Clear();
-
-
-//打开力学计算开关
-dyna.Set("Mechanic_Cal 1");
-
-//设置不平衡率为1e-5
-dyna.Set("UnBalance_Ratio 1e-5");
-
-//设置三个方向的重力加速度值
-dyna.Set("Gravity 0.0 0.0 -9.8");
-
-//打开大变形计算开关
-dyna.Set("Large_Displace 0");
-
-//设置云图输出间隔为500
-dyna.Set("Output_Interval 1000");
-
-//设置监测信息提取间隔为1000时步
-dyna.Set("Moniter_Iter 100");
-
-
-//打开虚质量计算开关
-dyna.Set("If_Virtural_Mass 1");
-
-//设置虚质量计算时步
-dyna.Set("Virtural_Step 0.6");
-
-//设置单元体积膨胀断裂应变及等效剪切断裂应变
-dyna.Set("Block_Soften_Value 0.01 0.03");
-
-//导入Midas格式的网格
-blkdyn.ImportGrid("Midas", "ZFT25.fpn");
-
-//设置单元模型为线弹性模型
-blkdyn.SetModel("linear");
-
-//设置组号为1的单元材料，正方体
-blkdyn.SetMat(2000, 50e6, 0.3, 0, 0, 35, 1);
-
-//设置所有节点的局部阻尼0.8
-blkdyn.SetLocalDamp(0.8);
-
-//对模型左右两侧及底部进行法向约束
-blkdyn.FixV("z", 0.0, "z", -0.05, 0.05);
-blkdyn.FixV("x", 0.0, "x", -0.05, 0.05);
-blkdyn.FixV("x", 0.0, "x", 0.95, 1.05);
-blkdyn.FixV("y", 0.0, "y", -0.05, 0.05);
-blkdyn.FixV("y", 0.0, "y", 0.95, 1.05);
-
-//施加重力
-blkdyn.ApplyGravity();
-
-
-//求解至稳定
-dyna.Solve();
-
-
-blkdyn.SetModel ("MC");
-
-//求解至稳定
-dyna.Solve();
-
-//保持save文件
-dyna.Save("Ini-equil-20231103.sav");
-
-
-
-//*************************初始化位移*************************
-//定义三个方向基础值
-var values = new Array(0.0, 0.0, 0.0);
-
-//定义变化梯度
-var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
-
-//将控制范围内的位移清零
-blkdyn.InitConditionByCoord("displace", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
-//**************************************************初始化位移
-
-
-///////////////////////////////////以下为动力计算
-
-//设置所有节点的局部阻尼0.0
-blkdyn.SetLocalDamp(0.0);
-
-//打开瑞利阻尼计算开关
-dyna.Set("If_Cal_Rayleigh 1");
-
-//将输入方式改为临界阻尼比和显著频率模式
-dyna.Set("RDamp_Input_Option 2");
-
-//设置瑞利阻尼（临近阻尼比，显著频率，上组号，下组号）
-blkdyn.SetRayleighDampByGroup(0.03, 3, 1, 1);
-
-
-//关闭虚质量计算开关
-dyna.Set("If_Virtural_Mass 0");
-
-//设置当前时间为0
-dyna.Set("Time_Now 0");
-
-
-//计算时步自动修正
-dyna.TimeStepCorrect(0.1);
-
-//对模型左右两侧及底部的约束进行解除
-blkdyn.FreeV("z", "z", -0.05, 0.05);
-blkdyn.FreeV("x", "x", -0.05, 0.05);
-blkdyn.FreeV("x", "x", 0.95, 1.05);
-blkdyn.FreeV("y", "y", -0.05, 0.05);
-blkdyn.FreeV("y", "y", 0.95, 1.05);
-
-
-
-//模型周围施加自由场边界
-//模型施加三维Plane自由场单元
-blkdyn.SetFreeFieldBound("x", -0.01, 0.01);
-blkdyn.SetFreeFieldBound("x", 0.99, 1.01);
-blkdyn.SetFreeFieldBound("y", -0.01, 0.01);
-blkdyn.SetFreeFieldBound("y", 0.99, 1.01);
-
-//三维情况下需要施加Column自由场单元（必须在三维Plane自由场单元施加完毕后进行）
-blkdyn.SetFreeFieldBound3DColumn ();
-
-//模型底部施加无反射边界条件
-blkdyn.SetQuietBoundByCoord(-2e5, 2e5, -2e5, 2e5, -0.01, 0.01);
-
-//*********************施加地震应力**************************
-//指定三个方向的载荷系数
-var coeff1= new Array(1e5, 0, 0);
-
-//x方向下限及上限
-var x= new Array(-2e5,2e5);
-
-//y方向下限及上限
-var y= new Array(-2e5,2e5);
-
-//z方向下限及上限
-var z= new Array(-0.01, 0.01);
-
-//水平方向地震应力-正弦时程曲线
-//剪切波-面力、载荷系数、衰减指数、振幅、周期、初相位、开始时间、结束时间
-blkdyn.ApplyDynaSinVarByCoord ("face_force", false, coeff1, 0, 1.0, 0.5, 0, 0, 20, x, y, z);
-
-//监测基岩中水平及竖直方向的速度
-dyna.Monitor("block", "xacc", 0.5, 0, 0.1);
-dyna.Monitor("block", "xacc", 0.5, 0, 0.3);
-dyna.Monitor("block", "xacc", 0.5, 0, 0.5);
-dyna.Monitor("block", "xacc", 0.5, 0, 0.7);
-dyna.Monitor("block", "xacc", 0.5, 0, 1.0);
-
-
-//动态求解20s
-dyna.DynaCycle(5.0);
-
-//打印提示信息
-print("Solution Finished");
```
