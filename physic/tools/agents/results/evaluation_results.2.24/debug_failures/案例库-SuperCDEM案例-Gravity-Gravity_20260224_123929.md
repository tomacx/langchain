# Failure Analysis: 案例库-SuperCDEM案例-Gravity-Gravity.js

## Query
我现在要做一个SuperCDEM案例的数值模拟，场景大致是：设置文件路径。请根据 CDEM 技术手册，合理选择scdem等模块，帮我写一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、边界条件与载荷、求解参数和结果监测。

## Generated Code
```javascript
{"name": "setCurDir", "parameters": {"dir": "/path/to/script/directory"}} 

{"name": "scdem", "parameters": {"outputInterval": 2000, "monitorIter": 100, "isVirtualMass": 1, "virtualStep": 0.5, "isLargeDisplace": 0}} 

{"name": "imesh", "parameters": {"importGmsh": "pan-300000.msh"}} 

{"name": "scdem", "parameters": {"getMesh": "imesh"}} 

{"name": "scdem", "parameters": {"setModel": "linear"}} 

{"name": "scdem", "parameters": {"setMat": "[2700, 60e9, 0.2, 25e6, 15e6, 40,10]"}} 

{"name": "scdem", "parameters": {"setIModel": "FracE"}} 

{"name": "scdem", "parameters": {"setContactFractureEnergy": "[5,50]", "setIMatByElem": 10}} 

{"name": "SelNodes", "parameters": {"box": "[-1e10,-0.0301,-1e10, 1e10,-0.0299,1e10]"}} 

{"name": "scdem", "parameters": {"setVel": "[SelNodes, 'y', 0]"}} 

{"name": "SelNodes", "parameters": {"box": "[-1e10,0.0299,-1e10, 1e10,0.0301,1e10]"}} 

{"name": "scdem", "parameters": {"setVel": "[SelNodes, 'y', -5e-9]"}} 

{"name": "scdem", "parameters": {"regionMonitor": "['node', 'yForce', 1, SelNodes]"}} 

{"name": "scdem", "parameters": {"localDamp": 0.8}} 

{"name": "scdem", "parameters": {"solveGpu": 100000}} 

{"name": "scdem", "parameters": {"releaseGpuMem": ""}} 

{"name": "print", "parameters": {"Solution Finished"}}
```

## Ground Truth
```javascript
//设置文件路径
setCurDir(getSrcDir());

// 设置系统不平衡率为1e-4
scdem.set("ubr", 1e-4);

//设置云图更新间隔
scdem.set("outputInterval", 100);

//关闭大变形开关
scdem.set("isLargeDisplace", 0);

//打开虚质量开关
scdem.set("isVirtualMass", 1);

//设置虚时步
scdem.set("virtualStep", 0.8);

scdem.gravity = [0,0,-9.8];

//导入计算网格
var msh1 = imesh.importAnsys("200324tet780.dat");
scdem.getMesh(msh1);

//施加单元材料参数(含单元模型设置)
scdem.setModel("linear");
oSel = new SelElems(scdem);
oSel.box(-0.1,-0.1,-0.1,10.1,10.1,10.1);
oMat = [2500, 1e9, 0.25, 1.35e4, 0.68e4, 47, 10];
scdem.setMat(oSel, oMat);

//施加界面材料参数(含接触面模型设置)
scdem.setIModel("linear");
scdem.setIMatByElem(50);

//施加位移边界条件(固定底部即四周)
oSel = new SelNodes(scdem);
oSel.box(-0.1,-0.1,-0.1,0.1,10.1,10.1);
scdem.setVel(oSel, "x", 0);
oSel = new SelNodes(scdem);
oSel.box(9.9,-0.1,-0.1,10.1,10.1,10.1);
scdem.setVel(oSel, "x", 0);
oSel = new SelNodes(scdem);
oSel.box(-0.1,-0.1,-0.1,10.1,0.1,10.1);
scdem.setVel(oSel, "y", 0);
oSel = new SelNodes(scdem);
oSel.box(-0.1,9.9,-0.1,10.1,10.1,10.1);
scdem.setVel(oSel, "y", 0);
oSel = new SelNodes(scdem);
oSel.box(-0.1,-0.1,-0.1,10.1,10.1,0.1);
scdem.setVel(oSel, "z", 0);


//施加监测点
scdem.monitor("node", "xAcc", 5,5,5);
scdem.monitor("node", "yAcc", 5,5,5);
scdem.monitor("node", "zAcc", 5,5,5);

scdem.monitor("node", "xVel", 5,5,5);
scdem.monitor("node", "yVel", 5,5,5);
scdem.monitor("node", "zVel", 5,5,5);

scdem.monitor("node", "xDis", 5,5,5);
scdem.monitor("node", "yDis", 5,5,5);
scdem.monitor("node", "zDis", 5,5,5);

scdem.monitor("node", "sxx", 5,5,5);
scdem.monitor("node", "syy", 5,5,5);
scdem.monitor("node", "szz", 5,5,5);

scdem.monitor("node", "exx", 5,5,5);
scdem.monitor("node", "eyy", 5,5,5);
scdem.monitor("node", "ezz", 5,5,5);

//求解至稳定
scdem.solveGpu();

//释放GPU端内存
scdem.releaseGpuMem();

//打印提示信息
print("Solution Finished");
```
