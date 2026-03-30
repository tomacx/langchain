setCurDir(getSrcDir());

// 确认SuperCDEM仿真脚本的输入参数
scdem.set("isLargeDisplace", 1);
scdem.gravity = [0, 0, 0];
scdem.isVirtualMass = 0;
scdem.set("ubr", 1e-4);
scdem.localDamp = 0.8;

// 设置圆盘的物理参数
scdem.setMat([2700, 60e9, 0.2, 25e6, 15e6, 40, 10]);

// 设置CrackSolid模块的参数
scdem.setIModel("FracE");
scdem.setContactFractureEnergy(5, 50);
scdem.setIMatByElem(10);

// 设置GPU计算参数
scdem.outputInterval = 1000;
scdem.monitorIter = 10;

// 创建圆盘的几何模型
var msh = imesh.importGmsh("pan-300000.msh");
scdem.getMesh(msh);

// 创建CrackSolid模块
SFracsp.createGridFromBlock(2);

// 设置裂隙渗流模块的参数
SFracsp.setPropByCoord([1000.0, 2e8, 1e-9, 1e-4], -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 设置固体-裂隙耦合参数
SFracsp.applyConditionByCoord("pp", 10e6, 0, 0, 0, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 设置监测参数
for (var i = 0; i <= 50; i++) {
    scdem.monitor("fracsp", "sc_pp", i, 0.5, 0.5)
}

for (var i = 0; i <= 50; i++) {
    scdem.monitor("fracsp", "sc_sat", i, 0.5, 0.5)
}

// 运行SuperCDEM仿真脚本
scdem.timeStep = 0.01;
scdem.dynaSolveGpu(30 * 3600);

print("finish");
