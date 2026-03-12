# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-GDEM-Env相关-ModelMove.js

## Query
我想做一个CDyna案例的数值模拟，功能是CDyna案例，功能是块体模块案例-扩展案例-GDEM-Env相关-ModelMove。请根据 CDEM 技术手册，合理选择blkdyn等模块，帮我写一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、边界条件与载荷、求解参数和结果监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// 初始化几何
igeo.GeneratePoint([0,0,0]);

// 导入网格
blkdyn.ImportGrid("gid","element.msh");

// 设置单元模型
blkdyn.SetModel("SoftenMC");

// 设置单元材料
blkdyn.SetMat(2500, 1e8,0.25, 3e5, 3e5, 25, 15);

// 设置单元的局部阻尼
blkdyn.SetLocalDamp(0.8);

// 固定边界条件
blkdyn.FixV("xyz",0,"y", -0.05, 0.05);
blkdyn.FixV("xyz",0,"x", 1.95, 2.05);

// 设置求解参数
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 0.0");
dyna.Set("Virtural_Step 0.3");

// 开始求解
dyna.Solve(10000);
```

## Ground Truth
```javascript
setCurDir(getSrcDir());

blkdyn.GenBrick3D(10,10,10,10,10,10,1);

for(var i = 0; i < 1000; i++)
{

//var x = 0.1 * Math.round( Math.sin(i * 0.01));
//var y = 0.1 * Math.round( Math.cos(i * 0.01));
//view.Pan(x, y);

view.rotate(0.5, 0.3,0.3,0.3);

sleep(50);
}
```
