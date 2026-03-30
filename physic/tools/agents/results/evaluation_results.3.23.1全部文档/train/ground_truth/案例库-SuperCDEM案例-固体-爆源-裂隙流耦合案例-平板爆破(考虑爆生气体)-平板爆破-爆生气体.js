setCurDir(getSrcDir());

scdem.outputInterval = 1000;
scdem.monitorIter = 10;

scdem.set("isLargeDisplace", 1);

scdem.set("isVtk", 1);

scdem.gravity = [0, 0, 0];

scdem.isVirtualMass = 0;

scdem.set("ubr", 1e-4);

scdem.set("RayleighDamp", 5e-7, 0);

//裂隙渗流模块参数设置
scdem.set("Config_FracSeepage", 1);
scdem.set("FracSeepage_Cal", 1);
scdem.set("Seepage_Mode", 2);
scdem.set("FS_Solid_Interaction", 1);
scdem.set("FS_Gas_Index", 4/3);
scdem.set("FS_MaxWid", 1e-1);
scdem.set("FS_MinWid", 0.0);

scdem.set("FS_Frac_Start_Cal", 1); // 开启破裂才进行气体压力计算
scdem.set("isJWLBlastGasFlow", 1); // 开启爆生气体流动
scdem.set("GasFlowModel", 2); //开启湍流流动模型

scdem.set("CSRoughness", 0.001);
scdem.set("GasEos", 2); //采用多方方程进行气体流动计算
scdem.set("ErosionMassThreshold", 0.01); //删除炸药单元的临界质量比，炸药单元质量衰减至该值后，认为炸药单元不再其作用，溶蚀掉

var msh = imesh.importGmsh("plateblast.msh");
scdem.getMesh(msh);

scdem.setModel("linear");

scdem.setModel(1, "JWL");

scdem.setMat([2500, 5e10, 0.25, 30e6, 15e6, 45.0, 10.0]);
scdem.setMat(1, [1000, 10e9, 0.2, 1e3, 1e3, 30, 10]); //炸药材料参数

var pos = [0.05, 0.05, 0.0025];
scdem.setJWLBlastSource(1, 931, 2.484e9, 49.46e9, 1.891e6, 3.907, 1.118, 0.333, 5.15e9, 4160, 0.0, 1e-2, pos);
scdem.bindJWLBlastSource(1, 1, 1);

scdem.setIModel("Linear", 1);
scdem.setIModel("FracE", 2);
scdem.setIModel("FracE", 1, 2);
scdem.setContactFractureEnergy(10,100);
scdem.setContactFractureEnergy(0, 0 , 1,2);
scdem.setIMatByElem(10.0);

// 设置炸药单元与固体单元的接触面参数1
scdem.setIMat(1e14, 1e14, 0, 0, 0, 1, 2);

// 设置无反射条件

///上
oSel = new SelElemFaces(scdem);
oSel.box(-100, 0.0999, -100, 100, 0.1001, 100);
scdem.applyNonReflectionBySel(oSel);

///下
oSel = new SelElemFaces(scdem);
oSel.box(-100, -0.0001, -100, 100, 0.0001, 100);
scdem.applyNonReflectionBySel(oSel);

///左
oSel = new SelElemFaces(scdem);
oSel.box(-0.0001, -100, -100, 0.0001, 100, 100);
scdem.applyNonReflectionBySel(oSel);

///右
oSel = new SelElemFaces(scdem);
oSel.box(0.0999, -100, -100, 0.1001, 100, 100);
scdem.applyNonReflectionBySel(oSel);

// 固定z方向位移
oSel = new SelNodes(scdem);
//oSel.box(-1e10, -1e10, -1e10, 1e10, 1e10, 1e10);
oSel.cylinder(0.05, 0.05, -1, 0.05, 0.05, 1, 0.00205, 100);
scdem.setVel(oSel, "z", 0);

SFracsp.setFlowCrackFace(2);
SFracsp.disableFlowCrackByGroup(1, 2);
SFracsp.createGridFromBlock(2);

SFracsp.setProp([0, 1e7, 12e-13, 0]);

// 炸药中心 z方向上取3个点
scdem.monitor("elem", "syy", 0.05, 0.05, 0.0025);

scdem.monitor("elem", "sxx", 0.05 + 0.0021, 0.05, 0.0025);
scdem.monitor("elem", "sxx", 0.05 + 0.0025, 0.05, 0.0025);

// 炸药中心 x 方向上 取 3个点
for (var i = 1; i < 5; i++)
{
    scdem.monitor("elem", "sxx", 0.05 + i * 0.005, 0.05, 0.0025);
}

scdem.monitor("fracsp", "outMass");
scdem.monitor("fracsp", "exGasDens");
scdem.monitor("spring", "crackRatio", 2, 2);

scdem.timeStep = 1e-9;
scdem.dynaSolveGpu(4e-5);

print("finish");
