setCurDir(getSrcDir());

// 关闭力学计算开关
dyna.Set("Mechanic_Cal", 0);

// 包含裂隙渗流计算模块，开辟相应内存
dyna.Set("Config_FracSeepage", 1);

// 打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal", 1);

// 设置重力加速度为零
dyna.Set("Gravity", 0.0, 0.0, 0.0);

// 设置结果输出时步
dyna.Set("Output_Interval", 500);

fracsp.ImportGrid("Gmsh", "GDEM.msh");

// 设置裂隙渗流参数，依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
fracsp.SetPropByGroup(1000.0, 1e6, 1e-4, 1e-2, 1, 11);

// 模型底部施加1MPa的水压力
var fArrayGrad = [0.0, 0.0, 0.0];
fracsp.ApplyConditionByCoord("pp", 1e6, fArrayGrad, 43.3, 43.5, 93, 93.2, 38.3, 38.5);

// 定义动态条件
var aValue = new Array();
aValue[0] = [0, 0];
aValue[1] = [50, 1e4];
aValue[2] = [100, 3e4];
aValue[3] = [150, 5e4];
aValue[4] = [200, 4e4];
aValue[5] = [300, 3e4];

//fracsp.ApplyDynaConditionByCoord("pp", aValue, fArrayGrad, 43.3, 43.5, 93, 93.2, 38.3, 38.5);

// 设置监测点
dyna.Monitor("fracsp", "sc_magvel", 5, 5, 0);
dyna.Monitor("fracsp", "sc_pp", 5, 5, 0);
dyna.Monitor("fracsp", "sc_discharge", 5, 5, 0);

// 自动计算时步
dyna.TimeStepCorrect();

// 设置时间步长为0.01秒
dyna.Set("Time_Step", 0.01);

// 求解10万步
dyna.Solve(100000);

print("Solution Finished");
