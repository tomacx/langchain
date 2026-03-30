setCurDir(getSrcDir());

// 初始化仿真控制参数
bcdem.outputInterval = 100;
bcdem.isVirtualMass = 1;
bcdem.virtualStep = 0.6;
bcdem.ubr = 1e-4;
bcdem.localDamp = 0.5;

// 导入二维网格模型
var msh = imesh.importGmsh("UCT2d.msh");
bcdem.getMesh(msh);

// 设置单元模型为线弹性
bcdem.setModel("linear");

// 设置单元材料参数 [密度, 杨氏模量, 泊松比, 粘聚力, 抗拉强度, 摩擦角, 膨胀角]
oMat = {
    density: 2500,
    young: 1e10,
    poission: 0.25,
    cohesive: 3e6,
    tension: 3e6,
    friction: 40,
    dilatation: 10
};
bcdem.setMat(oMat);

// 设置界面接触模型为脆性断裂模型
bcdem.setIModel("brittleMC");
bcdem.setIMatByElem(10);

// 施加位移边界条件 - 底部固定
oSel1 = new SelNodes(bcdem);
oSel1.box(-1e5, -0.001, -1e5, 1e5, 0.001, 1e5);
bcdem.setVel(oSel1, "y", 0);

// 施加位移边界条件 - 顶部压缩速度
oSel2 = new SelNodes(bcdem);
oSel2.box(-1e5, 0.099, -1e5, 1e5, 0.101, 1e5);
bcdem.setVel(oSel2, "y", -2e-8);

// 设置监测信息 - 应力应变监测
oSel = new SelNodes(bcdem);
oSel.box(-1e5, -0.099, -1e5, 1e5, 0.099, 1e5);
bcdem.regionMonitor("elem", "stress", 1, oSel);

// 设置监测信息 - 体积变化监测
oSel = new SelNodes(bcdem);
oSel.box(-1e5, -0.099, -1e5, 1e5, 0.099, 1e5);
bcdem.regionMonitor("elem", "volume", 2, oSel);

// 求解计算（启用GPU加速）
bcdem.solveGpu(30000);

// 释放GPU内存
bcdem.releaseGpuMem();

// 输出完成信息
print("Solution Finished");
