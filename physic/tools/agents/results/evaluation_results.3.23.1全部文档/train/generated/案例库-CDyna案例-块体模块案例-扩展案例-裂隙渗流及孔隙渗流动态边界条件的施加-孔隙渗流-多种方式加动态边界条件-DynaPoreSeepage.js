setCurDir(getSrcDir());

// 初始化环境
dyna.Clear();
doc.clearResult();

// ==================== 1. 配置全局渗流计算参数 ====================
// 包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage 1");

// 开启裂隙渗流计算开关
dyna.Set("Config_FracSeepage 1");

// 瞬态可压缩液体渗流模式 (1=瞬态可压缩液体)
dyna.Set("Seepage_Mode 1");

// 牛顿流体模型 (1=牛顿流体)
dyna.Set("Liquid_Seepage_Law 1");

// 开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal 1");

// ==================== 2. 设置物理参数 ====================
// 设置3个方向的重力加速度
dyna.Set("Gravity 0.0 0.0 -9.8");

// 设置结果输出时步
dyna.Set("Output_Interval 500");

// 自动计算时步
dyna.TimeStepCorrect();

// ==================== 3. 导入网格数据 ====================
// 从Gid导入网格文件
blkdyn.ImportGrid("Gid", "pore-seepage.msh");

// ==================== 4. 配置裂隙渗流参数 ====================
// 设置最小孔隙开度 (对应最小孔隙率)
dyna.Set("Pore_Min_Width 1e-6");

// 设置液体能够进入的最小开度
dyna.Set("PS_CirInject_Width 1e-6");

// 设置最大裂隙开度限定范围
dyna.Set("FS_MaxWid 0.01");

// 设置最小裂隙开度限定范围
dyna.Set("FS_MinWid 1e-6");

// ==================== 5. 定义渗流物理属性 ====================
// 定义X、Y、Z三个方向的渗透系数 (m/s)
var arrayK = new Array(1e-8, 1e-8, 1e-8);

// 指定坐标控制范围内的孔隙渗流参数
// 依次为: 流体密度(kg/m³), 体积模量(Pa), 饱和度, 孔隙率, 渗透系数数组, 比奥系数(MPa/s)
poresp.SetPropByCoord(1000.0, 1e6, 0.0, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

// ==================== 6. 设置初始条件 ====================
// 通过坐标和组对特定范围内的单元初始化压力及饱和度
var initPressure = 1e5; // 初始压力 Pa
var initSaturation = 0.0; // 初始饱和度

poresp.InitConditionByCoordAndGroup(initPressure, initSaturation, -500, 500, -500, 500, -500, 500);

// ==================== 7. 施加动态边界条件 ====================
// 定义梯度数组 (法向压力梯度)
var fArrayGrad = [0.0, 0.0, 0.0];

// 定义不同位置的压力值数组
var aValue = new Array();
aValue[0] = [0, 0]; // 中心点
aValue[1] = [50, 1e4]; // 边界1
aValue[2] = [100, 3e4]; // 边界2
aValue[3] = [150, 5e4]; // 边界3
aValue[4] = [200, 4e4]; // 边界4
aValue[5] = [300, 3e4]; // 边界5

// 根据圆柱体位置施加动态压力及流量边界条件
poresp.ApplyDynaConditionByCylinder("pp", aValue, fArrayGrad, 0.5, 0.5, -1, 0.5, 0.5, 1, 0.19, 0.21, true);

// 根据平面法向施加动态边界条件
poresp.ApplyDynaBoundCondition("pp", aValue, fArrayGrad, 0, 0, 1, 0.1);

// ==================== 8. 设置多物理场耦合参数 ====================
// 开启裂隙渗流与固体应力的耦合计算
dyna.Set("FS_Solid_Interaction 1");

// 开启裂隙渗流与孔隙渗流的耦合计算
dyna.Set("FS_PoreS_Interaction 1");

// ==================== 9. 设置监测变量 ====================
// 监测节点压力
dyna.Monitor("block", "fpp", 5, 5, 0);

// 监测流体速度
dyna.Monitor("block", "magfvel", 5, 5, 0);

// 监测流量
dyna.Monitor("block", "discharge", 5, 5, 0);

// ==================== 10. 设置求解参数 ====================
// 设置计算时步
dyna.Set("Time_Step 0.005");

// 设置是否更新孔隙率 (0=不更新，1=更新)
dyna.Set("If_Renew_Porosity 0");

// 设置是否将点源/面源节点饱和度设为1 (0=不设定，1=设定)
dyna.Set("If_Flow_Bound_Sat 0");

// ==================== 11. 求解计算 ====================
// 求解指定步数
dyna.Solve(100000);

// ==================== 12. 获取节点信息 ====================
// 获取关键位置节点的压力和饱和度信息
var nodePressure = fracsp.GetNodeValue("pressure");
var nodeSaturation = fracsp.GetNodeValue("saturation");

// ==================== 13. 计算动态边界 ====================
// 计算渗流动态边界
fracsp.CalDynaBound();

// ==================== 14. 输出结果 ====================
print("Solution Finished");
print("Pore Seepage Simulation Completed Successfully");
