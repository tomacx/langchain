# Failure Analysis: 案例库-SuperCDEM案例-裂隙流案例-交叉裂隙面气体流动-FracS-Gas.js

## Query
我想做一个SuperCDEM案例的数值模拟，功能是SuperCDEM案例，功能是裂隙流案例-交叉裂隙面气体流动-FracS-Gas。请根据 CDEM 技术手册，合理选择scdem等模块，帮我写一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、边界条件与载荷、求解参数和结果监测。

## Generated Code
```javascript

```

## Ground Truth
```javascript
setCurDir(getSrcDir());

//包含裂隙计算模块，开辟相应内存
scdem.set("Config_FracSeepage", 1);

scdem.set("FracSeepage_Cal", 1);

scdem.set("Mechanic_Cal", 0);

SFracsp.importGrid("gid", "fracurenet.msh");

scdem.set("gravity",[0.0,-10.0,0.0]);

scdem.outputInterval = 100;

scdem.set("Seepage_Mode", 2);

SFracsp.setPropByCoord([1.00,1e7,12e-13,12e-9], -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

SFracsp.initConditionByCoord("pp",1e5, 0,0,0, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

SFracsp.applyConditionByCoord("pp", 30e6, 0,0,0, -1e5, 1e5, -0.001, 0.001, -1e5, 1e5)

scdem.timeStep = 100;
scdem.solveGpu(10000);

print("finish");


```
