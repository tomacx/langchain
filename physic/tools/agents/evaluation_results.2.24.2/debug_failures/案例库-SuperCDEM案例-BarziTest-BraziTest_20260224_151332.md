# Failure Analysis: 案例库-SuperCDEM案例-BarziTest-BraziTest.js

## Query
我现在要做一个SuperCDEM案例的数值模拟，场景大致是：设置当前工作路径为JavaScript脚本文件所在路径。请根据 CDEM 技术手册，合理选择scdem等模块，帮我写一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、边界条件与载荷、求解参数和结果监测。

## Generated Code
```javascript
var searchResult = search_physics_knowledge({"query": "SuperCDEM案例"});
```

## Ground Truth
```javascript
//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//计算结果输出间隔为1000步
scdem.outputInterval = 1000;

//打开虚质量计算开关
scdem.isVirtualMass = 1;

//虚时步
scdem.virtualStep = 0.5;

scdem.set("isVtk", 1);

//创建半径为2cm的圆盘
var msh = imesh.importGmsh("pan.msh");
scdem.getMesh(msh);

//设置单元模型为线弹性模量
scdem.setModel("linear");

//设置单元的材料参数
scdem.setMat([2500, 1e10, 0.25, 10e6, 4e6, 40.0, 10.0]);

//设置交界面的模型为断裂模型
scdem.setIModel("FracE");
scdem.setIMatByElem(50);
scdem.setContactFractureEnergy(50,100,1,1);

//最底侧节点法向约束
oSel = new SelNodes(scdem);
oSel.box(-1e10,-0.0201,-1e10, 1e10,-0.0199,1e10);
scdem.setVel(oSel, "y", 0);

//最顶侧节点施加2e-9的准静态速度载荷
oSel = new SelNodes(scdem);
oSel.box(-1e10,0.0199,-1e10, 1e10,0.0201,1e10);
scdem.setVel(oSel, "y", -1e-8);

//z方向左右两侧固定
oSel = new SelNodes(scdem);
oSel.box(-1e10,-1e10,-1e10, 1e10,1e10,1e10);
scdem.setVel(oSel, "z", 0);

//计算10万步
scdem.solveGpu(100000);

//释放GPU端内存
scdem.releaseGpuMem();

//打印提示信息
print("Solution Finished");

```
