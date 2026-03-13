# Failure Analysis: 案例库-SuperCDEM案例-LargeDis-LargeDisTet.js

## Query
请复现一个SuperCDEM案例的 JavaScript 案例脚本，案例文件名为「案例库-SuperCDEM案例-LargeDis-LargeDisTet.js」，场景/主题为：LargeDis - LargeDisTet。请严格依据 CDEM 技术手册/API（优先）来选择与确认接口与参数含义。必须使用到这些模块：imesh、scdem。请按“几何建模→网格划分→材料/模型→边界/载荷→求解参数→结果输出/监测”的顺序组织脚本，并确保脚本以 setCurDir(getSrcDir()); 开头。脚本注释/意图线索：设置文件路径；cdem.set("dpMode",1);；设置系统不平衡率为1e-4；设置云图更新间隔；打开虚质量开关；设置虚时步；打开大变形开关；导入计算网格；施加单元材料参数(含单元模型设置)；施加界面材料参数(含接触面模型设置)；施加位移边界条件；设置局部阻尼；求解至稳定；释放GPU端内存；打印提示信息。API 调用关键词（用于检索技术手册）：scdem.monitor，oSel.box，scdem.setVel，cdem.set，imesh.importGmsh，scdem.getMesh，scdem.releaseGpuMem，scdem.set。

## Generated Code
```javascript

```

## Ground Truth
```javascript
//设置文件路径
setCurDir(getSrcDir());

//cdem.set("dpMode",1);

// 设置系统不平衡率为1e-4
scdem.ubr = 1e-4;

//设置云图更新间隔
scdem.outputInterval = 100;

//打开虚质量开关
scdem.isVirtualMass = 1;

//设置虚时步
scdem.virtualStep = 0.6;

//打开大变形开关
scdem.isLargeDisplace = 1;

//导入计算网格
var msh1 = imesh.importGmsh("LargeDis_Tet.msh");
scdem.getMesh(msh1);

//施加单元材料参数(含单元模型设置)
scdem.setModel("linear");
oMat = {"density":2500, "young":1e6, "poission":0.35, "cohesive":1.35e9,
 "tension":0.68e9, "friction":30, "dilatation":10};
scdem.setMat(oMat);

//施加界面材料参数(含接触面模型设置)
scdem.setIModel("linear");
scdem.setIMatByElem(10);

//施加位移边界条件
oSel = new SelNodes(scdem);
oSel.box(0.05,0.05,0.00499,0.052,0.052,0.00501);
scdem.setVel(oSel, "z", -2e-6);

oSel = new SelNodes(scdem);
oSel.box(-0.0001,-1e5,-1e5,0.0001,1e5,1e5);
scdem.setVel(oSel, "z", 0.0);
oSel = new SelNodes(scdem);
oSel.box(0.099,-1e5,-1e5,0.101,1e5,1e5);
scdem.setVel(oSel, "z", 0.0);

scdem.monitor("node", "xAcc", 0.05,0.05,0.025);
scdem.monitor("node", "yAcc", 0.05,0.05,0.025);
scdem.monitor("node", "zAcc", 0.05,0.05,0.025);

scdem.monitor("node", "xVel", 0.05,0.05,0.025);
scdem.monitor("node", "yVel", 0.05,0.05,0.025);
scdem.monitor("node", "zVel", 0.05,0.05,0.025);

scdem.monitor("node", "xDis", 0.05,0.05,0.025);
scdem.monitor("node", "yDis", 0.05,0.05,0.025);
scdem.monitor("node", "zDis", 0.05,0.05,0.025);

scdem.monitor("node", "sxx", 0.05,0.05,0.025);
scdem.monitor("node", "syy", 0.05,0.05,0.025);
scdem.monitor("node", "szz", 0.05,0.05,0.025);

scdem.monitor("node", "exx", 0.05,0.05,0.025);
scdem.monitor("node", "eyy", 0.05,0.05,0.025);
scdem.monitor("node", "ezz", 0.05,0.05,0.025);

//设置局部阻尼
scdem.set("localDamp", 0.2);

//求解至稳定
scdem.solveGpu();

//释放GPU端内存
scdem.releaseGpuMem();

//打印提示信息
print("Solution Finished");
```
