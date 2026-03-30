setCurDir(getSrcDir());

// 关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

// 包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage 1");

// 开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal 1");

// 包含裂隙渗流计算功能，开辟相应内存
dyna.Set("Config_FracSeepage 1");

// 打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

// 设置3个方向的重力加速度
dyna.Set("Gravity 0.0 0.0 -9.8");

// 设置结果输出时步
dyna.Set("Output_Interval 500");

// 创建几何模型
var pid = igeo.genPoint(5, 5, 0, 0.2);
var sid = igeo.genRectS(0, 0, 0, 10, 10, 0, 0.5, 1);
igeo.setHardPointToFace(pid, sid);

// 网格划分
imeshing.genMeshByGmsh(2);

// 导入网格
blkdyn.ImportGrid("Gmsh", "GDEM.msh");

// 定义X、Y、Z三个方向的渗透系数
var arrayK = new Array(1e-8, 1e-8, 1e-8);

// 指定坐标控制范围内的孔隙渗流参数
// 依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByCoord(1000.0, 1e6, 0.0, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

// 设置裂隙渗流参数
// 依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
fracsp.SetPropByGroup(1000.0, 1e6, 1e-6, 1e-3, 1, 11);

// 定义X、Y、Z三个方向的梯度值
var fArrayGrad = [0.0, 0.0, 0.0];

// 初始化孔隙压力和饱和度（通过坐标范围）
poresp.InitConditionByCoord(1e5, 1.0, 0.5, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

// 初始化裂隙压力和饱和度（通过组）
fracsp.InitConditionByGroup(1e5, 1.0, 0.5, 1, 11);

// 设置渗流模式：1-瞬态可压缩液体渗流
dyna.Set("Seepage_Mode 1");

// 设置液体渗流定律：1-牛顿流体
dyna.Set("Liquid_Seepage_Law 1");

// 设置孔隙渗流参数：PS_CirInject_Width（最小开度）和 If_Renew_Porosity（是否更新孔隙率）
dyna.Set("PS_CirInject_Width 1e-6");
dyna.Set("If_Renew_Porosity 0");

// 根据圆柱施加动态压力及流量边界条件
poresp.ApplyDynaConditionByCylinder("pp", aValue, fArrayGrad, 5.0, 5.0, -1, 5.0, 5.0, 1, 0.2, 0.3, true);

// 根据坐标施加压力、流量的动态边界条件（裂隙）
fracsp.ApplyDynaConditionByCoord("pp", aValue, fArrayGrad, 4.99, 5.01, 4.99, 5.01, -1, 1);

// 定义孔隙渗流参数数组
var aValue = new Array();
aValue[0] = [0, 0];
aValue[1] = [50, 1e4];
aValue[2] = [100, 3e4];
aValue[3] = [150, 5e4];
aValue[4] = [200, 4e4];
aValue[5] = [300, 3e4];

// 设置孔隙渗流监测点
dyna.Monitor("poresp", "pp", 5, 5, 0);
dyna.Monitor("poresp", "magfvel", 5, 5, 0);
dyna.Monitor("poresp", "discharge", 5, 5, 0);

// 设置裂隙渗流监测点
dyna.Monitor("fracsp", "sc_magvel", 5, 5, 0);
dyna.Monitor("fracsp", "sc_pp", 5, 5, 0);
dyna.Monitor("fracsp", "sc_discharge", 5, 5, 0);

// 自动计算时步
dyna.TimeStepCorrect();

// 设置时间步长
dyna.Set("Time_Step 0.05");

// 求解
dyna.Solve(100000);

// 获取孔隙节点压力值
var pressureValues = poresp.GetNodeValue("pp", [5, 5, 0]);

// 获取裂隙节点流量信息
var fracFlowValues = fracsp.GetFracSeepageNodeValue("sc_magvel", [5, 5, 0]);

// 打印提示信息
print("Solution Finished");
