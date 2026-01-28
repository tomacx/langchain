setCurDir(getSrcDir());

scdem.outputInterval = 10000;
scdem.monitorIter = 100;

scdem.isVirtualMass = 0;

scdem.set("isLargeDisplace", 1);
scdem.set("RayleighDamp", 5e-6, 0);

scdem.set("isVtk", 0);
scdem.set("specialOutputInterval", 0, 20000, 500);

// 裂隙渗流模块参数设置
scdem.set("Config_FracSeepage", 1); // 开启裂隙气体流动
scdem.set("FracSeepage_Cal", 1); // 进行裂隙气体流动计算
scdem.set("Seepage_Mode", 2); // 流动模式设置为气体
scdem.set("FS_Solid_Interaction", 1); // 开启裂隙场和固体场耦合计算
scdem.set("FS_Gas_Index", 4/3); //气体常数值设置 

scdem.set("FS_MaxWid", 1e-1);
scdem.set("FS_MinWid", 0.0); //最小开度设置为0.0
scdem.set("FS_Frac_Start_Cal", 1); // 开启破裂才进行气体压力计算
scdem.set("isJWLBlastGasFlow", 1); // 开启JWL爆生气体流动计算
scdem.set("GasFlowModel", 2); //开启湍流流动模型

scdem.set("CSRoughness", 0.01); //设置粗糙度为0.1，这个值后续可能需要调整
scdem.set("GasEos", 2); //采用多方方程进行气体流动计算
scdem.set("ErosionMassThreshold", 0.05); //删除炸药单元的临界质量比，炸药单元质量衰减至该值后，认为炸药单元不再其作用，溶蚀掉

var msh = imesh.importGmsh("BallBlast-40W.msh");//可更换文件中不同网格数量的网格文件
scdem.getMesh(msh);

scdem.setModel("linear");
scdem.setModel(1, "JWL");

scdem.setMat([2700, 60e9, 0.25, 20e6, 8e6, 35, 10]); //岩石材料参数

scdem.setMat(1, [1100, 10e9, 0.2, 1e3, 1e3, 30, 10]); //材料参数

// JWL参数设置
// Usage: scdem.setJWLBlastSource(<iNum, density, E0, A, B, R1, R2, Omiga, Pcj, D, BeginTime, LastTime, [ArrayFirePos]> ;
var pos = [2.5, 2.5, 2.0];
scdem.setJWLBlastSource(1, 1100, 4.1e9, 162.7e9, 10.82e9, 5.4, 1.8, 0.25, 7.5e9, 5100, 0.0, 1, pos);
// scdem.setJWLBlastSource(1, 1630, 7e9, 371.2e9, 3.2e9, 4.2, 0.95, 0.3, 20e9, 6930, 0.0, 1e-2, pos);
scdem.bindJWLBlastSource(1, 1, 1);

scdem.setIModel("Linear", 1);
scdem.setIModel("FracE", 2);
scdem.setIModel("FracE", 1, 2); 

scdem.setContactFractureEnergy(10,100);
scdem.setContactFractureEnergy(0, 0, 1, 2); // 炸药和堵塞的接触面断裂能为0

// 设置炸药单元与固体单元的接触面参数，强度全部为0  设置大刚度，防止网格畸变
scdem.setIMatByElem(10.0);

// scdem.setIMat(1e14, 1e14, 30, 1e3, 1e3, 1);
// scdem.setIMat(1e14, 1e14, 30, 1e3, 1e3, 2);
// scdem.setIMat(1e14, 1e14, 35, 20e6, 8e6, 3);

scdem.setIMat(1e14, 1e14, 0, 0, 0, 1, 2);

//四周 + 底部无反射边界
oSel = new SelElemFaces(scdem);
oSel.box(-100,-100,-0.001,100,100,0.001);
scdem.applyNonReflectionBySel(oSel);

oSel = new SelElemFaces(scdem);
oSel.box(-100,-0.001,-100,100,0.001,100);
scdem.applyNonReflectionBySel(oSel);

oSel = new SelElemFaces(scdem);
oSel.box(-100,4.99,-100,100,5.01,100);
scdem.applyNonReflectionBySel(oSel);

oSel = new SelElemFaces(scdem);
oSel.box(-0.001,-100,-100,0.001,100,100);
scdem.applyNonReflectionBySel(oSel);

oSel = new SelElemFaces(scdem);
oSel.box(4.99,-100,-100,5.01,100,100);
scdem.applyNonReflectionBySel(oSel);


/////////////////////裂隙网格部分
SFracsp.setFlowCrackFace(2);

SFracsp.disableFlowCrackByGroup(1, 2);

SFracsp.createGridFromBlock(2);

SFracsp.setProp([0, 1e7, 12e-13, 0]);

// 炸药四周的气体密度设置为和炸药密度一致
SFracsp.setProp([1100, 1e7, 12e-13, 0]);//药柱四周

// 模型顶部为大气压边界条件
SFracsp.applyConditionByCoord("pp", 0, 0, 0, 0, -100, 100, -100, 100, 2.499, 2.51);

scdem.monitor("elem", "sxx", 2.5, 2.5, 2.0);
scdem.monitor("fracsp", "outMass");
scdem.monitor("fracsp", "exGasDens");
scdem.monitor("spring", "crackRatio", 2, 2);

scdem.timeStep = 5e-8;
scdem.dynaSolveGpu(1e-2);

print("finish!");