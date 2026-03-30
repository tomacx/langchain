setCurDir(getSrcDir());

// ==================== 全局参数设置 ====================
scdem.outputInterval = 10000;
scdem.monitorIter = 100;
scdem.isVirtualMass = 0;
scdem.set("isLargeDisplace", 1);
scdem.set("RayleighDamp", 5e-6, 0);
scdem.set("isVtk", 0);
scdem.set("specialOutputInterval", 0, 20000, 500);

// ==================== 裂隙渗流模块参数设置 ====================
scdem.set("Config_FracSeepage", 1); // 开启裂隙气体流动
scdem.set("FracSeepage_Cal", 1); // 进行裂隙气体流动计算
scdem.set("Seepage_Mode", 2); // 流动模式设置为气体
scdem.set("FS_Solid_Interaction", 1); // 开启裂隙场和固体场耦合计算
scdem.set("FS_Gas_Index", 4/3); // 气体常数值设置

scdem.set("FS_MaxWid", 1e-1);
scdem.set("FS_MinWid", 0.0); // 最小开度设置为0.0
scdem.set("FS_Frac_Start_Cal", 1); // 开启破裂才进行气体压力计算
scdem.set("isJWLBlastGasFlow", 1); // 开启JWL爆生气体流动计算
scdem.set("GasFlowModel", 2); // 开启湍流流动模型

scdem.set("CSRoughness", 0.01); // 设置粗糙度为0.1
scdem.set("GasEos", 2); // 采用多方方程进行气体流动计算
scdem.set("ErosionMassThreshold", 0.05); // 删除炸药单元的临界质量比

// ==================== 导入网格 ====================
var msh = imesh.importGmsh("BallBlast-40W.msh");
scdem.getMesh(msh);

// ==================== 模型与材料设置 ====================
scdem.setModel("linear");
scdem.setModel(1, "JWL");

// 岩石材料参数 [密度, 弹性模量, 泊松比, 屈服强度, 剪切模量, 摩擦角, 粘聚力]
scdem.setMat([2700, 60e9, 0.25, 20e6, 8e6, 35, 10]);

// 炸药材料参数
scdem.setMat(1, [1100, 10e9, 0.2, 1e3, 1e3, 30, 10]);

// ==================== JWL爆源参数设置 ====================
var pos = [2.5, 2.5, 2.0]; // 爆源位置坐标
scdem.setJWLBlastSource(1, 1100, 4.1e9, 162.7e9, 10.82e9, 5.4, 1.8,
                        3.0, 1.0, 0.0, 0.0, pos);

// ==================== 裂隙渗流属性设置 ====================
SFracsp.preFlowCrackByCylinder(0.0, 0.0, -10.0, 0.0, 0.0, 10.0, 0.0, 3.2e-3);

SFracsp.createGridFromBlock(1);

SFracsp.setProp([0.00, 1e7, 12e-13, 12e-9]);

// ==================== 边界条件设置 ====================
scdem.gravity = [0, 0, -9.8]; // 重力加速度

// 四周 + 底部无反射边界
var oSel = new SelElemFaces(scdem);
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

// ==================== 求解器设置 ====================
scdem.timeStep = 1e-7;
scdem.dynaSolveGpu(0.004);

// ==================== 输出与监测 ====================
pfly.ExportGroundStatiInfo(0.0, 0.0, 0.0, 20.0, 5.0, 20, 1, 10);

// 释放GPU端内存
scdem.releaseGpuMem();

print("finish!");
