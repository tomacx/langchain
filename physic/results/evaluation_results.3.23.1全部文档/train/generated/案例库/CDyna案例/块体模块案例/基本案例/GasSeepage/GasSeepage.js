// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 关闭力学计算开关
dyna.Set("Mechanic_Cal", 0);

// 包含裂隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_FractureSeepage", 1);

// 开启裂隙渗流开关
dyna.Set("FractureSeepage_Cal", 1);

// 设置三个方向的重力加速度
dyna.Set("Gravity", [0.0, -9.81, 0.0]);

// 将结果输出时步设定为500步
dyna.Set("Output_Interval", 500);

// 监测结果输出时步间隔设定为100步
dyna.Set("Moniter_Iter", 100);

// 导入Gid格式的网格文件
fracseep.ImportGrid("Gid", "fracture-seepage.msh");

// 定义X、Y、Z三个方向的渗透系数
var arrayK = [1e-8, 1e-8, 1e-8];

// 指定坐标控制范围内的裂隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数
fracseep.SetPropByCoord(1000.0, 1e6, 0.3, arrayK, -500, 500, -500, 500, -500, 500);

// 定义梯度
var fArrayGrad = [0.0, -9810.0, 0.0];

// 设定模型四周的水压力边界条件
fracseep.ApplyConditionByCoord("pp", 1e4, fArrayGrad, -500, 500, -500, -499.99, -500, 500);
fracseep.ApplyConditionByCoord("pp", 0, [0.0, 0.0, 0.0], -500, 500, 500, 501, -500, 500);

// 对典型位置的裂隙压力进行监测
dyna.Monitor("fracseep", "fpp", 0, 0, 0);
dyna.Monitor("fracseep", "fpp", 2, 2, 2);
dyna.Monitor("fracseep", "fpp", 4, 4, 4);

// 设定计算时步为1s
dyna.Set("Time_Step", 1.0);

// 求解5万步
dyna.Solve(50000);

// 打印提示信息
print("Solution Finished");
