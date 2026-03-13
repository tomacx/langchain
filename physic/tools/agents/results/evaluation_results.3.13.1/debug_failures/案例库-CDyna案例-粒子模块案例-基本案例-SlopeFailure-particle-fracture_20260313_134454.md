# Failure Analysis: 案例库-CDyna案例-粒子模块案例-基本案例-SlopeFailure-particle-fracture.js

## Query
请复现一个CDyna案例的 JavaScript 案例脚本，案例文件名为「案例库-CDyna案例-粒子模块案例-基本案例-SlopeFailure-particle-fracture.js」，场景/主题为：粒子模块案例 - 基本案例 - SlopeFailure - particle - fracture。请严格依据 CDEM 技术手册/API（优先）来选择与确认接口与参数含义。必须使用到这些模块：dyna、pdyna。请按“几何建模→网格划分→材料/模型→边界/载荷→求解参数→结果输出/监测”的顺序组织脚本，并确保脚本以 setCurDir(getSrcDir()); 开头。脚本注释/意图线索：设置当前路径为JavaScript脚本所在的路径；清除GDEM-Pdyna计算核心中的内存数据；dyna.Clear();；清除GDEM-Env中的结果数据；doc.ClearResult();；设置结果的输出间隔为500步；打开虚拟质量开关；设置重力加速度；设置接触容差（该容差较大，便于找到紧密接触，形成致密连续介质颗粒体系）；设置求解不平衡率；导入gid格式的颗粒；pdyna.Import("gid","slope.msh");；创建全局的Table；var coord = new Array( [20.2073,72.7751,0],  [22.3。API 调用关键词（用于检索技术手册）：dyna.Monitor，dyna.Set，pdyna.FixV，dyna.Solve，pdyna.Import，pdyna.SetMat，pdyna.SetModel，pdyna.SetSingleMat。

## Generated Code
```javascript
setCurDir(getSrcDir());
dyna.Clear();
doc.ClearResult();
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Contact_Detect_Tol 1e-1");
dyna.Set("UnBalance_Ratio 5e-4");
pdyna.Import("gid","slope.msh");
var coord = new Array( [20.2073,72.7751,0],  [22.3172,54.7233,0],  [27.006,38.5469,0],  [38.9624,25.4183,0],  [60.3594,12.3325,0], [57.4832,77.4639,0] );
dyna.CreateTable (1, "table1",6, coord);
pdyna.SetGroupByTable (2, "table1");
dyna.Monitor("rdface", "x", 1, 2, 0);
dyna.Monitor("rdface", "y", 1, 2, 0);
dyna.Monitor("rdface", "z", 1, 2, 0);
dyna.Monitor("rdface", "rg_bxForce", 1, 2, 0);
dyna.Monitor("rdface", "rg_byForce", 1, 2, 0);
dyna.Monitor("rdface", "rg_bzForce", 1, 2, 0);
dyna.Monitor("rdface", "rg_bmagForce", 1, 2, 0);
dyna.Monitor("rdface", "rg_bxMoment", 1, 2, 0);
dyna.Monitor("rdface", "rg_byMoment", 1, 2, 0);
dyna.Monitor("rdface", "rg_bzMoment", 1, 2, 0);
dyna.Solve(20000);
```

## Ground Truth
```javascript
//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//清除GDEM-Pdyna计算核心中的内存数据
//dyna.Clear();
//清除GDEM-Env中的结果数据
//doc.ClearResult();

//设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//打开虚拟质量开关
dyna.Set("If_Virtural_Mass 1");

//设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

//设置接触容差（该容差较大，便于找到紧密接触，形成致密连续介质颗粒体系）
dyna.Set("Contact_Detect_Tol 1e-1");


//设置求解不平衡率
dyna.Set("UnBalance_Ratio 5e-4");

//导入gid格式的颗粒
//pdyna.Import("gid","slope.msh");

//创建全局的Table
//var coord = new Array( [20.2073,72.7751,0],  [22.3172,54.7233,0],  [27.006,38.5469,0],  [38.9624,25.4183,0],  [60.3594,12.3325,0], [57.4832,77.4639,0] );
//dyna.CreateTable (1, "table1",6, coord);

//重新分组，将table1指定的范围设定的组2
//pdyna.SetGroupByTable (2, "table1");

pdyna.Import("pdyna", "par.dat");

//设置颗粒接触模型为线弹性模量
pdyna.SetModel("linear");

//设置组1及组2的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e10, 0.25, 1e6,1e6, 35, 0.8, 0.0, 1);
pdyna.SetMat(2500, 1e9, 0.25, 1e4, 1e4, 10, 0.8, 0.0, 2);

//模型左右两侧及底部法向约束
pdyna.FixV("xyz",0.0,"x", -2,3.0);
pdyna.FixV("xyz",0.0,"x", 117,121);
pdyna.FixV("xyz",0.0,"y", -3,3);


//监测典型颗粒的水平位移
dyna.Monitor("particle","pa_xdis",32.3547,65.9723,0);
dyna.Monitor("particle","pa_xdis",39.0829,52.8447,0);
dyna.Monitor("particle","pa_xdis",42.4554,44.3844,0);
dyna.Monitor("particle","pa_xdis",52.9724, 23.6007, 0);
dyna.Monitor("particle","pa_xdis",60.3594,12.3325,0);
dyna.Monitor("particle","pa_xdis",76.3853,8.8268,0);

//求解至稳定
//dyna.Solve();

//设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

//独立设置局部阻尼及粘性阻尼系数
pdyna.SetSingleMat("LocalDamp", 0.0);
pdyna.SetSingleMat("ViscDamp", 0.2);

//设置颗粒的接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

//求解30000步
//dyna.Solve(30000);

```
