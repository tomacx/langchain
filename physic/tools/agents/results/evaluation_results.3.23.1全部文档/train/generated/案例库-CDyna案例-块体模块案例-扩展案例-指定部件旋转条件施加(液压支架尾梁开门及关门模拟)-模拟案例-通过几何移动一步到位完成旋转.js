setCurDir(getSrcDir());

// 加载CustomModel动态链接库
dyna.LoadUDF("CustomModel");

// 初始化工作区
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 关闭力学计算开关（如需纯渗流分析）
dyna.Set("Mechanic_Cal 0");

// 包含孔隙渗流计算功能
dyna.Set("Config_PoreSeepage 1");

// 开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal 1");

// 设置重力加速度（液压支架模拟）
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置结果输出时步间隔
dyna.Set("Output_Interval 500");

// 监测结果输出时步间隔
dyna.Set("Moniter_Iter 100");

// 计算时步（液压支架运动较慢）
dyna.Set("Time_Step 0.01");

// 设置渗流模式（瞬态可压缩液体）
dyna.Set("Seepage_Mode 1");

// 创建液压支架尾梁几何模型（简化为矩形区域）
blkdyn.GenBrick2D(5.0, 3.0, 20, 10, 1);

// 定义材料参数数组
var matParams = new Array(7800.0, 2.1e11, 0.3, 1.0e9, 1.0e-5, 1.0);

// 设置基础材料参数（密度、弹性模量、泊松比等）
pdyna.SetMat(matParams, 1);

// 配置液压支架模型全局材料参数
SetIHydroSupportMat(1, matParams[0], matParams[1], matParams[2], 1.0e-5, 1.0);

// 定义几何组：尾梁铰链区域和移动部件
blkdyn.SetGroupByCoord("hinge_group", -0.5, 0.5, -0.5, 0.5, 0.0, 0.0);
blkdyn.SetGroupByCoord("moving_part", 1.0, 4.0, 0.0, 3.0, 0.0, 0.0);

// 将材料参数绑定到接触面（铰链区域）
BindIHydroSupportMatByGroupInterface(1, "hinge_group");

// 初始化孔隙压力场（初始压力为0）
var fArrayGrad = new Array(0.0, 0.0, 0.0);
InitConditionByCoord("pp", 0.0, fArrayGrad, -5.0, 5.0, -3.0, 3.0, -1.0, 1.0, false);

// 设置边界条件：尾梁铰链固定，移动部件施加旋转位移
ApplyDynaBoundCondition("hinge_group", "fixed", 0.0, 0.0, 0.0);
ApplyDynaBoundCondition("moving_part", "displacement", 0.0, 1.5, 0.0);

// 设置监测点：跟踪尾梁旋转角度和位移
dyna.Monitor("block", "fpp", 1, 5, 0);
dyna.Monitor("block", "fpp", 2, 5, 0);
dyna.Monitor("block", "disp", 1, 5, 0);

// 配置求解器参数
dyna.Set("Solver_Type 1");
dyna.Set("Max_Iteration 1000");
dyna.Set("Convergence_Tol 1e-6");

// 执行计算（模拟开门及关门过程）
dyna.Solve(5000);

// 打印提示信息
print("Hydraulic Support Tailgate Rotation Simulation Finished");

// 释放动态链接库
dyna.FreeUDF();
