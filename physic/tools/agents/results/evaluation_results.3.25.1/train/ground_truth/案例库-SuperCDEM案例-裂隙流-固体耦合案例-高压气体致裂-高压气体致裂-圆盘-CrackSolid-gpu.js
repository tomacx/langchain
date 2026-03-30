setCurDir(getSrcDir());

scdem.outputInterval = 100;
scdem.monitorIter = 100;

scdem.set("isLargeDisplace", 1);

scdem.gravity = [0,0,0];

scdem.isVirtualMass = 0;

scdem.set("ubr", 1e-4);

scdem.localDamp = 0.8;

//裂隙渗流模块参数设置
scdem.set("Config_FracSeepage", 1);
scdem.set("FracSeepage_Cal", 1);
scdem.set("Seepage_Mode", 2);
scdem.set("FS_Solid_Interaction", 1);
scdem.set("FS_MaxWid", 6e-5);

var msh = imesh.importGmsh("Tet4Gmsh.msh");
scdem.getMesh(msh);

scdem.setModel("linear");

scdem.setMat([2600, 5.5e10, 0.25, 10e6, 2.5e6, 30.0, 10.0]);

scdem.setIModel("FracE");
scdem.setContactFractureEnergy(10, 20)

scdem.setIMat(5e9, 5e9, 30, 10e6, 2.5e6);
scdem.setIMatByElem(50);
scdem.setContactFractureEnergy(50,100);

SFracsp.createGridFromBlock(1);

SFracsp.setPropByCoord([1.0, 1e7, 12e-13, 12e-9], -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
SFracsp.initConditionByCoord("pp", 1e5, 0, 0, 0,  -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

SFracsp.applyConditionByCylinder("pp", 30e6,  0, 0, 0,    0,0,-1,0,0,1, 0,0.151);

scdem.timeStep= 1e-7;

scdem.dynaSolveGpu(0.01);

print("finish");
