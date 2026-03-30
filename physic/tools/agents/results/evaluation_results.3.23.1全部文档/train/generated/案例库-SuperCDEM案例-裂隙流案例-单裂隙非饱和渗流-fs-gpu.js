setCurDir(getSrcDir());

// 启用裂隙渗流计算模块
scdem.set("Config_FracSeepage", 1);
scdem.set("FracSeepage_Cal", 1);
scdem.set("Mechanic_Cal", 0);
scdem.set("gravity", [0.0, 0.0, 0.0]);

// 设置输出和监测参数
scdem.outputInterval = 1000;
scdem.monitorIter = 10;

// 导入Gmsh网格文件
var msh = imesh.importGmsh("boxcrack.msh");
scdem.getMesh(msh);

// 设置裂隙流动面并创建网格
SFracsp.setFlowCrackFace(1, 2);
SFracsp.createGridFromBlock(2);

// 设置裂隙物理属性 [密度, 体积模量, 渗透系数, 动力粘度]
SFracsp.setPropByCoord([1000.0, 2e8, 1e-9, 1e-4], -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 应用注入压力边界条件
SFracsp.applyConditionByCoord("pp", 10e6, 0, 0, 0, -1e5, 1e5, -1e5, 1e5);

// 设置监测点：压力监测
for(var i = 0; i <= 50; i++) {
    scdem.monitor("fracsp", "sc_pp", i, 0.5, 0.5);
}

// 设置监测点：饱和度监测
for(var i = 0; i <= 50; i++) {
    scdem.monitor("fracsp", "sc_sat", i, 0.5, 0.5);
}

// 设置时间步长（秒）
scdem.timeStep = 0.01;

// 执行GPU求解，总时长30小时
scdem.dynaSolveGpu(30 * 3600);

print("finish");
