setCurDir(getSrcDir());

// 启用裂隙渗流计算模块
scdem.set("Config_FracSeepage", 1);
scdem.set("FracSeepage_Cal", 1);
scdem.set("Mechanic_Cal", 0);

// 导入裂隙网格模型文件
SFracsp.importGrid("gid", "cross_fracture_grid.msh");

// 设置重力场
scdem.set("gravity", [0.0, -10.0, 0.0]);

// 设置输出时间间隔与监测迭代次数
scdem.outputInterval = 100;
scdem.monitorIter = 100;

// 设置气体流动模式（2为气体）
scdem.set("Seepage_Mode", 2);

// 配置气体状态方程参数：理想气体指数=1，绝热膨胀指数=4/3
scdem.set("FS_Gas_Index", 1.0);
scdem.set("GasEos", 1); // 1为理想气体

// 设置裂隙渗流属性（密度、渗透率、孔隙度等）
SFracsp.setPropByCoord([1.2, 1e7, 12e-13, 12e-9], -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 初始化单元初始压力及饱和度条件
SFracsp.initConditionByCoord("pp", 1e5, 0, 0, 0, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 施加入口压力边界条件（动态压力）
SFracsp.applyConditionByCoord("pp", 30e6, 0, 0, 0, -1e5, 1e5, -0.001, 0.001, -1e5, 1e5);

// 设置裂隙单元位移阈值（失效计算逻辑）
scdem.set("SeepElem_Kill_Disp", 1e-3);

// 设置时间步长
scdem.timeStep = 1e-6;

// 执行GPU加速求解器计算
scdem.solveGpu(10000);

print("finish");
