setCurDir(getSrcDir());

// 关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

// 包含裂隙渗流模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

// 打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

// 设置三个方向的重力加速度
dyna.Set("Gravity 0.0 0.0 0.0");

// 设置结果输出时步
dyna.Set("Output_Interval 500");

// 导入Gmsh格式的裂隙渗流网格数据
fracsp.ImportGrid("Gmsh", "GDEM.msh");

// 设置组号范围内的裂隙单元物理属性：密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
fracsp.SetPropByGroup(1000.0, 1e6, 1e-4, 1e-2, 1, 11);

// 定义三个方向梯度值
var fArrayGrad = [0.0, 0.0, 0.0];

// 模型底部施加1MPa的水压力边界条件（坐标范围：x:43.3-43.5, y:93-93.2, z:38.3-38.5）
fracsp.ApplyConditionByCoord("pp", 1e6, fArrayGrad, 43.3, 43.5, 93, 93.2, 38.3, 38.5);

// 连接裂隙单元，建立管道传输流量
fracsp.ElemConnection();

// 设置渗流场监测：速度、压力、流量
dyna.Monitor("fracsp", "sc_magvel", 5, 5, 0);
dyna.Monitor("fracsp", "sc_pp", 5, 5, 0);
dyna.Monitor("fracsp", "sc_discharge", 5, 5, 0);

// 自动计算时步
dyna.TimeStepCorrect();

// 设置计算时步
dyna.Set("Time_Step 0.01");

// 求解10万步
dyna.Solve(100000);

// 打印提示信息
print("Solution Finished");
