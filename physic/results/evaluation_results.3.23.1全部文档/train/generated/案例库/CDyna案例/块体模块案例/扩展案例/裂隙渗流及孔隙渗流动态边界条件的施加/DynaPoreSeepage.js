// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 关闭力学计算开关
dyna.Set("Mechanic_Cal", 0);

// 包含裂隙计算模块，开辟相应内存
dyna.Set("Config_FracSeepage", 1);

// 打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal", 1);

// 设置3个方向的重力加速度
dyna.Set("Gravity", 0.0, 0.0, -9.8);

// 设置结果输出时步
dyna.Set("Output_Interval", 500);

// 创建点和面几何模型
var pid = igeo.genPoint(5, 5, 0, 0.2);
var sid = igeo.genRectS(0, 0, 0, 10, 10, 0, 0.5, 1);

// 设置硬点到面
igeo.setHardPointToFace(pid, sid);

// 使用Gmsh进行网格划分
imeshing.genMeshByGmsh(2);

// 导入网格文件
fracsp.ImportGrid("Gmsh", "GDEM.msh");

// 设置裂隙渗流参数，依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
fracsp.SetPropByGroup(1000.0, 1e6, 1e-6, 1e-3, 1, 11);

// 定义动态边界条件数组
var aValue = new Array();
aValue[0] = [0, 0];
aValue[1] = [50, 1e4];
aValue[2] = [100, 3e4];
aValue[3] = [150, 5e4];
aValue[4] = [200, 4e4];
aValue[5] = [300, 3e4];

// 施加动态边界条件
fracsp.ApplyDynaConditionByCoord("pp", aValue, [0.0, 0.0, 0.0], 4.99, 5.01, 4.99, 5.01, -1, 1);

// 设置监控点
dyna.Monitor("fracsp", "sc_magvel", 5, 5, 0);
dyna.Monitor("fracsp", "sc_pp", 5, 5, 0);
dyna.Monitor("fracsp", "sc_discharge", 5, 5, 0);

// 自动计算时步
dyna.TimeStepCorrect();

// 设置时间步长
dyna.Set("Time_Step", 1e3);

// 求解指定步数
dyna.Solve(5000);

// 打印提示信息
print("Solution Finished");
