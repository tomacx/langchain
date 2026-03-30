//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 设置系统不平衡率为1e-4
scdem.set("ubr", 1e-4);

// 设置不平衡率计算模式
scdem.set("ubrMode", 2);

//设置云图更新间隔
scdem.set("outputInterval", 1000);

//设置重力
scdem.gravity = [0,0,-10.0];

//关闭大变形开关
scdem.set("isLargeDisplace", 0);

//打开虚质量开关
scdem.set("isVirtualMass", 1);

//设置虚时步
scdem.set("virtualStep", 0.6);

//设置局部阻尼
scdem.set("localDamp", 0.8);

var msh = imesh.importGmsh("tunnel.msh");//可更换文件中不同网格数量的网格文件
scdem.getMesh(msh);

scdem.setModel("linear");

oSel = new SelElems(scdem);
oSel.box(-1e4, -1e4, -50, 1e4, 1e4, 25);
oMat = [2200,  3.0e9,  0.25,  50e3, 5e3, 20, 3];
scdem.setMat(oSel, oMat);

oSel = new SelElems(scdem);
oSel.box(-1e4, -1e4, 25, 1e4, 1e4, 35);
oMat = [2200, 3.0e8, 0.3, 25e3, 0, 20, 0];
scdem.setMat(oSel, oMat);

scdem.setIModel("linear");
scdem.setIMatByElem(20);

//对模型四周及底部进行法向约束
oSel = new SelNodes(scdem);
oSel.box(-0.01, -1e4, -1e4, 0.01, 1e4, 1e4);
scdem.setVel(oSel, "x", 0);

oSel = new SelNodes(scdem);
oSel.box(43.99, -1e4, -1e4, 44.01, 1e4, 1e4);
scdem.setVel(oSel, "x", 0);

oSel = new SelNodes(scdem);
oSel.box(-1e4, -0.01, -1e4, 1e4, 0.01, 1e4);
scdem.setVel(oSel, "y", 0);

oSel = new SelNodes(scdem);
oSel.box(-1e4, 50.9, -1e4, 1e4, 51.1, 1e4);
scdem.setVel(oSel, "y", 0);

oSel = new SelNodes(scdem);
oSel.box(-1e4, -1e4, -40.1, 1e4, 1e4, -39.9);
scdem.setVel(oSel, "z", 0);

//初始化应力状态
oSel = new SelElems(scdem);
oSel.box(-1e10,-1e10,-1e10, 1e10,1e10,1e10);
scdem.initConditionBySel(oSel,"stress",[-770e3, -385e3, -770e3]);

//计算弹性场
scdem.solveGpu();

//计算塑性场
scdem.setModel("DP");
scdem.solveGpu();

//分段开挖
scdem.setModel(4,"none");
scdem.solveGpu();

scdem.setModel(5,"none");
scdem.solveGpu();

scdem.setModel(7,"none");
scdem.solveGpu();

//释放GPU端内存
scdem.releaseGpuMem();

//打印信息
print("Solution Finished");
