setCurDir(getSrcDir());

// ==================== 初始化环境 ====================
scdem.outputInterval = 5000;
scdem.monitorIter = 100;
scdem.isVirtualMass = 0;
scdem.set("isLargeDisplace", 1);
scdem.gravity = [0, -9.8, 0];
scdem.set("RayleighDamp", 5e-6, 0);

// ==================== 裂隙渗流模块参数设置 ====================
scdem.set("Config_FracSeepage", 1); // 开启裂隙气体流动
scdem.set("FracSeepage_Cal", 1); // 进行裂隙气体流动计算
scdem.set("Seepage_Mode", 2); // 流动模式设置为气体
scdem.set("FS_Solid_Interaction", 1); // 开启裂隙场和固体场耦合计算
scdem.set("FS_MaxWid", 0.05); // 最大开度设置为0.05m
scdem.set("FS_MinWid", 0.0); // 最小开度设置为0.0
scdem.set("FS_Frac_Start_Cal", 1); // 开启破裂才进行气体压力计算
scdem.set("isJWLBlastGasFlow", 1); // 开启JWL爆生气体流动计算
scdem.set("GasFlowModel", 2); // 开启湍流流动模型
scdem.set("CSRoughness", 0.01); // 设置粗糙度为0.01
scdem.set("GasEos", 2); // 采用多方方程进行气体流动计算

// ==================== 创建圆柱几何 ====================
var end1 = new Array(0.0, -5.0, 0.0);
var end2 = new Array(0.0, 5.0, 0.0);
var fRadIn = 0.08; // 钻孔半径0.08m
var fRadOut = 1.5; // 围岩外半径1.5m

// 创建圆柱域（实心，内半径为钻孔半径）
blkdyn.GenCylinder(fRadIn, fRadOut, 10.0, 20, 40, 40, 1);

// ==================== 设置材料属性 ====================
scdem.setModel("linear");
scdem.setModel(1, "JWL"); // 炸药模型

// 岩石材料参数 [密度, 弹性模量, 泊松比, 屈服强度, 剪切强度, 内摩擦角, 粘聚力]
scdem.setMat([2700, 60e9, 0.25, 20e6, 8e6, 35, 10]);

// ==================== JWL爆源参数设置 ====================
var blastPos = [0.0, 0.0, 0.0]; // 爆源位置在圆柱中心
scdem.setJWLBlastSource(1, 1100, 4.1e9, 162.7e9, 10.82e9, 5.4, 1.8,
                        1.8, 30e6, 1000, -1000, blastPos);

// ==================== 裂隙网格设置 ====================
SFracsp.createGridFromBlock(1);

// 设置裂隙属性 [渗透率, 断裂能, 气体粘度, 气体扩散系数]
SFracsp.setProp([1e-12, 1e7, 1.8e-5, 2.2e-5]);

// 设置钻孔区域裂隙属性
SFracsp.setPropByCylinder([1e-10, 1e6, 1.8e-5, 2.2e-5],
                          blastPos[0], blastPos[1], blastPos[2],
                          blastPos[0], blastPos[1], blastPos[2],
                          fRadIn, fRadOut);

// ==================== 边界条件设置 ====================
// 远场固定边界（圆柱外表面）
oSel = new SelElemFaces(scdem);
oSel.cylinder(0.0, 0.0, -5.0, 0.0, 0.0, 5.0, fRadOut + 0.1, fRadOut + 0.2);
scdem.applyFixedBySel(oSel);

// 钻孔内表面自由边界（允许气体流动）
oSel.cylinder(0.0, 0.0, -5.0, 0.0, 0.0, 5.0, fRadIn - 0.1, fRadIn);
scdem.applyFreeBySel(oSel);

// ==================== 气体初始压力设置 ====================
var initialGasPressure = 2e6; // 初始气压2MPa
SFracsp.initConditionByCoord("pp", initialGasPressure,
                             blastPos[0], blastPos[1], blastPos[2],
                             -fRadOut, fRadOut, -5.0, 5.0);

// ==================== 时间步与求解设置 ====================
scdem.timeStep = 1e-6; // 时间步长1微秒
scdem.dynaSolveGpu(20000); // 求解20000个输出间隔

// ==================== 监测点设置 ====================
var monitorPoints = [
    [fRadIn + 0.05, 0.0, 0.0], // 钻孔壁附近监测点
    [fRadIn + 0.1, 0.0, 0.0],
    [fRadIn + 0.2, 0.0, 0.0],
    [fRadIn + 0.5, 0.0, 0.0]
];

for (var i = 0; i < monitorPoints.length; i++) {
    var pt = monitorPoints[i];
    scdem.addMonitorPoint(pt[0], pt[1], pt[2], "pressure", "displacement");
}

print("CylinderBlast simulation setup complete.");
print("Simulation will run for 20000 output intervals.");
