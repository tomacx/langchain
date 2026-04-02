setCurDir(getSrcDir());

// 设置计算结果输出间隔为2000步
scdem.outputInterval = 2000;

// 监控迭代次数设置为100
scdem.monitorIter = 100;

// 打开虚质量计算开关
scdem.isVirtualMass = 1;

// 虚时步设置为0.5
scdem.virtualStep = 0.5;

// 关闭大位移效应
scdem.set("isLargeDisplace", 0);

// 导入网格文件并获取网格数据
var msh = imesh.importGmsh("pan-300000.msh");
scdem.getMesh(msh);

// 设置单元模型为线弹性模量
scdem.setModel("linear");

// 设置材料参数：密度、弹性模量、泊松比、切向强度、法向强度、摩擦角和粘聚力
scdem.setMat([2700, 60e9, 0.2, 25e6, 15e6, 40, 10]);

// 设置交界面模型为断裂模型，并设置接触断裂能量
scdem.setIModel("FracE");
scdem.setContactFractureEnergy(5, 50);
scdem.setIMatByElem(10);

// 对最底侧节点施加法向约束
var oSel = new SelNodes(scdem);
oSel.box(-1e10, -0.0301, -1e10, 1e10, -0.0299, 1e10);
scdem.setVel(oSel, "y", 0);

// 对最顶侧节点施加准静态速度载荷
oSel = new SelNodes(scdem);
oSel.box(-1e10, 0.0299, -1e10, 1e10, 0.0301, 1e10);
scdem.setVel(oSel, "y", -5e-9);

// 对最顶侧节点进行区域监控
oSel = new SelNodes(scdem);
oSel.box(-1e10, 0.0299, -1e10, 1e10, 0.0301, 1e10);
scdem.regionMonitor("node", "yForce", 1, oSel);

// 设置局部阻尼系数
scdem.localDamp = 0.8;

// 计算10万步
scdem.solveGpu(100000);

// 释放GPU端内存
scdem.releaseGpuMem();

// 打印提示信息
print("Solution Finished");
