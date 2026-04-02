setCurDir(getSrcDir());

// 设置计算结果输出间隔为1000步
scdem.outputInterval = 1000;

// 打开虚质量计算开关
scdem.isVirtualMass = 1;

// 虚时步设置
scdem.virtualStep = 0.5;

// 导入网格文件并获取网格数据
var msh = imesh.importGmsh("pan.msh");
scdem.getMesh(msh);

// 设置单元模型为线弹性模量
scdem.setModel("linear");

// 设置单元的材料参数
scdem.setMat([2700, 60e9, 0.2, 25e6, 15e6, 40, 10]);

// 设置交界面模型为断裂模型
scdem.setIModel("FracE");
scdem.setIMatByElem(10);
scdem.setContactFractureEnergy(5, 50);

// 最底侧节点法向约束
var oSel = new SelNodes(scdem);
oSel.box(-1e10, -0.0301, -1e10, 1e10, -0.0299, 1e10);
scdem.setVel(oSel, "y", 0);

// 最顶侧节点施加准静态速度载荷
oSel = new SelNodes(scdem);
oSel.box(-1e10, 0.0299, -1e10, 1e10, 0.0301, 1e10);
scdem.setVel(oSel, "y", -5e-9);

// 区域监控
oSel = new SelNodes(scdem);
oSel.box(-1e10, 0.0299, -1e10, 1e10, 0.0301, 1e10);
scdem.regionMonitor("node", "yForce", 1, oSel);

// 设置局部阻尼
scdem.localDamp = 0.8;

// 计算步数设置
scdem.solveGpu(100000);

// 释放GPU端内存
scdem.releaseGpuMem();

print("Solution Finished");
