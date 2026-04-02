setCurDir(getSrcDir());

// 关闭力学计算开关
dyna.Set("Mechanic_Cal", 0);

// 包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage", 1);

// 开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal", 1);

// 设置为瞬态可压缩液体渗流模式
dyna.Set("Seepage_Mode", 1);

// 设置液体渗流定律为宾汉流模型
dyna.Set("Liquid_Seepage_Law", 2);

// 设置截止开度，达到该值流体停止进入
dyna.Set("PS_CirInject_Width", 1e-6);

// 设置整体模型的最小孔隙开度
dyna.Set("Pore_Min_Width", 1.4e-4);

// 创建二维矩形网格
blkdyn.GenBrick2D(10, 0.2, 50, 1, 1);

// 定义X、Y、Z三个方向的渗透系数
var arrayK = new Array(1.66667e-7, 1.66667e-7, 1.66667e-7);

// 指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByGroup(1810.0, 1e6, 0.0, 0.01, arrayK, 1.0, 1);

// 单独指定剪切强度
poresp.SetSinglePropByGroup("Strength", 11.75, 1);

// 定义梯度
var fArrayGrad = new Array(0.0, 0.0, 0.0);

// 设定模型四周的水压力边界条件
poresp.ApplyConditionByCoord("pp", 5e5, fArrayGrad, -0.5, 0.5, -1e5, 1e5, -1e5, 1e5, true);

// 设置计算时步
dyna.Set("Time_Step", 0.001);

// 迭代次数
dyna.Solve(50000);

print("Solution Finished");
