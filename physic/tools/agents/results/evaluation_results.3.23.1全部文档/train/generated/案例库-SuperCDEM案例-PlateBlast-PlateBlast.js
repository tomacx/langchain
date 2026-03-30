setCurDir(getSrcDir());

// 初始化仿真环境参数
scdem.outputInterval = 1000;
scdem.monitorIter = 100;
scdem.isVirtualMass = 0;
scdem.set("isLargeDisplace", 1);
scdem.set("RayleighDamp", 2e-8, 0);

// 导入网格文件（实际使用时可替换为生成的几何）
var msh = imesh.importGmsh("PlateBlast-60w.msh");
scdem.getMesh(msh);

// 设置模型类型为线性弹性
scdem.setModel("Linear");

// 设置板材料参数 [密度, 弹性模量, 泊松比, 屈服强度, 剪切模量, 失效准则, 单元类型]
scdem.setMat([2700, 60e9, 0.2, 25e6, 15e6, 40, 10]);

// 设置断裂模型参数
scdem.setIModel("FracE");
scdem.setContactFractureEnergy(20, 40);
scdem.setIMatByElem(10);

// 创建空气颗粒（爆炸冲击波介质）
var x = new Array(-0.5, 0.5);
var y = new Array(-0.5, 0.5);
var z = new Array(-0.5, 0.5);
pdyna.AdvCreateByCoord(100000, 2, 2, "uniform", 0.005, 0.003, 0.0, x, y, z);

// 设置空气材料参数（理想气体）
scdem.setMat(2, [1.225, 1e5, 1.4, 0, 0, 1, 2]);

// 设置爆炸源初始压力
scdem.setUDFValue([1e6, 1.4]); // 初始压力1MPa，绝热指数1.4

// 边界条件：固定板边缘
oSel = new SelNodes(scdem);
oSel.box(-1e10, -0.5, -1e10, 1e10, 0.5, 1e10); // 左侧固定
scdem.setVel(oSel, "x", 0);

oSel = new SelNodes(scdem);
oSel.box(-1e10, -0.5, -1e10, 1e10, -0.5, 1e10); // 下侧固定
scdem.setVel(oSel, "y", 0);

// 设置监测点：记录板表面应力和位移历史
oSel = new SelNodes(scdem);
oSel.box(-1e10, -0.49, -1e10, 1e10, 0.51, 1e10); // 上表面监测
scdem.regionMonitor("node", "yDisp", 1, oSel);

oSel = new SelNodes(scdem);
oSel.box(-1e10, -0.49, -1e10, 1e10, -0.51, 1e10); // 下表面监测
scdem.regionMonitor("node", "yDisp", 2, oSel);

// 设置输出文件路径
scdem.set("isVtk", 1);
scdem.set("OutputDir", "./results");

// 设置时步和求解时间
scdem.timeStep = 1e-9;
scdem.dynaSolveGpu(5e-4);

// 释放GPU内存
scdem.releaseGpuMem();

print("PlateBlast Simulation Finished");
