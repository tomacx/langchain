setCurDir(getSrcDir());

// 初始化环境
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// ==================== 1. 杆件模块配置 ====================
// 允许计算杆件（启用块体模块功能）
dyna.Set("If_Cal_Bar 1");

// 设置杆件与流体颗粒的耦合方式为插值耦合
dyna.Set("Bar_Couple_Type 1");

// 包含裂隙计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

// 打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

// 设置3个方向的重力加速度（理论解对比通常设为0）
dyna.Set("Gravity 0.0 0.0 0.0");

// 设置结果输出时步
dyna.Set("Output_Interval 500");

// 宾汉流流体定律类型
dyna.Set("Liquid_Seepage_Law 2");

// 渗流模式
dyna.Set("Seepage_Mode 1");

// 监测迭代次数
dyna.Set("Monitor_Iter 100");

// ==================== 2. afPara参数配置（宾汉流体力学属性）==================
afPara[0] = 3.13e9;   // 表观剪切模量 (Pa)
afPara[1] = 25.91e9;  // Beta_s1 (Pa)，实体体模量
afPara[2] = 32.65e9;  // Beta_s2 (Pa)
afPara[3] = 8.05e9;   // Beta_s3 (Pa)
afPara[4] = 3.61e9;   // Beta_f1 (Pa)，水体模量
afPara[5] = 7.80e9;   // Beta_f2 (Pa)
afPara[6] = 7.83e9;   // Beta_f3 (Pa)
afPara[7] = 0.307;    // 材料泊松比
afPara[8] = 0.0;      // 初始孔隙率
afPara[9] = 0.34;     // 水初始体积分数
afPara[10] = 1.0;     // 比奥系数
afPara[11] = 0.0;     // 用于计算孔隙率、体积变形耗散率与偏应变耗散率的比值
afPara[12] = -0.20289;// faf，与初始体积分数有关的拟合系数
afPara[13] = 0.14657; // ftf
afPara[14] = 0.711e9; // faq，拟合初始屈服面的拟合系数
afPara[15] = 0.56e-9; // fbq
afPara[16] = 0.685e9; // fcq
afPara[17] = 1.92e9;  // fap，拟合破坏面的拟合系数
afPara[18] = 0.335e-9;// fbp
afPara[19] = 1.89e9;  // fcp
afPara[20] = 2300.0;  // fk，应变硬化系数

// ==================== 3. 网格导入与属性设置 ====================
// 导入杆件-宾汉流测试网格（ansys格式）
fracsp.ImportGrid("ansys", "feng-bar.dat");

// 设置流体宽度与粘度参数
var fwidth = 1e-3;
var fvisc = 1e-2;

// 设置组属性：密度、弹性模量、屈服应力、网格尺寸等
fracsp.SetPropByGroup(1000.0, 1e3, fwidth * fwidth / 12.0 / fvisc, fwidth, 1, 1);

// 设置强度参数（宾汉流体屈服应力）
fracsp.SetSinglePropByGroup("Strength", 1.0, 1, 11);

// ==================== 4. 边界条件与载荷施加 ====================
// 施加理论解对比所需的压力梯度条件
var grad = new Array(0, 0, 0);
fracsp.ApplyConditionByCoord("pp", 1e4, grad, -0.01, 0.01, -100, 100, -100, 100);

// ==================== 5. 监测点设置 ====================
// 绘制监测点位置（红色圆点）
draw.setColor(255, 0, 0);
draw.circle3d(0, 0, 0, 0.01);
draw.commit();

// ==================== 6. 接触检测与接触力计算 ====================
// 执行颗粒与块体间的接触检测
pdyna.DetectPBContact();

// 计算颗粒与块体间的接触力
pdyna.CalPBContact();

// ==================== 7. 时间步设置 ====================
dyna.Set("Time_Step 2");

// ==================== 8. 求解器启动 ====================
// 执行显式动力学求解
dyna.DynaCycle(1e5);

// ==================== 9. 结果输出与监测 ====================
// 将当前时步的监测信息输出至Result文件夹下的监测文件
OutputMonitorData();

// 将当前时步的结果信息存储为其他软件可导入的格式
OutputModelResult();

// 打印提示信息
print("Solution Finished");
