setCurDir(getSrcDir());

// 初始化仿真环境
dyna.Set("Mechanic_Cal 0");
dyna.Set("Config_PoreSeepage 1");
dyna.Set("PoreSeepage_Cal 1");
dyna.Set("Seepage_Mode 1");
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置输出和监测参数
dyna.Set("Output_Interval 500");
dyna.Set("Moniter_Iter 100");
dyna.Set("Time_Step 0.01");

// 创建二维矩形网格（Mandel-Cryer问题典型尺寸）
blkdyn.GenBrick2D(1.0, 1.0, 50, 50, 1);

// 定义X、Y、Z三个方向的渗透系数 (m/s)
var arrayK = new Array(1e-9, 1e-9, 1e-9);

// Mandel-Cryer问题典型材料参数
var rho_w = 1000.0;           // 流体密度 kg/m^3
var K_w = 2.2e9;              // 水的体积模量 Pa
var n = 0.3;                  // 孔隙率
var E = 1e7;                  // 弹性模量 Pa
var mu = 0.25;                // 泊松比
var alpha = 1.0;              // 比奥系数

// 指定坐标控制范围内的孔隙渗流参数
poresp.SetPropByCoord(rho_w, K_w, 1.0, n, arrayK, alpha, -500, 500, -500, 500, -500, 500);

// 初始化孔隙压力条件（初始超孔隙水压力）
var fArrayGrad = new Array(0.0, 0.0, 0.0);
poresp.InitConditionByCoord("pp", 1e5, fArrayGrad, -0.5, 0.5, -0.5, 0.5, -0.5, 0.5, false);

// 设置边界条件：顶部排水（压力为大气压）
poresp.ApplyConditionByCoord("pp", 0.0, fArrayGrad, -0.5, 0.5, -0.5, 0.5, 0.49, 0.51, true);

// 设置底部排水边界条件
poresp.ApplyConditionByCoord("pp", 0.0, fArrayGrad, -0.5, 0.5, -0.5, 0.5, -0.51, -0.49, true);

// 设置左右侧面排水边界条件
poresp.ApplyConditionByCoord("pp", 0.0, fArrayGrad, -0.51, -0.49, -0.5, 0.5, -0.5, 0.5, true);

// 设置监测点记录孔隙压力演化
dyna.Monitor("block", "fpp", 25, 25, 0);
dyna.Monitor("block", "fpp", 10, 10, 0);
dyna.Monitor("block", "fpp", 40, 40, 0);

// 设置求解步数（根据Mandel-Cryer问题收敛时间）
var totalSteps = 5000;

// 执行核心求解器
dyna.Solve(totalSteps);

// 获取监测节点最终孔隙压力值
var node25 = blkdyn.GetNodeID(0.5, 0.5, 0.5);
var p_final = poresp.GetNodeValue(node25, "pp");

print("Mandel-Cryer Simulation Finished");
print("Final pore pressure at monitoring point: ", p_final);
