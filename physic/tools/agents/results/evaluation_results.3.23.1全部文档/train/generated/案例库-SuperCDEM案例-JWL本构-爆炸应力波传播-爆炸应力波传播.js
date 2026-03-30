setCurDir(getSrcDir());

// 初始化仿真环境
scdem.outputInterval = 100;
scdem.monitorIter = 10;
scdem.set("isLargeDisplace", 0);
scdem.gravity = [0, 0, 0];
scdem.isVirtualMass = 0;
scdem.set("ubr", 1e-4);
scdem.set("RayleighDamp", 1e-7, 0);

// 导入网格模型（流体域+固体边界）
var msh = imesh.importGmsh("blast_simulation.msh");
scdem.getMesh(msh);

// 设置单元模型为线弹性
scdem.setModel("linear");

// 设置炸药单元模型为JWL本构
scdem.setModel(1, "JWL");

// 设置固体材料参数（密度、杨氏模量、泊松比、屈服强度等）
scdem.setMat([2700, 60e9, 0.25, 20e6, 8e6, 35, 10]);

// 设置空气材料参数（密度、声速等）
scdem.setMat(2, [1.225, 1.42e5, 1.4, 0, 0, 1.4, 10]);

// 设置JWL爆源参数（TNT炸药）
// 参数：序号,密度,E0,A,B,R1,R2,Omega,Pcj,D,点火时间,加载时长,起爆点位置
var pos = [0.5, 0.5, 0.0];
scdem.setJWLBlastSource(1, 1630, 7.0e9, 371.2e9, 3.2e9, 4.2, 0.95, 0.3, 20e9, 6930, 0.0, 15e-3, pos);

// 绑定爆源到炸药单元
scdem.bindJWLBlastSource(1, 1, 1);

// 设置接触参数（炸药与固体界面）
scdem.setIMatByElem(10);
scdem.setIMat(1e14, 1e14, 0, 0, 0, 1, 2);

// 设置无反射边界条件（上下左右四个方向）
var oSel = new SelElemFaces(scdem);
oSel.box(-100, 0.5999, -100, 100, 0.6001, 100);
scdem.applyNonReflectionBySel(oSel);

oSel = new SelElemFaces(scdem);
oSel.box(-100, -0.4001, -100, 100, -0.3999, 100);
scdem.applyNonReflectionBySel(oSel);

oSel = new SelElemFaces(scdem);
oSel.box(-0.4001, -100, -100, 0.4001, 100, 100);
scdem.applyNonReflectionBySel(oSel);

oSel = new SelElemFaces(scdem);
oSel.box(0.5999, -100, -100, 100, 0.6001, 100);
scdem.applyNonReflectionBySel(oSel);

// 设置监测点（压力、流速、温度）
var monitorPos = [
    [1.0, 1.0, 0.0],
    [2.0, 1.0, 0.0],
    [3.0, 1.0, 0.0],
    [1.0, 2.0, 0.0],
    [2.0, 2.0, 0.0]
];

for (var i = 0; i < monitorPos.length; i++) {
    var p = monitorPos[i];
    oSel = new SelNodes(scdem);
    oSel.box(p[0], p[1]-0.01, p[0], p[1]+0.01, -1e10, 1e10);
    scdem.regionMonitor("node", "pressure", i+1, oSel);
    scdem.regionMonitor("node", "velocity", i+1, oSel);
    scdem.regionMonitor("node", "temperature", i+1, oSel);
}

// 设置计算时间步长（匹配爆速与冲击波传播速度）
scdem.timeStep = 1e-7;

// 启用多核CPU并行加速
scdem.set("isParallel", 1);
scdem.parallelCores = 8;

// 求解计算
var totalTime = 0.2; // 总计算时间200ms
scdem.solve(totalTime);

// 释放GPU内存（如有使用）
scdem.releaseGpuMem();

// 打印提示信息
print("Explosion Simulation Finished");
