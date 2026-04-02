// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

// 包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage 1");

// 开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal 1");

// 设置三个方向的重力加速度
dyna.Set("Gravity 0.0 -10.0 0.0");

// 将结果输出时步设定为500步
dyna.Set("Output_Interval 500");

// 监测结果输出时步间隔设定为100步
dyna.Set("Moniter_Iter 100");

// 创建二维矩形网格，尺寸为10x10，每个方向上50个单元格
blkdyn.GenBrick2D(10.0, 10.0, 50, 50, 1);

// 定义X、Y、Z三个方向的渗透系数
var arrayK = new Array(1e-10, 1e-10, 1e-10);

// 指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByCoord(1000.0, 1e6, 0.0, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

// 定义梯度
var fArrayGrad = new Array(0.0, 0.0, 0.0);

// 设定模型四周的水压力边界条件
poresp.ApplyConditionByCoord("pp", 1e7, fArrayGrad, -100, 100, -100, 100, -500, 500, false);

// 对典型位置的孔隙压力进行监测
dyna.Monitor("block", "fpp", 7, 5, 0);
dyna.Monitor("block", "fpp", 8, 5, 0);
dyna.Monitor("block", "fpp", 9, 5, 0);

// 设定计算时步为100s
dyna.Set("Time_Step 100");

// 迭代2万步
dyna.Solve(20000);

// 打印提示信息
print("Solution Finished");
