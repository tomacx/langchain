setCurDir(getSrcDir());

// ========== 1. 初始化项目环境 ==========
scdem.outputInterval = 1000;
scdem.isVirtualMass = 1;
scdem.set("ubr", 1e-4);
scdem.set("virtualStep", 0.5);
scdem.set("isLargeDisplace", 1);
scdem.gravity = [0, 0, -9.8];

// ========== 2. 导入网格与材料属性 ==========
var msh = imesh.importGmsh("3DBlast-20w.msh");
scdem.getMesh(msh);

scdem.setModel("Linear");
scdem.setMat([2700, 60e9, 0.2, 30e6, 15e6, 35, 10]);

// 设置裂隙模型参数
scdem.setIModel("FracE");
scdem.setIMatByElem(10);
scdem.setContactFractureEnergy(10, 100);

// ========== 3. 施加初始地应力场 ==========
// 固定边界以计算地应力场
var oSel = new SelNodes(scdem);
oSel.box(-100, -100, -0.001, 100, 100, 0.001);
scdem.setVel(oSel, "z", 0);

oSel = new SelNodes(scdem);
oSel.box(-100, -0.001, -100, 100, 0.001, 100);
scdem.setVel(oSel, "y", 0);

oSel = new SelNodes(scdem);
oSel.box(-100, 2.99, -100, 100, 3.01, 100);
scdem.setVel(oSel, "y", 0);

oSel = new SelNodes(scdem);
oSel.box(-0.001, -100, -100, 0.001, 100, 100);
scdem.setVel(oSel, "x", 0);

oSel = new SelNodes(scdem);
oSel.box(2.99, -100, -100, 3.01, 100, 100);
scdem.setVel(oSel, "x", 0);

// 设置局部阻尼
scdem.localDamp = 0.8;

// ========== 4. 求解地应力场 ==========
scdem.solveGpu();

// ========== 5. 释放边界并施加爆破载荷 ==========
oSel = new SelNodes(scdem);
oSel.box(-100, -100, -0.001, 100, 100, 0.001);
scdem.freeVelocityBySel(oSel, "z");

oSel = new SelNodes(scdem);
oSel.box(-100, -0.001, -100, 100, 0.001, 100);
scdem.freeVelocityBySel(oSel, "y");

oSel = new SelNodes(scdem);
oSel.box(-100, 2.99, -100, 100, 3.01, 100);
scdem.freeVelocityBySel(oSel, "y");

oSel = new SelNodes(scdem);
oSel.box(-0.001, -100, -100, 0.001, 100, 100);
scdem.freeVelocityBySel(oSel, "x");

oSel = new SelNodes(scdem);
oSel.box(2.99, -100, -100, 3.01, 100, 100);
scdem.freeVelocityBySel(oSel, "x");

// ========== 6. 定义炸药爆源参数 ==========
var blastPos = [0, 0, 2]; // 炮孔中心位置
var blastDensity = 931;   // 炸药密度 kg/m³
var blastE0 = 4.1e9;      // J/kg
var blastA = 162.7e9;     // J/kg
var blastB = 10.82e9;     // J/kg
var blastR1 = 5.4;        // GPa
var blastR2 = 1.8;        // GPa
var blastOmiga = 0.333;   // s⁻¹

// ========== 7. 配置朗道气体逸散衰减模型 ==========
// 特征时间 tc (s), 特征指数 n, ID范围 [iIDLow, iIDUp]
blkdyn.SetLandauGasLeakMat(5e-4, 1.2, 1, 10);

// ========== 8. 布置传感器监测点 ==========
var sensorPos = [[0, 0, 3], [0, 0, 4], [0, 0, 5]]; // 监测点位置
for (var i = 0; i < sensorPos.length; i++) {
    var pos = sensorPos[i];
    var sel = new SelNodes(scdem);
    sel.point(pos[0], pos[1], pos[2]);
    scdem.addSensor(sel, "disp", "x"); // 位移监测
    scdem.addSensor(sel, "stress", "xx"); // 应力监测
}

// ========== 9. 配置输出请求文件 ==========
scdem.set("isVtk", 1);
scdem.set("specialOutputInterval", 0, 20000, 500);

// ========== 10. 提交仿真任务并监控计算 ==========
scdem.timeStep = 1e-7;
scdem.dynaSolveGpu(0.004);

// ========== 11. 导出结果与可视化分析 ==========
scdem.releaseGpuMem();
print("Simulation completed successfully!");
