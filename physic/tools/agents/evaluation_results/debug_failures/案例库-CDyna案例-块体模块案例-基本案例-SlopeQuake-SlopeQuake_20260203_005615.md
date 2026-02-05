# Failure Analysis: 案例库-CDyna案例-块体模块案例-基本案例-SlopeQuake-SlopeQuake.js

## Query
请生成一个CDyna案例的脚本，功能是块体模块案例-基本案例-SlopeQuake-SlopeQuake

## Generated Code
```javascript
这个案例是基于CDyna的块体模块案例，主要用于模拟二维边坡与杆件爆源模型。该案例包含了以下关键步骤：

1. 设置接触面为线弹性模量，并设置接触面的刚度和强度。
2. 固定左右两侧及底部的法向速度。
3. 动态求解。
4. 解除模型左右两侧及底部法向速度约束。
5. 设定模型的左右两侧及底部为无反射边界（粘性边界）。
6. 应用剪切波-面力，施加地震应力。
7. 动态求解22s。

该案例主要用于研究二维边坡与杆件爆源模型的动力学行为。
```

## Ground Truth
```javascript
//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置不平衡率为1e-5
dyna.Set("UnBalance_Ratio 1e-5");

//设置三个方向的重力加速度值
dyna.Set("Gravity 0.0 -9.8 0.0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//设置云图输出间隔为5000
dyna.Set("Output_Interval 5000");

//设置监测信息提取间隔为10时步
dyna.Set("Moniter_Iter 10");

//打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

//设置虚质量计算时步
dyna.Set("Virtural_Step 0.6");

//设置单元体积膨胀断裂应变及等效剪切断裂应变
dyna.Set("Block_Soften_Value 0.01 0.03");

//导入ansys格式的网格
blkdyn.ImportGrid("ansys", "ansys.dat");

//设置单元模型为线弹性模型
blkdyn.SetModel("linear");

//设置组号为1的单元材料，基岩
blkdyn.SetMat(2550, 1e10, 0.22, 1e7, 1e7, 55, 10, 1);

//设置组号为2的单元材料，覆盖层
blkdyn.SetMat(2000, 6e7, 0.25, 6e4, 3e4, 30, 10, 2);

//设置所有节点的局部阻尼0.8
blkdyn.SetLocalDamp(0.8);

//对模型左右两侧及底部进行法向约束
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 74.5, 74.7);

//施加重力
blkdyn.ApplyGravity();

//监测典型位置的水平及竖直方向位移
dyna.Monitor("block", "xdis", 6, 40, 0);
dyna.Monitor("block", "ydis", 6, 40, 0);
dyna.Monitor("block", "xdis", 20, 10, 0);
dyna.Monitor("block", "ydis", 20, 10, 0);

//监测基岩中水平及竖直方向的速度
dyna.Monitor("block", "xvel", 30, 2, 0);
dyna.Monitor("block", "yvel", 30, 2, 0);

//求解至稳定
dyna.Solve();

//设置模型为Mohr-Coulomb应变软化模型
blkdyn.SetModel("SoftenMC");

//求解至稳定
dyna.Solve();

//保持save文件
dyna.Save("Plastic.sav");

//**************************************************初始化位移
//定义三个方向基础值
var values = new Array(0.0,0.0, 0);

//定义变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);

//将控制范围内的位移清零
blkdyn.InitConditionByCoord("displace", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
//**************************************************初始化位移


///////////////////////////////////以下为动力计算

//设置所有节点的局部阻尼0.0
blkdyn.SetLocalDamp(0.0);

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

//设置当前时间为0
dyna.Set("Time_Now 0");

//设置动力计算时步
dyna.Set("Time_Step 1e-4");

//计算时步自动修正
//blkdyn.TimeStepCorrect();

//对模型左右两侧及底部的约束进行解除
blkdyn.FreeV("y", "y", -0.001, 0.001);
blkdyn.FreeV("x", "x", -0.001, 0.001);
blkdyn.FreeV("x", "x", 74.5, 74.7);

//模型左右两侧施加自由场边界
blkdyn.SetFreeFieldBound("x", -0.01, 0.01);
blkdyn.SetFreeFieldBound("x", 74.5,  74.7);

//模型底部施加无反射边界条件
blkdyn.SetQuietBoundByCoord(-2000,2000,-0.001,0.001,-2000,2000);




//**************************************************施加地震应力
//指定三个方向的载荷系数
var coeff1= new Array(6.4e6, 0, 0);

//指定三个方向的载荷系数
var coeff2= new Array(0, 10.8e6, 0);

//x方向下限及上限
var x= new Array(-1000,1000);

//y方向下限及上限
var y= new Array(-0.001, 0.001);

//z方向下限及上限
var z= new Array(-1000,1000);

//水平方向地震应力-从文件中读入振动速度时程曲线
blkdyn.ApplyDynaVarFromFileByCoord ("face_force", false,coeff1,"nor-7-lef-hori.txt", x, y, z);

//竖直方向地震应力-从文件中读入-从文件中读入振动速度时程曲线
blkdyn.ApplyDynaVarFromFileByCoord ("face_force", false,coeff2,"nor-7-lef-ver.txt", x, y, z);
//**************************************************施加地震应力


//动态求解22s
dyna.DynaCycle(22.0);

//打印提示信息
print("Solution Finished");

```
