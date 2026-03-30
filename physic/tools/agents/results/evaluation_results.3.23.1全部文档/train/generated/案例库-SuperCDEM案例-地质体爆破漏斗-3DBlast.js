setCurDir(getSrcDir());

// ========== 1. 初始化仿真环境 ==========
scdem.outputInterval = 1000;      // 输出间隔（步数）
scdem.monitorIter = 100;          // 监控迭代次数
scdem.isVirtualMass = 0;          // 不使用虚质量算法
scdem.set("isLargeDisplace", 1);  // 启用大变形分析
scdem.set("RayleighDamp", 5e-7, 0); // 瑞利阻尼系数

// ========== 2. 导入/生成三维网格模型 ==========
var msh = imesh.importGmsh("3DBlast-20w.msh");
scdem.getMesh(msh);

// 备选方案：如没有外部网格文件，可使用 genBrick3D 生成基础网格
// imeshing.genBrick3D("rock", 10.0, 10.0, 10.0, 20, 20, 20);

// ========== 3. 设置模型与材料参数 ==========
scdem.setModel("linear");         // 线性模型

// 岩石材料参数：[密度, 弹性模量, 泊松比, 屈服应力1, 屈服应力2, 内摩擦角, 粘聚力]
scdem.setMat([2700, 60e9, 0.25, 30e6, 15e6, 35, 10]);

// 设置界面模型为裂隙扩展类型
scdem.setIModel("FracE");
scdem.setIMatByElem(10);          // 指定单元ID范围使用裂隙材料
scdem.setContactFractureEnergy(50, 100); // 接触断裂能参数

// ========== 4. 设置朗道爆源与气体逸散参数 ==========
var blastPos = [2.5, 2.5, 2.0];   // 炮孔中心位置

// 设置朗道爆源（炸药节点）
scdem.setLandauBlastSource(1, 1100, 4.1e9, 162.7e9, 10.82e9, 5.4, 1.8,
                           3.907, 1.118, 0.333, 5.15e9, 4160, 0.0, 1e-2, blastPos);

// 设置爆生气体逸散参数：[特征时间, 特征指数, 爆源ID下限, 爆源ID上限]
// 公式: p_r = p * exp(-(t/t_c)^n)
blkdyn.SetLandauGasLeakMat(5e-4, 1.2, 1, 10);

// ========== 5. 设置边界条件（自由场/粘性边界） ==========
var oSel = new SelElemFaces(scdem);

// 底部无反射边界
oSel.box(-100, -100, -0.001, 100, 100, 0.001);
scdem.applyNonReflectionBySel(oSel);

// 四周无反射边界
oSel.box(-100, -0.001, -100, 100, 0.001, 100);
scdem.applyNonReflectionBySel(oSel);

oSel.box(-100, 2.99, -100, 100, 3.01, 100);
scdem.applyNonReflectionBySel(oSel);

oSel.box(-0.001, -100, -100, 0.001, 100, 100);
scdem.applyNonReflectionBySel(oSel);

oSel.box(2.99, -100, -100, 3.01, 100, 100);
scdem.applyNonReflectionBySel(oSel);

// ========== 6. 设置重力场（可选） ==========
scdem.gravity = [0, 0, -9.8];    // 标准重力加速度

// ========== 7. 布置监测传感器节点 ==========
var sensorPos = [[1.5, 1.5, 2.5], [3.0, 2.0, 2.0], [2.0, 3.0, 2.5]]; // 监测点坐标

// 创建监测点（可根据需要扩展）
for (var i = 0; i < sensorPos.length; i++) {
    var pos = sensorPos[i];
    scdem.addSensor(pos[0], pos[1], pos[2], "stress", "velocity", "displacement");
}

// ========== 8. 设置起爆时序控制 ==========
scdem.set("BlastSequence", 1);    // 启用顺序起爆模式
scdem.set("BlastDelayTime", 0.001); // 相邻炮孔起爆时间间隔（秒）

// ========== 9. 求解器设置与运行 ==========
scdem.timeStep = 1e-7;            // 时步长（秒）
scdem.dynaSolveGpu(0.004);        // GPU求解，总时长0.004秒

// ========== 10. 后处理输出设置 ==========
scdem.set("isVtk", 1);            // 启用 VTK 可视化输出
scdem.set("specialOutputInterval", 0, 20000, 500); // 特殊输出间隔

// ========== 11. 释放资源与完成标记 ==========
scdem.releaseGpuMem();
print("爆破漏斗仿真计算完成！");
