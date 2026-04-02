setCurDir(getSrcDir());

scdem.outputInterval = 100;
scdem.monitorIter = 10;

scdem.set("ubr", 1e-4);

//包含裂隙计算模块，开辟相应内存
scdem.set("Config_FracSeepage", 1);
scdem.set("FracSeepage_Cal", 1);
scdem.set("FS_Solid_Interaction", 1);
scdem.set("FS_MaxWid", 6e-5);

var msh = imesh.importGmsh("Tet4Gmsh.msh");
scdem.getMesh(msh);

scdem.setModel("linear");

// 设置材料参数
scdem.setMat([2600, 5.5e10, 0.25, 10e6, 2.5e6, 30.0, 10.0]);

// 设置接触断裂能量
scdem.setIModel("FracE");
scdem.setContactFractureEnergy(10, 20);

// 创建裂隙网格
SFracsp.createGridFromBlock(1);

// 设置流体属性
SFracsp.setPropByCoord([1.0, 1e7, 12e-13, 12e-9], -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 初始化流体条件
SFracsp.initConditionByCoord("pp", 1e5, 0, 0, 0, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 应用边界条件
SFracsp.applyConditionByCylinder("pp", 30e6, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0.151);

scdem.timeStep = 1e-7;
scdem.dynaSolveGpu(0.01);

print("finish");
