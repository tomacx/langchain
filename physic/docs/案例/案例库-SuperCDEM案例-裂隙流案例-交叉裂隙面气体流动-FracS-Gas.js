setCurDir(getSrcDir());

//包含裂隙计算模块，开辟相应内存
scdem.set("Config_FracSeepage", 1);

scdem.set("FracSeepage_Cal", 1);

scdem.set("Mechanic_Cal", 0);

SFracsp.importGrid("gid", "fracurenet.msh");

scdem.set("gravity",[0.0,-10.0,0.0]);

scdem.outputInterval = 100;

scdem.set("Seepage_Mode", 2);

SFracsp.setPropByCoord([1.00,1e7,12e-13,12e-9], -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

SFracsp.initConditionByCoord("pp",1e5, 0,0,0, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

SFracsp.applyConditionByCoord("pp", 30e6, 0,0,0, -1e5, 1e5, -0.001, 0.001, -1e5, 1e5)

scdem.timeStep = 100;
scdem.solveGpu(10000);

print("finish");

