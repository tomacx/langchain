setCurDir(getSrcDir());

// ==================== 1. 初始化仿真项目基本设置 ====================
scdem.outputInterval = 500;
scdem.monitorIter = 100;
scdem.set("isLargeDisplace", 1);
scdem.gravity = [0, 0, 0];
scdem.isVirtualMass = 0;
scdem.set("ubr", 1e-4);
scdem.set("RayleighDamp", 1e-7, 0.0);
scdem.set("isVtk", 1);

// ==================== 2. 启用裂隙渗流模块 ====================
scdem.set("Config_FracSeepage", 1);
scdem.set("FracSeepage_Cal", 1);
scdem.set("Seepage_Mode", 2); // 气体流动模式
scdem.set("FS_Solid_Interaction", 1); // 开启流固耦合
scdem.set("FS_MaxWid", 6e-5); // 最大裂隙宽度

// ==================== 3. 导入圆盘几何模型 ====================
var msh = imesh.importGmsh("DiskGeometry.msh");
scdem.getMesh(msh);

// ==================== 4. 设置材料属性 ====================
// 圆盘材料：密度、弹性模量、泊松比、屈服强度等
scdem.setMat([2600, 5.5e10, 0.25, 10e6, 2.5e6, 30.0, 10.0]);

// ==================== 5. 设置气体区域参数 ====================
var pressure = 20e6; // 初始压力 (Pa)
var adiabaticIndex = 1.4; // 绝热指数

// 设置气体本构系数
scdem.set("EoSCof_C", pressure / 2600);

// ==================== 6. 初始化高压气体区域 ====================
// 定义圆盘周围的气体多边形边界（XY平面投影）
var gasPolygon = [
    [-1e5, 0, 0],
    [1e5, 0, 0],
    [1e5, 1e5, 0],
    [1e5, -1e5, 0]
];

// 使用 ShockWave 接口初始化气体区域
skwave.InitByPolygon(pressure, adiabaticIndex, gasPolygon);

// ==================== 7. 设置气体域边界条件 ====================
// 设置四周为透射边界（0=透射，1=固壁）
skwave.SetBound(0, 0, 0, 0); // XY平面四周透射

// ==================== 8. 创建网格并设置流体属性 ====================
SFracsp.createGridFromBlock(1);

// 设置流体物性参数：密度、粘度等
SFracsp.setProp([2600.0, 1e7, 12e-13, 12e-9]);

// 初始化气体压力条件
SFracsp.initConditionByCoord("pp", pressure, 0, 0, 0, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// ==================== 9. 设置圆盘表面气体作用条件 ====================
SFracsp.applyConditionByCylinder("pp", pressure, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0.151);

// ==================== 10. 设置监测点 ====================
// 圆盘中心监测位移和压力
scdem.monitor("fracsp", "sc_disp", 0, 0, 0);
scdem.monitor("fracsp", "sc_pp", 0, 0, 0);

// 圆盘边缘监测点（径向）
for (var i = 1; i <= 20; i++) {
    var r = 0.1 * i;
    scdem.monitor("fracsp", "sc_disp", r, 0, 0);
    scdem.monitor("fracsp", "sc_pp", r, 0, 0);
}

// ==================== 11. 设置求解参数 ====================
scdem.timeStep = 1e-7; // 时步大小

// ==================== 12. 提交仿真任务 ====================
scdem.dynaSolveGpu(8); // GPU加速求解，8个线程

// ==================== 13. 输出结果 ====================
scdem.exportTextData();

print("Simulation completed successfully.");
