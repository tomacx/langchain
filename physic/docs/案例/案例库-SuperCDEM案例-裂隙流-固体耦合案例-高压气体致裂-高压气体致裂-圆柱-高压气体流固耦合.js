setCurDir(getSrcDir());

scdem.outputInterval = 5000;
scdem.monitorIter = 100;


scdem.set("isLargeDisplace", 1);

scdem.gravity = [0, 0, 0];

scdem.isVirtualMass = 0;

scdem.set("ubr", 1e-4);

scdem.set("RayleighDamp", 1e-7, 0.0);
scdem.set("isVtk", 1);

//裂隙渗流模块参数设置
scdem.set("Config_FracSeepage", 1); 
scdem.set("FracSeepage_Cal", 1);
scdem.set("Seepage_Mode", 2);     
scdem.set("FS_Solid_Interaction", 1);
scdem.set("FS_MaxWid", 1e-3);

scdem.set("FS_Frac_Start_Cal", 1);
scdem.set("GasEos", 2); //采用多方方程进行气体流动计算
scdem.set("GasFlowModel", 2); //开启湍流流动模型
scdem.set("CSRoughness", 0.001);

var msh = imesh.importGmsh("Cylinder-5mm.msh");
scdem.getMesh(msh);

scdem.setModel("linear");

scdem.setMat([1700, 3e9, 0.2, 14.4e6, 3e6, 30, 15]);

scdem.setIModel("FracE");
scdem.setContactFractureEnergy(10,100);
scdem.setIMatByElem(10);

oSel = new SelElemFaces(scdem);
oSel.cylinder(0.0, 0.0, -1.0, 0.0, 0.0, 1.0, 6.99e-3, 7.05e-3);
scdem.applyNonReflectionBySel(oSel);

SFracsp.preFlowCrackByCylinder(0.0, 0.0, -10.0, 0.0, 0.0, 10.0, 0.0, 3.2e-3);

SFracsp.createGridFromBlock(1);

SFracsp.setProp([0.00,1e7,12e-13,12e-9]);

SFracsp.setPropByCylinder([170.0, 1e7, 12e-13, 12e-9], 0.0, 0.0, -10.0, 0.0, 0.0, 10.0, 0.0, 3.05e-3)

// 高压气体计算C值
var pressure = 20e6;
var Cof_C = pressure / 170;

scdem.set("EoSCof_C", Cof_C);

SFracsp.applyConditionByCylinder("pp", pressure, 0, 0, 0, 0.0, 0.0, -10.0, 0.0, 0.0, 10.0, 0.0, 5e-3);

scdem.timeStep= 5e-10;

scdem.dynaSolveGpu(120e-6);

print("finish");