setCurDir(getSrcDir());

// 初始化环境 - 清除旧数据
dyna.Clear();
igeo.clear();
imeshing.clear();
doc.clearResult();

// ==================== 1. 几何模型创建 ====================
// 创建矩形区域用于瓦斯吸出模拟
igeo.genRectS(0, 0, 0, 20, 20, 0, 5);

// 根据封闭线段自动生成表面（渗流边界）
igeo.genSurfAuto(15);

// ==================== 2. 网格划分 ====================
// 创建二维矩形网格用于渗流计算
blkdyn.GenBrick2D(20.0, 20.0, 40, 40, 1);

// 导入网格到裂隙渗流求解器
fracsp.GetMesh(imeshing);

// ==================== 3. 材料属性设置 ====================
// 设置岩石力学参数（密度、弹性模量、泊松比等）
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 35, 15);

// 设置裂隙渗流材料属性：密度、体积模量、渗透系数、初始裂隙宽度、摩擦下限、摩擦上限
fracsp.SetPropByGroup(1.293, 1e7, 7e-9, 1e-6, 1, 11);

// ==================== 4. 渗流模块配置 ====================
// 包含孔隙渗流计算功能，开辟渗流相关内存
dyna.Set("Config_PoreSeepage 1");

// 开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal 1");

// 设置渗流模式：2-瞬态可压缩气体渗流（瓦斯吸出）
dyna.Set("Seepage_Mode 2");

// 打开Langmuir吸附解吸附计算开关
dyna.Set("If_Langmuir_Cal 1");

// 包含裂隙计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

// 打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

// 设置3个方向的重力加速度（瓦斯吸出通常考虑重力）
dyna.Set("Gravity 0.0 -9.8 0.0");

// ==================== 5. 初始条件设置 ====================
// 初始化孔隙气体压力，为10MPa（典型瓦斯储层压力）
poresp.InitConditionByCoord("pp", 1e7, [0.0, 0.0, 0.0], -100, 100, -100, 100, -100, 100, false);

// 设置Langmuir吸附解吸附参数：最大吸附量、吸附常数、固体密度、瓦斯滑脱效应克林博格系数
poresp.SetLangmuirPropByGroup(37.255e-3, 0.432e-6, 1500, 0.0, 1, 2);

// ==================== 6. 边界条件设置 ====================
// 设定模型四周的瓦斯压力边界条件（抽采压力）
poresp.ApplyConditionByCoord("pp", 3e6, [0.0, 0.0, 0.0], -100, 100, -100, 100, false);

// ==================== 7. 监测点设置 ====================
// 对典型位置的孔隙压力进行监测（X方向不同位置）
dyna.Monitor("block", "fpp", 5, 5, 0);
dyna.Monitor("block", "fpp", 10, 5, 0);
dyna.Monitor("block", "fpp", 15, 5, 0);

// 绘制监测点位置以验证坐标映射准确性
DrawMonitorPos();

// ==================== 8. 求解器设置 ====================
// 将结果输出时步设定为500步
dyna.Set("Output_Interval 500");

// 监测结果输出时步间隔设定为100步
dyna.Set("Moniter_Iter 100");

// 设定计算时步（总时间）
dyna.Set("Time_Step 100");

// 迭代次数
dyna.Set("Iter_Count 5000");

// ==================== 9. 执行求解 ====================
// 开启力学计算开关（如需耦合）
dyna.Set("Mechanic_Cal 1");

// 开启大变形计算
dyna.Set("Large_Displace 1");

// 如果启用接触检测
dyna.Set("If_Renew_Contact 1");

// 执行求解
dyna.Solve(5000);

// ==================== 10. 输出结果 ====================
// 打印提示信息
print("Solution Finished");

// 将当前时步的结果信息推送至Genvi平台进行展示
PutStep();

// 将当前时步的结果信息在Result文件夹下存储为其他软件可导入的格式
OutputModelResult();

// 将当前时步的监测信息输出至Result文件夹下的监测文件中
OutputMonitorData();
