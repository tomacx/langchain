# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-块体与Link单元耦合-TwoElemLink.js

## Query
请生成一个CDyna案例的脚本，功能是块体模块案例-扩展案例-块体与Link单元耦合-TwoElemLink

## Generated Code
```javascript
//设置第100号Link单元的模型
link.SetElemValue(100, "Model", 1);
//设置第100号Link单元Z方向的力
link.SetElemValue(100, "LinkForce", 1e6, 3);

//获取刚性面单元的信息
rdface.GetElemValue();

//刚性面核心求解器
rdface.Solver();

//耦合面核心求解器
trff.Solver();

//获取耦合面单元的参数
trff.GetValue();

//设置耦合面单元的参数
trff.SetValue();
```

## Ground Truth
```javascript
setCurDir(getSrcDir());

dyna.Set("Mechanic_Cal 1");
dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0 -9.8 0");

dyna.Set("Large_Displace 1");

dyna.Set("Output_Interval 1000");


dyna.Set("Moniter_Iter 100");

dyna.Set("If_Virtural_Mass 1");

dyna.Set("Virtural_Step 0.4");




blkdyn.ImportGrid("ansys", "TwoElemLink.dat");

blkdyn.SetModel("linear");

blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e1, 1e1, 25.0, 10.0, 1);
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e1, 1e1, 25.0, 10.0, 2);

blkdyn.FixVByCoord("xyz", 0.0, -1e10, 1e10, -1e10, 0.001, -1e10, 1e10);


var fArrayCoord1 = [0,1,0]
var fArrayCoord2 = [0,2,0]
link.CreateByCoord(fArrayCoord1, fArrayCoord2, 1);

var fArrayCoord1 = [1, 1, 0]
var fArrayCoord2 = [1, 2, 0]
link.CreateByCoord(fArrayCoord1, fArrayCoord2, 2);

var fArrayCoord1 = [1, 1, 1]
var fArrayCoord2 = [1, 2, 1]
link.CreateByCoord(fArrayCoord1, fArrayCoord2, 3);

var fArrayCoord1 = [0, 1, 1]
var fArrayCoord2 = [0, 2, 1]
link.CreateByCoord(fArrayCoord1, fArrayCoord2, 4);

link.SetPropByGroup(1e-2, 1e9, 1e8, 1e6, 1, 4);

link.SetModelByGroup(1, 1, 100)

blkdyn.SetLocalDamp(0.8);

dyna.Monitor("block", "ydis", 0, 2, 0); 
dyna.Monitor("block", "ydis", 1, 2, 0);
dyna.Monitor("block", "ydis", 1, 2, 1);
dyna.Monitor("block", "ydis", 0, 2, 1);


dyna.Solve();


link.SetModelByGroup(0, 2, 3)

dyna.Solve(10000);




```
