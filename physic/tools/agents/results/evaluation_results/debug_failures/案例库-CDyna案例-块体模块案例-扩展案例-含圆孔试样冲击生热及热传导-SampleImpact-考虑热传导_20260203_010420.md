# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-含圆孔试样冲击生热及热传导-SampleImpact-考虑热传导.js

## Query
请生成一个CDyna案例的脚本，功能是块体模块案例-扩展案例-含圆孔试样冲击生热及热传导-SampleImpact-考虑热传导

## Generated Code
```javascript
// 块体模块案例-扩展案例-含圆孔试样冲击生热及热传导-SampleImpact-考虑热传导.js
blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(1e9, 1e9, 20.0, 0 ,0);

blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);

// 设置热传导材料参数，依次为固体密度、初始温度、热传导系数、比热容、体膨胀系数
heatcd.SetPropByGroup (2500.0, 25.0, 3.125, 1000, 3e-5, 1);
heatcd.SetPropByGroup (2500.0, 25.0, 3.125, 1000, 3e-5, 2);

dyna.TimeStepCorrect(0.5);

// 监控器
dyna.Monitor("block", "xdis", 0.15, 0.15, 0);
dyna.Monitor("block", "sxx",  0.15, 0.15, 0);

// 动力学计算
dyna.DynaCycle(10);

print("**********************求解完毕**********************");
```

## Ground Truth
```javascript
setCurDir(getSrcDir());

imeshing.clear();
igeo.clear();
dyna.Clear();

var Width = 0.1;
var Height = 0.2;
var fSize = 0.0025;
var fRad = 0.01;
var CircleSum = 2;
var Dist = Height / (CircleSum + 1);

//冲击速度 m/s
var ImpactVel = 2.0; 

var ComputeTime = Height / ImpactVel * 0.1;

var id1 = igeo.genRect(0,0,0,Width, Height, 0, fSize);
var aLineLoop = new Array();
aLineLoop.push(id1);

for(var i = 0; i < CircleSum; i++)
{
var id2 = igeo.genCircle(0.5 * Width , Dist * (i + 1),  0.0 , fRad ,fSize);
aLineLoop.push(id2);
}

igeo. genSurface ( aLineLoop, 1 );

imeshing.genMeshByGmsh(2);


/////////核心计算


//设置三个方向的重力加速度值
dyna.Set("Gravity 0.0 0.0 0.0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//设置云图输出间隔为500
dyna.Set("Output_Interval 500");

//设置监测信息提取间隔为10时步
dyna.Set("Moniter_Iter 10");

//打开虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

//包含热传导计算模块，开辟相应内存
dyna.Set("Config_Heat 1");

//打开热传导计算开关
dyna.Set("Heat_Cal 1");

dyna.Set("PlaSlipHeat_TransCal_Option 1 0.6");


//设置单元体积膨胀断裂应变及等效剪切断裂应变
dyna.Set("Block_Soften_Value 0.01 0.03");

blkdyn.GetMesh(imeshing);

blkdyn.SetModel("SoftenMC");

//设置组号为1的单元材料，基岩
blkdyn.SetMat(2500, 3e10, 0.22, 8e6, 5e6, 35, 10);

blkdyn.SetLocalDamp(0.01);

blkdyn.FixV("y", -ImpactVel, "y", Height-0.001, Height+0.001);

blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

//设置热传导材料参数，依次为固体密度、初始温度、热传导系数、比热容、体膨胀系数
heatcd.SetPropByGroup (2500.0, 25.0, 3.125, 1000, 3e-5, 1);

dyna.TimeStepCorrect(0.5);


dyna.Monitor("block", "ydis", 0.5 * Width, Height, 0);
dyna.Monitor("block", "syy", 0.5 * Width, Height, 0);

dyna.DynaCycle(ComputeTime);


print("**********************求解完毕**********************");





```
