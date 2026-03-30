setCurDir(getSrcDir());

// 初始化环境
dyna.Clear();
igeo.clear();
imeshing.clear();
doc.clearResult();

// 创建二维矩形网格作为岩石基质
blkdyn.GenBrick2D(10.0, 10.0, 50, 50, 1);

// 导入网格（使用Gmsh格式）
imeshing.genMeshByGmsh(2);

// 关闭力学计算开关（仅进行渗流分析）
dyna.Set("Mechanic_Cal 0");

// 包含裂隙计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

// 打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

// 设置3个方向的重力加速度
dyna.Set("Gravity 0.0 0.0 0.0");

// 设置结果输出时步
dyna.Set("Output_Interval 500");

// 监测结果输出时步间隔设定为100步
dyna.Set("Moniter_Iter 100");

// 创建裂隙网格
fracsp.CreateGridFromBlock(2);

// 设置裂隙渗流参数：密度、体积模量、渗透系数、初始开度、组号下限及组号上限
// 对于液体渗流模式，体积模量起作用
fracsp.SetPropByGroup(1000.0, 1e6, 1e-9, 1e-4, 1, 11);

// 初始化压力（例如：初始压力为5MPa）
fracsp.InitConditionByCoord("pp", 5e6, [0.0, 0.0, 0.0], -10.0, 10.0, -10.0, 10.0, -10.0, 10.0);

// 定义边界条件：在模型底部施加压力
var fArrayGrad = [0.0, 0.0, 0.0];
fracsp.ApplyConditionByCoord("pp", 1e6, fArrayGrad, -5.0, 5.0, -5.0, 5.0, -10.0, 10.0);

// 定义泵注孔ID为2，圆柱体范围
fracsp.BindJetBoreHolePropByCylinder(2, 0, 0, 0, 10, 0, 0, 0.5, 0.6);

// 设置监测点位置（在模型中心区域）
dyna.Monitor("fracsp", "sc_pp", 5, 5, 0);
dyna.Monitor("fracsp", "sc_discharge", 5, 5, 0);

// 绘制监测点位置（红色圆点标记）
DrawMonitorPos();

// 自动计算时步
dyna.TimeStepCorrect();

// 设定计算时步为100s
dyna.Set("Time_Step 100");

// 迭代求解
dyna.Solve(10000);

// 打印提示信息
print("Solution Finished");

// 输出监测信息至Result文件夹
OutputMonitorData();

// 存储当前时步结果为其他软件可导入格式
OutputModelResult();

// 将当前时步结果推送至Genvi平台进行展示
PutStep();
