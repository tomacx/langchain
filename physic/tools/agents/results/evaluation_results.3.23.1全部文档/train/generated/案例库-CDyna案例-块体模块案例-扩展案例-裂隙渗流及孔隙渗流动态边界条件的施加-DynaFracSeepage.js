setCurDir(getSrcDir());

// 初始化仿真环境
dyna.Clear();
doc.clearResult();

// 关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

// 包含裂隙渗流计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

// 打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

// 包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage 1");

// 开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal 1");

// 设置3个方向的重力加速度
dyna.Set("Gravity 0.0 0.0 -9.8");

// 设置结果输出时步
dyna.Set("Output_Interval 500");

// 导入网格模型
blkdyn.ImportGrid("Gmsh", "DynaFracSeepage.msh");

// 定义X、Y、Z三个方向的渗透系数（孔隙渗流）
var arrayK = new Array(1e-8, 1e-8, 1e-8);

// 指定坐标控制范围内的孔隙渗流参数
// 依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByCoord(1000.0, 1e6, 0.0, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

// 定义裂隙渗流参数，依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
fracsp.SetPropByGroup(1000.0, 1e6, 1e-6, 1e-3, 1, 11);

// 定义动态边界条件坐标数组
var fArrayGrad = [0.0, 0.0, 0.0];
var aValue = new Array();
aValue[0] = [0, 0];
aValue[1] = [50, 1e4];
aValue[2] = [100, 3e4];
aValue[3] = [150, 5e4];
aValue[4] = [200, 4e4];
aValue[5] = [300, 3e4];

// 根据坐标施加裂隙渗流动态边界条件（压力）
fracsp.ApplyDynaConditionByCoord("pp", aValue, fArrayGrad, 4.99, 5.01, 4.99, 5.01, -1, 1);

// 根据坐标施加孔隙渗流动态边界条件（压力）
poresp.ApplyDynaConditionByCoord("pp", aValue, fArrayGrad, 4.99, 5.01, 4.99, 5.01, -1, 1, false);

// 设置初始条件：通过坐标对某范围内的单元初始化压力及饱和度
fracsp.InitConditionByCoord(1e6, 0.8, -1e5, 1e5, -1e5, 1e5);
poresp.InitConditionByCoord(1e6, 0.9, -500, 500, -500, 500);

// 设置监测节点：跟踪压力、流速和流量变化
dyna.Monitor("fracsp", "sc_magvel", 5, 5, 0);
dyna.Monitor("fracsp", "sc_pp", 5, 5, 0);
dyna.Monitor("fracsp", "sc_discharge", 5, 5, 0);

dyna.Monitor("block", "fpp", 5, 5, 0);
dyna.Monitor("block", "magfvel", 5, 5, 0);
dyna.Monitor("block", "discharge", 5, 5, 0);

// 自动计算时步
dyna.TimeStepCorrect();

// 设置时间步长
dyna.Set("Time_Step 0.05");

// 求解10万步
dyna.Solve(100000);

// 获取裂隙渗流节点信息
var fracNodeValues = fracsp.GetFracSeepageNodeValue();

// 获取孔隙渗流节点信息
var poreNodeValues = poresp.GetNodeValue();

// 打印提示信息
print("Solution Finished");
print("Fracture Seepage Node Values: " + JSON.stringify(fracNodeValues));
print("Pore Seepage Node Values: " + JSON.stringify(poreNodeValues));
