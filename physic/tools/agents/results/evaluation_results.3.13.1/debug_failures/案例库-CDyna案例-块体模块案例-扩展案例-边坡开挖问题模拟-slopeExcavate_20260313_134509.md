# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-边坡开挖问题模拟-slopeExcavate.js

## Query
请复现一个CDyna案例的 JavaScript 案例脚本，案例文件名为「案例库-CDyna案例-块体模块案例-扩展案例-边坡开挖问题模拟-slopeExcavate.js」，场景/主题为：块体模块案例 - 扩展案例 - 边坡开挖问题模拟 - slopeExcavate。请严格依据 CDEM 技术手册/API（优先）来选择与确认接口与参数含义。必须使用到这些模块：blkdyn、dyna、imesh。请按“几何建模→网格划分→材料/模型→边界/载荷→求解参数→结果输出/监测”的顺序组织脚本，并确保脚本以 setCurDir(getSrcDir()); 开头。脚本注释/意图线索：定义三个方向基础值；定义变化梯度；将控制范围内的位移清零。API 调用关键词（用于检索技术手册）：blkdyn.FixV，blkdyn.SetModel，dyna.Monitor，dyna.Solve，dyna.Set，blkdyn.GetMesh，blkdyn.InitConditionByCoord，blkdyn.SetMat。

## Generated Code
```javascript
setCurDir(getSrcDir());

// 初始化
igeo.GeneratePoint([0,0,0]);

// 定义三个方向基础值
var values = new Array(0.0,0.0, 0);

// 定义变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);

// 将控制范围内的位移清零
blkdyn.InitConditionByCoord("displace", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 设置模型
blkdyn.SetModel("SoftenMC");

// 求解
dyna.Solve();

// 设置模型
blkdyn.SetModel("none", 2);

// 求解
dyna.Solve();

// 设置模型
blkdyn.SetModel("none", 3);

// 求解
dyna.Solve();

// 设置模型
blkdyn.SetModel("none", 4);

// 求解
dyna.Solve();

// 设置模型
blkdyn.SetModel("none", 5);

// 求解
dyna.Solve();
```

## Ground Truth
```javascript
setCurDir(getSrcDir());

dyna.Clear();

doc.clearResult();

dyna.Set("Gravity 0 -9.8 0");

dyna.Set("Output_Interval 100000");

var msh1=imesh.importGid("SlopeExcavate.msh");
blkdyn.GetMesh(msh1);

blkdyn.SetModel("linear");

blkdyn.SetMat(2000, 3e8, 0.3, 5e3, 3e3, 15, 10);

blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);

blkdyn.FixV("x", 0.0, "x", 9.999, 10.01);

blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

dyna.Monitor("block","xdis", 8, 5, 0);

dyna.Monitor("block","xdis", 6.7683, 3.6442, 0);

dyna.Monitor("block","xdis", 6.2744, 2.4918, 0);

dyna.Solve();

blkdyn.SetModel("SoftenMC");

dyna.Solve();


//定义三个方向基础值
var values = new Array(0.0,0.0, 0);
//定义变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
//将控制范围内的位移清零
blkdyn.InitConditionByCoord("displace", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);


for(var i = 2; i <= 5; i++)
{
blkdyn.SetModel("none", i);

dyna.Solve();
}
```
