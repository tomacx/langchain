setCurDir(getSrcDir());

// ==================== 1. 初始化仿真环境 ====================
scdem.outputInterval = 5000;
scdem.monitorIter = 100;
scdem.isVirtualMass = 0;
scdem.set("isLargeDisplace", 1);
scdem.set("RayleighDamp", 3.3e-7, 0);
scdem.set("isVtk", 1);

// ==================== 2. 导入网格模型 ====================
var msh = imesh.importGmsh("singleHole_1.5mm.msh");
scdem.getMesh(msh);

// ==================== 3. 设置材料属性 ====================
scdem.setModel("Linear");
scdem.setMat([2660, 54e9, 0.16, 6e6, 6e6, 53, 10]); // [密度, 弹性模量, 泊松比, 剪切模量, 屈服强度, 断裂能, 组号]

// ==================== 4. 设置裂隙渗流模块参数 ====================
scdem.set("Config_FracSeepage", 1); // 开启裂隙气体流动
scdem.set("FracSeepage_Cal", 1); // 进行裂隙气体流动计算
scdem.set("Seepage_Mode", 2); // 流动模式设置为气体
scdem.set("FS_Solid_Interaction", 1); // 开启裂隙场和固体场耦合计算
scdem.set("FS_Gas_Index", 4/3); // 气体常数值设置
scdem.set("FS_MaxWid", 1e-1); // 最大开度
scdem.set("FS_MinWid", 0.0); // 最小开度设置为0.0
scdem.set("FS_Frac_Start_Cal", 1); // 开启破裂才进行气体压力计算
scdem.set("isJWLBlastGasFlow", 1); // 开启JWL爆生气体流动计算
scdem.set("GasFlowModel", 2); // 开启湍流流动模型
scdem.set("CSRoughness", 0.01); // 设置粗糙度
scdem.set("GasEos", 2); // 采用多方方程进行气体流动计算
scdem.set("ErosionMassThreshold", 0.05); // 删除炸药单元的临界质量比

// ==================== 5. 设置JWL爆源参数 ====================
var blastPos = [2.5, 2.5, 2.0]; // 爆源位置坐标
scdem.setJWLBlastSource(1, 1100, 4.1e9, 162.7e9, 10.82e9, 5.4, 1.8,
    3.0e9, 0.0, 0.0, blastPos[0], blastPos[1], blastPos[2], 0.0, 100e-6);

// ==================== 6. 设置边界条件 ====================
// 动态边界 - 炸药加载面
var oSel = new SelElemFaces(scdem);
oSel.cylinder(0, 0, 0, 0, 0, 0.15, 0, 3.226e-3);
scdem.applyDynaBoundaryFromFileBySel("faceforce", true, -1, 0, 0, oSel, "BlastLoad-fit-10us.txt");

// 无反射边界 - 四周 + 底部
oSel = new SelElemFaces(scdem);
oSel.box(-100, -100, -0.001, 100, 100, 0.001);
scdem.applyNonReflectionBySel(oSel);

oSel = new SelElemFaces(scdem);
oSel.box(-100, -0.001, -100, 100, 0.001, 100);
scdem.applyNonReflectionBySel(oSel);

oSel = new SelElemFaces(scdem);
oSel.box(-100, 2.99, -100, 100, 3.01, 100);
scdem.applyNonReflectionBySel(oSel);

oSel = new SelElemFaces(scdem);
oSel.box(-0.001, -100, -100, 0.001, 100, 100);
scdem.applyNonReflectionBySel(oSel);

oSel = new SelElemFaces(scdem);
oSel.box(2.99, -100, -100, 3.01, 100, 100);
scdem.applyNonReflectionBySel(oSel);

// ==================== 7. 设置监测点 ====================
var monitorPos = [0.5, 0.5, 2.5]; // 监测点位置
scdem.addMonitorPoint(monitorPos[0], monitorPos[1], monitorPos[2]);
scdem.addMonitorPoint(monitorPos[0] + 0.5, monitorPos[1], monitorPos[2]);

// ==================== 8. 设置裂隙渗流参数 ====================
fracsp.SetSinglePropByCoord("FDensity", 1000, -100, 100, -100, 100, -100, 100); // 流体密度
fracsp.SetSinglePropByCoord("KCoeff", 1e-12, -100, 100, -100, 100, -100, 100); // 渗透系数
fracsp.SetSinglePropByCoord("DynaVisc", 1.8e-5, -100, 100, -100, 100, -100, 100); // 动力粘度

// ==================== 9. 设置孔隙渗流参数 ====================
poresp.SetSinglePropByCoord("FDensity", 1500, -10, 10, -10, 10, -10, 10); // 孔隙流体密度
poresp.SetSinglePropByCoord("BiotCoeff", 0.9, -10, 10, -10, 10, -10, 10); // 比奥系数

// ==================== 10. 设置求解参数并求解 ====================
scdem.timeStep = 1e-9;
scdem.dynaSolveGpu(100e-6);

// ==================== 11. 释放GPU内存 ====================
scdem.releaseGpuMem();

print("finish");
