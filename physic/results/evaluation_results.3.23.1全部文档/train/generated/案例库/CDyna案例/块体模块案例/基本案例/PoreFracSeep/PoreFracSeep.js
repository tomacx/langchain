setCurDir(getSrcDir());

// 关闭力学计算开关
dyna.Set("Mechanic_Cal", 0);

// 包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage", 1);

// 开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal", 1);

// 设置气体渗流模式
dyna.Set("Seepage_Mode", 2);

// 打开吸附解吸附渗流开关
dyna.Set("If_Langmuir_Cal", 1);

// 设置重力加速度为0.0
dyna.Set("Gravity", 0.0, 0.0, 0.0);

// 将结果输出时步设定为500步
dyna.Set("Output_Interval", 500);

// 监测结果输出时步间隔设定为100步
dyna.Set("Monitor_Iter", 100);

// 创建二维矩形网格，尺寸为10x10，单元格数量为50x50
blkdyn.GenBrick2D(10.0, 10.0, 50, 50, 1);

// 定义X、Y、Z三个方向的渗透系数
var arrayK = new Array(1e-10, 1e-10, 1e-10);

// 指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByCoord(0.176, 1e9, 1.0, 0.01, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

// 设置Langmuir吸附解吸附参数，依次为最大吸附量、吸附常数、固体密度、瓦斯滑脱效应克林博格系数
poresp.SetLangmuirPropByGroup(37.255e-3, 0.432e-6, 1500, 0.0, 1, 2);

// 定义梯度
var fArrayGrad = new Array(0.0, 0.0, 0.0);

// 初始化孔隙气体压力，为10MPa
poresp.InitConditionByCoord("pp", 1e7, fArrayGrad, -100, 100, -100, 100, -100, 100, false);

// 设置模型四周的水压力边界条件（注释掉，因为案例中没有具体数值）
// poresp.ApplyConditionByCoord("pp", 0, fArrayGrad, 3.999, 6.001, 3.999, 6.001, -500, 500, false);

// 对典型位置的孔隙压力进行监测
dyna.Monitor("block", "fpp", 7, 5, 0);
dyna.Monitor("block", "fpp", 8, 5, 0);
dyna.Monitor("block", "fpp", 9, 5, 0);

// 设定计算时步为100s
dyna.Set("Time_Step", 100);

// 迭代2万步
dyna.Solve(10000);

// 打印提示信息
print("Solution Finished");
