setCurDir(getSrcDir());

// 设置求解器参数
scdem.set("ubr", 1e-4);
scdem.outputInterval = 100;
scdem.set("isLargeDisplace", 0);
scdem.set("isVirtualMass", 1);
scdem.set("virtualStep", 0.8);

// 设置重力矢量 (X, Y, Z)
scdem.gravity = [0, 0, -9.8];

// 导入网格 (使用示例网格文件)
var msh = imesh.importGmsh("gravity_test.msh");
scdem.getMesh(msh);

// 设置单元模型为线弹性模型
scdem.setModel("linear");

// 选择所有单元并设置材料参数 (密度, 杨氏模量, 泊松比, 屈服强度, 硬化模量, 失效指数, 失效应力)
oSel = new SelElems(scdem);
oSel.all();
oMat = [2500, 1e9, 0.25, 2e7, 1e6, 10, 0.5];
scdem.setMat(oSel, oMat);

// 设置界面模型为线性接触模型
scdem.setIModel("linear");
scdem.setIMatByElem(50);

// 施加位移边界条件 (固定底部四周)
oSel = new SelNodes(scdem);
oSel.box(-0.1, -0.1, -0.1, 0.1, 50.1, 50.1);
scdem.setVel(oSel, "x", 0);
oSel = new SelNodes(scdem);
oSel.box(-0.1, 9.9, -0.1, 0.1, 50.1, 50.1);
scdem.setVel(oSel, "y", 0);
oSel = new SelNodes(scdem);
oSel.box(-0.1, -0.1, -0.1, 50.1, 0.1, 50.1);
scdem.setVel(oSel, "y", 0);
oSel = new SelNodes(scdem);
oSel.box(-0.1, 9.9, -0.1, 50.1, 50.1, 0.1);
scdem.setVel(oSel, "z", 0);

// 施加位移边界条件 (固定底部)
oSel = new SelNodes(scdem);
oSel.box(-0.1, 9.9, -0.1, 50.1, 50.1, -0.001);
scdem.setVel(oSel, "y", 0);

// 设置监测点 (中心节点 (25, 25, 25))
scdem.monitor("node", "xDis", 25, 25, 25);
scdem.monitor("node", "yDis", 25, 25, 25);
scdem.monitor("node", "zDis", 25, 25, 25);
scdem.monitor("node", "xVel", 25, 25, 25);
scdem.monitor("node", "yVel", 25, 25, 25);
scdem.monitor("node", "zVel", 25, 25, 25);
scdem.monitor("node", "xAcc", 25, 25, 25);
scdem.monitor("node", "yAcc", 25, 25, 25);
scdem.monitor("node", "zAcc", 25, 25, 25);

// 求解 (求解 10000 步)
scdem.solveGpu(10000);

// 释放 GPU 内存
scdem.releaseGpuMem();

// 打印完成信息
print("Solution Finished");
