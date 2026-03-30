setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// ==================== 1. 初始化仿真环境 ====================
// 关闭力学计算开关（纯渗流分析）
dyna.Set("Mechanic_Cal 0");

// 包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage 1");

// 开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal 1");

// 设置三个方向的重力加速度 (m/s²)
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置结果输出时步间隔
dyna.Set("Output_Interval 500");

// 监测结果输出时步间隔设定为100步
dyna.Set("Monitor_Iter 100");

// 计算时步 (s)
dyna.Set("Time_Step 0.001");

// 瞬态可压缩液体渗流模式
dyna.Set("Seepage_Mode 1");

// 牛顿流体模型 (1-牛顿流体 2-宾汉流模型)
dyna.Set("Liquid_Seepage_Law 1");

// 截止开度，达到该值流体停止进入 (m)
dyna.Set("PS_CirInject_Width 1e-6");

// 设置整体模型的最小孔隙开度 (m)
dyna.Set("Pore_Min_Width 1.4e-4");

// ==================== 2. 创建几何模型 ====================
// 创建圆柱形计算域（模拟岩体）
igeo.GeneratePoint([0, 0, 0]);
igeo.GeneratePoint([5, 0, 0]);
igeo.GeneratePoint([0, 5, 0]);
igeo.GeneratePoint([0, 0, 10]);

// 创建圆柱体几何（模拟钻孔区域）
igeo.CreateCylinder(2.5, 0, 0, 0, 0, 10);

// 创建注浆孔口位置点
igeo.GeneratePoint([2.5, 0, 0]);

// ==================== 3. 设置材料属性 ====================
// 定义X、Y、Z三个方向的渗透系数 (m/s)
var arrayK = new Array(1e-7, 1e-7, 1e-7);

// 指定坐标控制范围内的孔隙渗流参数
// 依次为：流体密度(kg/m³)、体积模量(Pa)、饱和度、孔隙率、渗透系数数组、比奥系数
poresp.SetPropByGroup(1810.0, 1e6, 0.0, 0.01, arrayK, 1.0, 1);

// 单独指定剪切强度 (Pa)
poresp.SetSinglePropByGroup("Strength", 11.75, 1);

// ==================== 4. 设置边界条件 ====================
// 定义梯度（压力梯度）
var fArrayGrad = new Array(0.0, 0.0, 0.0);

// 设置注浆孔口边界条件（注入压力）
poresp.ApplyConditionByCoord("pp", 5e5, fArrayGrad, -2.5, 2.5, -1e5, 1e5, -1e5, 1e5, true);

// 设置模型四周的水压力边界条件（围岩压力）
poresp.ApplyConditionByCoord("pp", 2e5, fArrayGrad, -5, 5, -5, 5, -1e5, 1e5, true);

// ==================== 5. 配置渗流求解器 ====================
// 设置注浆流量控制参数（伺服注浆）
var fQOpti = 20.0 * 1e-3 / 60.0; // 最优注浆流量 (m³/s)
var fQLimt = 30.0 * 1e-3 / 60.0; // 极限注浆流量 (m³/s)

// 设置伺服注浆控制参数
var servoStr = "FS_Servo_PQ 1 1e6 0.001e6 " + fQOpti + " " + fQLimt + " 200";
dyna.Set(servoStr);

// ==================== 6. 执行求解 ====================
// 计算总步数（根据时间步和总时长）
var totalSteps = 50000;

// 执行核心求解器迭代步
dyna.Solve(totalSteps);

// ==================== 7. 设置监测点 ====================
// 绘制监测点位置（在模型视图中用红色圆点表示）
DrawMonitorPos(2.5, 0, 0); // 注浆孔口监测点

// 设置关键监测点（压力监测）
var monitorNode = poresp.GetNodeID(2.5, 0, 0);
Monitor(monitorNode, "Pressure");

// 设置扩散范围监测点
Monitor(monitorNode + 1, "Pressure");
Monitor(monitorNode + 2, "Pressure");

// ==================== 8. 输出监测数据 ====================
// 将当前时步的监测信息输出至Result文件夹下的监测文件
OutputMonitorData();

// 打印提示信息
print("Solution Finished");

// ==================== 9. 生成结果云图与推送 ====================
// 单元属性、材料信息及结果信息的云图展示
Plot(1, "Pressure", "Contour");

// 将当前时步的结果信息推送至Genvi平台上进行展示
PutStep();

// 将模型单元组推送至平台
PutGroup(1);
