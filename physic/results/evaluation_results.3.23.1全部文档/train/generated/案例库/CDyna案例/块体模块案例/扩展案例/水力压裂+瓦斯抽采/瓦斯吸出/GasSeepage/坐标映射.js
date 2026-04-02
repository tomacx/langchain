// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 关闭力学计算开关
dyna.Set("Mechanic_Cal", 0);

// 包含裂隙渗流模块，开辟相应内存
dyna.Set("Config_FracSeepage", 1);

// 打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal", 1);

// 设置三个方向的重力加速度，均为0.0
dyna.Set("Gravity", 0.0, 0.0, 0.0);

// 将结果输出时步设定为500步
dyna.Set("Output_Interval", 500);

// 监测结果输出时步间隔设定为100步
dyna.Set("Moniter_Iter", 100);

// 创建二维矩形网格
blkdyn.GenBrick2D(10.0, 10.0, 50, 50, 1);

// 定义X、Y、Z三个方向的渗透系数
var arrayK = new Array(1e-10, 1e-10, 1e-10);

// 指定坐标控制范围内的裂隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
fracsp.SetPropByCoord(1.293, 1e7, 12e-13, 12e-9, arrayK, -100, 100, -100, 100, -100, 100);

// 初始化裂隙气体压力，为10MPa
fracsp.InitConditionByCoord("pp", 1e7, [0.0, 0.0, 0.0], -100, 100, -100, 100, -100, 100);

// 对典型位置的裂隙压力进行监测
dyna.Monitor("block", "fpp", 7, 5, 0);
dyna.Monitor("block", "fpp", 8, 5, 0);
dyna.Monitor("block", "fpp", 9, 5, 0);

// 设定计算时步为100s
dyna.Set("Time_Step", 100);

// 迭代2万步
dyna.Solve(10000);

// 打印提示信息
print("Solution Finished");
