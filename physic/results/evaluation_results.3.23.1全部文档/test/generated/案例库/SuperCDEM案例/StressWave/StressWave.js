setCurDir(getSrcDir());

// 设置计算结果输出间隔和监控迭代次数
scdem.outputInterval = 5000;
scdem.monitorIter = 100;

// 打开虚质量计算开关并设置虚时步
scdem.isVirtualMass = 1;
scdem.virtualStep = 0.5;

// 导入网格文件并获取网格数据
var msh = imesh.importGmsh("example.msh");
scdem.getMesh(msh);

// 设置单元模型为线弹性模量，并设置材料参数
scdem.setModel("linear");
scdem.setMat([2700, 69e9, 0.34, 15e6, 8e6, 40, 10]);

// 设置交界面的模型为断裂模型并设定接触断裂能量和材料参数
scdem.setIModel("FracE");
scdem.setContactFractureEnergy(20, 100);
scdem.setIMatByElem(50);

// 定义边界条件，例如约束或施加速度载荷
var oSel = new SelNodes(scdem);
oSel.box(-1e10,-1e10,-1e10, 1e10,1e10,1e10);
scdem.setVel(oSel, "z", 0);

// 定义节点选择器并施加速度载荷
var oSelLoad = new SelNodes(scdem);
oSelLoad.box(-1e10,-1e10,-1e10, 1e10,1e10,1e10);
scdem.setVel(oSelLoad, "y", -2e-9);

// 求解
scdem.solveGpu(50000);

// 释放GPU端内存并打印提示信息
scdem.releaseGpuMem();
print("Solution Finished");
