setCurDir(getSrcDir());

// ==================== 1. 初始化项目与全局开关 ====================
scdem.outputInterval = 5000;
scdem.monitorIter = 100;
scdem.set("isLargeDisplace", 1);
scdem.gravity = [0, 0, 0];
scdem.isVirtualMass = 0;
scdem.set("ubr", 1e-4);
scdem.set("RayleighDamp", 1e-7, 0.0);
scdem.set("isVtk", 1);

// ==================== 2. 气体模型开关设置 ====================
scdem.set("SK_GasModel", 2); // 全局气体模型开关

// ==================== 3. 裂隙渗流模块参数设置 ====================
scdem.set("Config_FracSeepage", 1);
scdem.set("FracSeepage_Cal", 1);
scdem.set("Seepage_Mode", 2); // 气体流动模式
scdem.set("FS_Solid_Interaction", 1); // 开启流固耦合
scdem.set("FS_MaxWid", 1e-3); // 最大开度
scdem.set("FS_MinWid", 0.0); // 最小开度
scdem.set("FS_Frac_Start_Cal", 1); // 破裂后计算气体压力
scdem.set("GasEos", 2); // 多方方程进行气体流动计算
scdem.set("GasFlowModel", 2); // 湍流流动模型
scdem.set("CSRoughness", 0.001); // 粗糙度

// ==================== 4. 定义流体计算域网格 ====================
// 圆柱体半径 R=0.1m, 高度 H=0.5m, 流体域包围圆柱体
var fluidDomainSize = [0.6, 0.6, 0.6]; // X,Y,Z方向总长度
var fluidGridDiv = [30, 30, 30]; // 网格分割数
var fluidOrigin = [-0.2, -0.2, -0.1]; // 原点坐标

skwave.DefMesh(3, fluidDomainSize, fluidGridDiv, fluidOrigin);

// ==================== 5. 标记固体区域（圆柱体） ====================
// 圆柱体半径 R=0.1m, 高度 H=0.5m，中心在原点
var cylinderRadius = 0.1;
var cylinderHeight = 0.5;
var cylinderXMin = -cylinderRadius;
var cylinderXMax = cylinderRadius;
var cylinderYMin = -cylinderHeight/2;
var cylinderYMax = cylinderHeight/2;

skwave.SetSolid(1, cylinderXMin, cylinderXMax, cylinderYMin, cylinderYMax, -0.25, 0.25);

// ==================== 6. 导入网格并设置模型 ====================
var msh = imesh.importGmsh("Cylinder-5mm.msh");
scdem.getMesh(msh);
scdem.setModel("linear");

// ==================== 7. 设置材料属性 ====================
// 岩石材料参数：[密度, 弹性模量, 泊松比, 屈服强度, 剪切模量, 断裂能, 损伤参数]
scdem.setMat([2700, 60e9, 0.25, 20e6, 8e6, 35, 10]);

// ==================== 8. 设置裂隙渗流属性 ====================
SFracsp.preFlowCrackByCylinder(0.0, 0.0, -cylinderHeight/2, 0.0, 0.0, cylinderHeight/2, 0.0, 3.2e-3);

SFracsp.createGridFromBlock(1);
SFracsp.setProp([0.00, 1e7, 12e-13, 12e-9]);

// ==================== 9. 设置初始气体压力条件 ====================
var initPressure = 20e6; // 初始压力 20MPa
var adiabaticIndex = 1.4; // 绝热指数

scdem.set("EoSCof_C", initPressure / 2700); // C值系数

SFracsp.applyConditionByCylinder("pp", initPressure, 0, 0, 0, 0.0, 0.0, -cylinderHeight/2, 0.0, 0.0, cylinderHeight/2, 0.0, 3.05e-3);

// ==================== 10. 设置用户自定义参数 ====================
scdem.setUDFValue([initPressure, adiabaticIndex]);

// ==================== 11. 配置接触与边界条件 ====================
scdem.setIModel("FracE");
scdem.setContactFractureEnergy(10, 100);
scdem.setIMatByElem(10);

// ==================== 12. 定义监测点/传感器 ====================
var monitorPoints = [
    [0, 0, 0], // 圆柱中心点
    [0.05, 0, 0], // X方向监测点
    [-0.05, 0, 0], // X方向监测点
    [0, 0.05, 0], // Y方向监测点
    [0, -0.05, 0]  // Y方向监测点
];

// ==================== 13. 设置输出文件路径及格式 ====================
scdem.set("OutputDir", "./results");
scdem.set("ResultFormat", "vtk");

// ==================== 14. 提交仿真任务 ====================
scdem.timeStep = 1e-7;
scdem.dynaSolve(0.01);

print("High-pressure gas fracturing simulation completed.");
