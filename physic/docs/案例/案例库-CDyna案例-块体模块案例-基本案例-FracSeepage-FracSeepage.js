//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

//包含裂隙计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

//打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

//设置3个方向的重力加速度
dyna.Set("Gravity 0.0 -10.0 0.0");

//设置结果输出时步
dyna.Set("Output_Interval 500");

//导入GiD格式的裂隙渗流网格
fracsp.ImportGrid("gid", "fracurenet.msh");

//设置裂隙渗流参数，依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
fracsp.SetPropByGroup(1000.0,1e7,1e-12,1e-6,1,11);

//定义三个方向梯度值
var fArrayGrad = [0.0, 0.0, 0.0];

//模型底部施加1MPa的水压力
fracsp.ApplyConditionByCoord("pp", 1e6, fArrayGrad, -1e5, 1e5, -0.001, 0.001, -1e5, 1e5);

//自动计算时步
dyna.TimeStepCorrect();

//求解10万步
dyna.Solve(10000);

//打印提示信息
print("Solution Finished");
