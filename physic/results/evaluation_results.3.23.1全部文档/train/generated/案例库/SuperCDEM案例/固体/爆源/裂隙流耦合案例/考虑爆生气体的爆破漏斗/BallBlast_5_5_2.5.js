setCurDir(getSrcDir());

scdem.outputInterval = 1000;
scdem.monitorIter = 100;

// 设置大位移分析
scdem.set("isLargeDisplace", 1);

// 设置雷利阻尼
scdem.set("RayleighDamp", 5e-7, 0.0);

// 裂隙渗流模块参数设置
scdem.set("Config_FracSeepage", 1);
scdem.set("FracSeepage_Cal", 1);
scdem.set("Seepage_Mode", 2); // 气体流动模式
scdem.set("FS_Solid_Interaction", 1); // 裂隙与固体相互作用
scdem.set("FS_Gas_Index", 4/3); // 比热比
scdem.set("FS_MaxWid", 1e-1);
scdem.set("FS_MinWid", 0.0);

// 开启破裂才进行气体压力计算
scdem.set("FS_Frac_Start_Cal", 1);
scdem.set("isJWLBlastGasFlow", 1); // 开启爆生气体流动

// 设置湍流模型和粗糙度
scdem.set("CSRoughness", 0.001);
scdem.set("GasEos", 2); // 多方气体状态方程
scdem.set("GasFlowModel", 2);

var msh = imesh.importGmsh("3DBlast-20w.msh");
scdem.getMesh(msh);

// 设置材料模型和参数
scdem.setModel("linear");
scdem.setMat([2700, 70e9, 0.24, 28.3e6, 17.9e6, 55, 10]);

// 设置接触断裂能
scdem.setIModel("FracE");
scdem.setIMatByElem(10);
scdem.setContactFractureEnergy(50, 100);

// 动态边界条件
var oSel = new SelElemFaces(scdem);
oSel.sphere(1.5, 1.5, 1.6, 0.044, 0.046);
scdem.applyDynaBoundaryFromFileBySel("faceforce", true, -1, 0, 0, oSel, "BlastLoad.txt");

// 四周 + 底部无反射边界
oSel = new SelElemFaces(scdem);
oSel.box(-100, -100, -0.001, 100, 100, 0.001);
scdem.applyNonReflectionBySel(oSel);

// 解算
scdem.timeStep = 1e-7;
scdem.dynaSolveGpu(0.004);

// 释放GPU端内存
scdem.releaseGpuMem();

print("finish!");
