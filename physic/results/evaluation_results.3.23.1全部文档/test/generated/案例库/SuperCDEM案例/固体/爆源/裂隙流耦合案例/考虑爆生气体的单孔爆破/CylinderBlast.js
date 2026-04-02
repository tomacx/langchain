setCurDir(getSrcDir());

scdem.outputInterval = 100;
scdem.monitorIter = 100;

scdem.set("isLargeDisplace", 1);

scdem.gravity = [0, 0, 0];

scdem.isVirtualMass = 0;

scdem.set("ubr", 1e-4);

// 裂隙渗流模块参数设置
scdem.set("Config_FracSeepage", 1);
scdem.set("FracSeepage_Cal", 1);
scdem.set("Seepage_Mode", 2); // 气体流动模式
scdem.set("FS_Solid_Interaction", 1);

var msh = imesh.importGmsh("Cylinder-5mm.msh");
scdem.getMesh(msh);

// 设置材料模型和参数
scdem.setModel("linear");
scdem.setMat([1700, 3e9, 0.2, 14.4e6, 3e6, 30, 15]);

// 裂隙渗流模块设置
SFracsp.createGridFromBlock(1);
SFracsp.setProp([0.00, 1e7, 12e-13, 12e-9]);
SFracsp.setPropByCylinder([170.0, 1e7, 12e-13, 12e-9], 0.0, 0.0, -10.0, 0.0, 0.0, 10.0, 0.0, 3.05e-3);

// 高压气体计算C值
var pressure = 20e6;
var Cof_C = pressure / 170;

scdem.set("EoSCof_C", Cof_C);

SFracsp.applyConditionByCylinder("pp", pressure, 0, 0, 0, 0.0, 0.0, -10.0, 0.0, 0.0, 10.0, 0.0, 3.2e-3);

scdem.timeStep = 1e-7;
scdem.dynaSolveGpu(0.01);
print("finish");
