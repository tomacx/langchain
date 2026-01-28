//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

//包含裂隙计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

//打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

//设置3个方向的重力加速度
dyna.Set("Gravity 0.0 0.0 0.0");

//设置结果输出时步
dyna.Set("Output_Interval 500");

var pid = igeo.genPoint(5,5,0,0.2);

var sid = igeo.genRectS(0,0,0,10,10,0,0.5,1);

igeo.setHardPointToFace(pid, sid);

imeshing.genMeshByGmsh(2);

fracsp.ImportGrid("Gmsh","GDEM.msh");

//设置裂隙渗流参数，依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
fracsp.SetPropByGroup(1000.0,1e6,1e-6,1e-3,1,11);

//定义三个方向梯度值
//var fArrayGrad = [0.0, 0.0, 0.0];

//模型底部施加1MPa的水压力
//fracsp.ApplyConditionByCoord("pp", 1e6, fArrayGrad, -1e5, 1e5, -0.001, 0.001, -1e5, 1e5);



var fArrayGrad = [0.0, 0.0, 0.0];
var aValue = new Array();
aValue[0] = [0,0];
aValue[1] = [50,1e4];
aValue[2] = [100,3e4];
aValue[3] = [150,5e4];
aValue[4] = [200,4e4];
aValue[5] = [300,3e4];

fracsp.ApplyDynaConditionByCoord("pp",aValue, fArrayGrad, 4.99, 5.01,  4.99, 5.01, -1,1);

//fracsp.ApplyDynaConditionByCoord("source",aValue, fArrayGrad, 4.99, 5.01,  4.99, 5.01, -1,1);
//fracsp.ApplyDynaConditionByCoord("flux",aValue, fArrayGrad, 4.8, 5.2,  4.8, 5.2, -1,1);


dyna.Monitor("fracsp", "sc_magvel", 5,5,0);
dyna.Monitor("fracsp", "sc_pp", 5,5,0);
dyna.Monitor("fracsp", "sc_discharge", 5,5,0);

//自动计算时步
dyna.TimeStepCorrect();

dyna.Set("Time_Step 0.005");

//求解10万步
dyna.Solve(100000);

//打印提示信息
print("Solution Finished");
