setCurDir(getSrcDir());

// 初始化仿真环境
scdem.outputInterval = 100;
scdem.set("isLargeDisplace", 1);
scdem.set("isVirtualMass", 1);
scdem.virtualStep = 0.6;
scdem.ubr = 1e-4;

// 导入四面体网格
var msh = imesh.importGmsh("LargeDis_Tet.msh");
scdem.getMesh(msh);

// 设置单元模型为线弹性
scdem.setModel("linear");

// 定义材料参数（密度、杨氏模量、泊松比、粘聚力、抗拉强度、摩擦角、扩容角）
oMat = {"density": 2500, "young": 1e6, "poission": 0.35, "cohesive": 1.35e9,
       "tension": 0.68e9, "friction": 30, "dilatation": 10};
scdem.setMat(oMat);

// 设置界面材料参数
scdem.setIModel("linear");
scdem.setIMatByElem(10);

// 配置瑞利阻尼系数
blkdyn.SetRayleighDamp(1e-4, 10);

// 设置位移边界条件 - 底部固定
oSel = new SelNodes(scdem);
oSel.box(-1e5, -1e5, -1e5, 1e5, 1e5, 0.005);
scdem.setVel(oSel, "z", 0);

// 设置位移边界条件 - 顶部加载区域
oSel = new SelNodes(scdem);
oSel.box(-1e5, -1e5, -1e5, 1e5, 1e5, 0.052);
scdem.setVel(oSel, "z", -2e-6);

// 设置侧面约束
oSel = new SelNodes(scdem);
oSel.box(-1e5, -1e5, -1e5, 1e5, 0.00499, 0.052);
scdem.setVel(oSel, "x", 0);

oSel = new SelNodes(scdem);
oSel.box(1e5, -1e5, -1e5, 1e5, 0.00499, 0.052);
scdem.setVel(oSel, "x", 0);

// 添加监测点 - 位移和应力
scdem.monitor("node", "xDis", 0.05, 0.05, 0.025);
scdem.monitor("node", "yDis", 0.05, 0.05, 0.025);
scdem.monitor("node", "zDis", 0.05, 0.05, 0.025);

scdem.monitor("node", "sxx", 0.05, 0.05, 0.025);
scdem.monitor("node", "syy", 0.05, 0.05, 0.025);
scdem.monitor("node", "szz", 0.05, 0.05, 0.025);

// 配置超级计算收敛判据
dyna.SuperCal(10, 10000, 1e-5, 1, 1, 1e6);

// 执行求解
scdem.solveGpu(100000);

// 释放GPU内存
scdem.releaseGpuMem();

// 输出总体积
var volObj = gFun.calArbi3DModelInfo(scdem.mesh, oMat.density);
print("模型总体积: " + volObj.vol);

// 输出监测点最终结果
var zDis = scdem.getMonitorValue(1);
var sxxVal = scdem.getMonitorValue(2);
print("监测点Z方向位移: " + zDis);
print("监测点X方向应力: " + sxxVal);

print("Solution Finished");
