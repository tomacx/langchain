# Failure Analysis: 案例库-CDyna案例-粒子模块案例-基本案例-BrazilianTest-BrazilianTest.js

## Query
请生成一个CDyna案例的脚本，功能是粒子模块案例-基本案例-BrazilianTest-BrazilianTest

## Generated Code
```javascript
//创建第三组颗粒
pdyna.SingleCreate(1,2,0.5,4,0.0,0);
pdyna.SingleCreate(2,2,0.5,4,1.0,0);

//创建第四组颗粒
pdyna.SingleCreate(1,2,0.5,6,0.0,0);
pdyna.SingleCreate(2,2,0.5,6,1.0,0);

//创建第五组颗粒
pdyna.SingleCreate(1,2,0.5,8,0.0,0);
pdyna.SingleCreate(2,2,0.5,8,1.0,0);

//创建第六组颗粒
pdyna.SingleCreate(1,2,0.5,10,0.0,0);
pdyna.SingleCreate(2,2,0.5,10,1.0,0);

//指定颗粒与颗粒之间的接触模型
pdyna.SetModelByCoord("linear"    ,-0.01,  0.01, -100, 100, -100, 100);
pdyna.SetModelByCoord("brittleMC" , 1.99,  2.01, -100, 100, -100, 100);
pdyna.SetModelByCoord("idealMC"   , 3.99,  4.01, -100, 100, -100, 100);
pdyna.SetModelByCoord("SSMC"      , 5.99,  6.01, -100, 100, -100, 100);
pdyna.SetModelByCoord("Damage"    , 7.99,  8.01, -100, 100, -100, 100);
pdyna.SetModelByCoord("Hertz"     , 9.99, 10.01, -100, 100, -100, 100);

//求解至稳定
dyna.Solve();

//设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

//独立设置局部阻尼及粘性阻尼系数
pdyna.SetSingleMat("LocalDamp", 0.0);
pdyna.SetSingleMat("ViscDamp", 0.2);

//设置颗粒的接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

//求解30000步
dyna.Solve(30000);
```

## Ground Truth
```javascript
//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

//清除GDEM-Env中的结果数据
doc.clearResult();

//设置输出的间隔为500步
dyna.Set("Output_Interval 500");

//打开虚拟质量开关
dyna.Set("If_Virtural_Mass 1");

//设置全局的重力加速度为0
dyna.Set("Gravity 0.0 0.0 0.0");

//设置颗粒间的接触容差为0.2mm
dyna.Set("Contact_Detect_Tol 2e-4");

//设置全局的刚性面模型及参数
dyna.Set("If_Contact_Use_GlobMat 1 2 1e9 1e9 0 0 0.0");

//设置颗粒与刚性面接触时，接触刚度是否采用设置值，0-不是（采用颗粒的刚度）
dyna.Set("If_Stiff_Use_Set_Value 0")

//创建上部刚性面
var fCoord = new Array();
fCoord[0]=new Array(-0.1,0.05,0.0);
fCoord[1]=new Array(0.1,0.05,0.0);
rdface.Create (1, 1, 2, fCoord);

//创建下部刚性面
fCoord[0]=new Array(-0.1,-0.05,0.0);
fCoord[1]=new Array(0.1,-0.05,0.0);
rdface.Create (1, 2, 2, fCoord);

//设置上部刚性面的加载速度
var FixV=[0.0, -2e-9, 0.0];
rdface.ApplyVelocityByGroup (FixV, 1,1);

//导入gid格式的颗粒
pdyna.Import("gid","Brazi.msh");

//设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 3e10, 0.25, 1e6, 5e6, 30, 0.0, 0.2);

//监测刚性面上的竖向位移
dyna.Monitor("rdface","rg_yDis",2,2,0);

//监测刚性面上的竖向力
dyna.Monitor("rdface","rg_pyForce",2,2,0);
dyna.Monitor("rdface","rg_pyForce",1,1,0);

//计算3万步
dyna.Solve(30000);
```
