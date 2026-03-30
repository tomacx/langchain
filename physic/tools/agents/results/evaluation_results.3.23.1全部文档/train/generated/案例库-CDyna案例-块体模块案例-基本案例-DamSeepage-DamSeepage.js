setCurDir(getSrcDir());

// 初始化环境：关闭力学计算，启用孔隙渗流模块
dyna.Set("Mechanic_Cal 0");
dyna.Set("Config_PoreSeepage 1");
dyna.Set("PoreSeepage_Cal 1");

// 设置重力加速度（Y方向向下）
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置结果输出时步间隔
dyna.Set("Output_Interval 500");

// 监测结果输出时步间隔
dyna.Set("Moniter_Iter 100");

// 创建二维矩形网格（模拟大坝模型）
blkdyn.GenBrick2D(10.0, 10.0, 50, 50, 1);

// 定义X、Y、Z三个方向的渗透系数
var arrayK = new Array(1e-10, 1e-10, 1e-10);

// 指定坐标控制范围内的孔隙渗流参数：密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByCoord(1000.0, 1e6, 0.0, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

// 定义压力梯度
var fArrayGrad = new Array(0.0, 0.0, 0.0);

// 初始化孔隙压力为10MPa
poresp.InitConditionByCoord("pp", 1e7, fArrayGrad, -500, 500, -500, 500, -500, 500, false);

// 设置模型边界条件（水压力）
poresp.ApplyConditionByCoord("pp", 10e4, fArrayGrad, 8.99, 9.01, -1, 10, -500, 500, false);
poresp.ApplyConditionByCoord("pp", 2e4, fArrayGrad, -0.01, 0.01, -1, 2.0, -500, 500, false);
poresp.ApplyConditionByCoord("pp", 0, fArrayGrad, 8.99, 9.01, 10.01, 200, -500, 500, false);
poresp.ApplyConditionByCoord("pp", 0, fArrayGrad, -0.01, 0.01, 2.001, 200, -500, 500, false);

// 设置渗流模式为瞬态可压缩液体渗流
dyna.Set("Seepage_Mode 1");

// 设置流体定律为牛顿流体
dyna.Set("Liquid_Seepage_Law 1");

// 开启Biot渗流应力耦合计算
dyna.Set("If_Biot_Cal 1");

// 对典型位置的孔隙压力进行监测
dyna.Monitor("block", "fpp", 0, 5, 0);
dyna.Monitor("block", "fpp", 2, 5, 0);
dyna.Monitor("block", "fpp", 4, 5, 0);
dyna.Monitor("block", "fpp", 6, 5, 0);
dyna.Monitor("block", "fpp", 8, 5, 0);
dyna.Monitor("block", "fpp", 10, 5, 0);

// 设置计算时步为100s
dyna.Set("Time_Step 100");

// 迭代求解
dyna.Solve(10000);

// 输出监测数据至Result文件夹
dyna.OutputMonitorData();

// 输出模型结果至其他软件可导入格式
dyna.OutputModelResult();

print("Solution Finished");
