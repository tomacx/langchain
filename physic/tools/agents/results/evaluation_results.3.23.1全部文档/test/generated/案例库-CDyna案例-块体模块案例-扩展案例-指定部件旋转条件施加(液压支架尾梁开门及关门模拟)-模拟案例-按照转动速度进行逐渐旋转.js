setCurDir(getSrcDir());

// ==================== 初始化设置 ====================
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 关闭力学计算开关（如需纯渗流分析）
// dyna.Set("Mechanic_Cal 0");

// 包含孔隙渗流计算功能
dyna.Set("Config_PoreSeepage 1");
dyna.Set("PoreSeepage_Cal 1");

// 设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

// 结果输出时步间隔
dyna.Set("Output_Interval 500");

// 监测结果输出时步间隔
dyna.Set("Moniter_Iter 100");

// 计算时步
dyna.Set("Time_Step 0.001");

// ==================== 创建几何模型 ====================
// 掩护梁（固定部分）- 矩形块体
blkdyn.GenBrick2D(1, 0.5, 3.0, 1, 1);

// 尾梁（旋转部分）- 矩形块体
blkdyn.GenBrick2D(2, 0.8, 4.0, 1, 1);

// 设置尾梁为可移动部件
blkdyn.SetModelByCoord("movable", 2, 6, 4, 6, -1, 1);

// ==================== 材料参数设置 ====================
// 定义掩护梁材料属性（密度、弹性模量、泊松比）
var matShield = new Array(2700.0, 3e9, 0.25);
blkdyn.SetMatByGroup(matShield, 1, 1);

// 定义尾梁材料属性
var matTailgate = new Array(2700.0, 3e9, 0.25);
blkdyn.SetMatByGroup(matTailgate, 2, 1);

// ==================== 孔隙渗流参数设置 ====================
// 定义X、Y、Z三个方向的渗透系数（单位：m/s）
var arrayK = new Array(1e-8, 1e-8, 1e-8);

// 指定坐标控制范围内的孔隙渗流参数
// 依次为：流体密度(kg/m³)、体积模量(Pa)、饱和度、孔隙率、渗透系数(m/s)、比奥系数
poresp.SetPropByCoord(1000.0, 1e6, 0.0, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

// ==================== 初始化孔隙压力场 ====================
// 初始化尾梁区域的初始孔隙压力（例如：0 Pa）
var fArrayGrad = new Array(0.0, 0.0, 0.0);
poresp.InitConditionByCoord("pp", 0.0, fArrayGrad, -100, 100, -100, 100, -100, 100, false);

// ==================== 设置旋转轴与动态边界条件 ====================
// 定义旋转中心点（掩护梁与尾梁连接处）
var pivotX = 2.5;
var pivotY = 0.0;
var pivotZ = 0.0;

// 创建时间相关的角速度曲线数据
// 开门过程：0-10s 加速，10-30s 匀速，30-40s 减速关闭
var timeCurve = new Array();
timeCurve[0] = [0.0, 0.0];      // t=0, ω=0
timeCurve[1] = [5.0, 0.5];      // t=5, ω=0.5 rad/s (加速)
timeCurve[2] = [10.0, 1.0];     // t=10, ω=1.0 rad/s (达到最大速度)
timeCurve[3] = [20.0, 1.0];     // t=20, ω=1.0 rad/s (匀速)
timeCurve[4] = [30.0, 0.5];     // t=30, ω=0.5 rad/s (减速)
timeCurve[5] = [40.0, 0.0];     // t=40, ω=0.0 rad/s (停止)

// 应用动态边界条件控制旋转速度
// 使用ApplyDynaBoundCondition根据单位法矢量施加动态边界
var normalVector = new Array(0.0, 1.0, 0.0); // Y方向为旋转轴
dyna.ApplyDynaBoundCondition("tailgate", normalVector, timeCurve);

// ==================== 接触界面设置 ====================
// 设置掩护梁与尾梁之间的接触关系
blkdyn.SetContactByGroupInterface(1, 2, "hard");

// 设置接触面强度参数（可选）
blkdyn.SetIStiffByElem(1e8, 1);

// ==================== 输出请求设置 ====================
// 监测尾梁关键节点的位移
dyna.Monitor("block", "displacement", 2, 5, 0);
dyna.Monitor("block", "displacement", 3, 5, 0);

// 监测尾梁转角（通过节点坐标计算）
dyna.Monitor("block", "rotation", 2, 5, 0);

// 监测应力状态
dyna.Monitor("block", "stress", 2, 5, 0);

// 监测孔隙压力
dyna.Monitor("block", "fpp", 2, 5, 0);

// ==================== 求解设置 ====================
// 自动计算时步（可选）
// dyna.TimeStepCorrect();

// 设置总计算时间（40秒）
dyna.Set("Total_Time 40.0");

// 执行核心求解器迭代
dyna.Solve(100000);

// ==================== 用户自定义命令流 ====================
// 运行UDF命令进行后处理或自定义逻辑
// dyna.RunUDFCmd("PostProcess tailgate_rotation.txt");

// ==================== 完成提示 ====================
print("Hydraulic Support Tailgate Rotation Simulation Finished");
