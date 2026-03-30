setCurDir(getSrcDir());

// 系统参数设置
scdem.set("ubr", 1e-4);
scdem.outputInterval = 100;
scdem.monitorIter = 10;
scdem.isLargeDisplace = 0;
scdem.isVirtualMass = 1;
scdem.virtualStep = 0.8;

// 设置重力加速度
scdem.gravity = [0, 0, -9.8];

// 导入网格数据
var msh = imesh.importAnsys("gravity_model.dat");
scdem.getMesh(msh);

// 设置单元模型为线弹性
scdem.setModel("linear");

// 设置材料参数：[密度, 弹性模量, 泊松比, 屈服强度, 断裂能, 失效应变, 失效应力]
oSel = new SelElems(scdem);
oSel.box(-0.1, -0.1, -0.1, 10.1, 10.1, 10.1);
scdem.setMat(oSel, [2500, 1e9, 0.25, 1.35e4, 0.68e4, 47, 10]);

// 设置界面模型为线弹性
scdem.setIModel("linear");
scdem.setIMatByElem(50);

// 施加边界条件：固定底部和四周
oSel = new SelNodes(scdem);
oSel.box(-0.1, -0.1, -0.1, 0.1, 10.1, 10.1);
scdem.setVel(oSel, "x", 0);

oSel = new SelNodes(scdem);
oSel.box(9.9, -0.1, -0.1, 10.1, 10.1, 10.1);
scdem.setVel(oSel, "x", 0);

oSel = new SelNodes(scdem);
oSel.box(-0.1, -0.1, -0.1, 10.1, 0.1, 10.1);
scdem.setVel(oSel, "y", 0);

oSel = new SelNodes(scdem);
oSel.box(-0.1, 9.9, -0.1, 10.1, 10.1, 10.1);
scdem.setVel(oSel, "y", 0);

oSel = new SelNodes(scdem);
oSel.box(-0.1, -0.1, -0.1, 10.1, 10.1, 0.1);
scdem.setVel(oSel, "z", 0);

// 设置监测点：加速度和位移
scdem.monitor("node", "xAcc", 5, 5, 5);
scdem.monitor("node", "yAcc", 5, 5, 5);
scdem.monitor("node", "zAcc", 5, 5, 5);

scdem.monitor("node", "xVel", 5, 5, 5);
scdem.monitor("node", "yVel", 5, 5, 5);
scdem.monitor("node", "zVel", 5, 5, 5);

scdem.monitor("node", "xDis", 5, 5, 5);
scdem.monitor("node", "yDis", 5, 5, 5);
scdem.monitor("node", "zDis", 5, 5, 5);

// 设置阻尼
scdem.set("RayleighDamp", 5e-7, 0);

// 求解计算
scdem.solveGpu(100000);

// 释放GPU内存
scdem.releaseGpuMem();

// 打印完成信息
print("Solution Finished");
