setCurDir(getSrcDir());

// 清空环境
dyna.Clear();
doc.clearResult();

// 关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

// 包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage 1");

// 开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal 1");

// 设置3个方向的重力加速度
dyna.Set("Gravity 0.0 0.0 -9.8");

// 设置结果输出时步
dyna.Set("Output_Interval 500");

// 导入山体网格模型
blkdyn.ImportGrid("Gid", "mountainmodel.msh");

// 定义X、Y、Z三个方向的渗透系数
var arrayK = new Array(1e-8, 1e-8, 1e-8);

// 指定坐标控制范围内的孔隙渗流参数
// 依次为：流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByCoord(1000.0, 1e6, 0.0, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

// 定义山体表面法向梯度
var fArrayGrad = [0.0, 0.0, 0.0];

// 定义动态边界条件参数数组
var aValue = new Array();
aValue[0] = [0, 0];
aValue[1] = [50, 1e4];
aValue[2] = [100, 3e4];
aValue[3] = [150, 5e4];
aValue[4] = [200, 4e4];
aValue[5] = [300, 3e4];

// 根据山体表面法向施加动态条件
poresp.ApplyDynaBoundCondition("pp", aValue, fArrayGrad, 0, 0, 1, 0.1);

// 设置裂隙渗流模块（如需）
dyna.Set("Config_FracSeepage 1");
dyna.Set("FracSeepage_Cal 1");

// 设置裂隙渗流参数：密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
fracsp.SetPropByGroup(1000.0, 1e6, 1e-6, 1e-3, 1, 11);

// 设置监测点：孔隙压力、裂隙流速、流量
dyna.Monitor("block", "fpp", 5, 5, 0);
dyna.Monitor("block", "magfvel", 5, 5, 0);
dyna.Monitor("block", "discharge", 5, 5, 0);

// 裂隙渗流监测点
dyna.Monitor("fracsp", "sc_magvel", 5, 5, 0);
dyna.Monitor("fracsp", "sc_pp", 5, 5, 0);
dyna.Monitor("fracsp", "sc_discharge", 5, 5, 0);

// 自动计算时步
dyna.TimeStepCorrect();

// 设置时间步长
dyna.Set("Time_Step 0.01");

// 求解（根据模型规模调整步数）
dyna.Solve(10000);

// 获取节点压力值进行验证
var nodePressure = poresp.GetNodeValue(5, 5, 0);
print("Node Pressure at (5,5,0): " + nodePressure);

// 获取裂隙渗流节点信息
var fracNodeValue = fracsp.GetFracSeepageNodeValue(5, 5, 0);
print("Frac Node Value: " + fracNodeValue);

// 打印提示信息
print("Solution Finished");
