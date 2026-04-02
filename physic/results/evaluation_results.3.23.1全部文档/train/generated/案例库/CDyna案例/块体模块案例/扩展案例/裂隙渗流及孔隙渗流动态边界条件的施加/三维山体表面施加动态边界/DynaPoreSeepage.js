// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

dyna.Clear();
doc.clearResult();

// 关闭力学计算开关
dyna.Set("Mechanic_Cal", 0);

// 包含孔隙渗流计算功能，开辟相应内存
dyna.Set("Config_PoreSeepage", 1);

// 开启孔隙渗流计算开关
dyna.Set("PoreSeepage_Cal", 1);

// 设置3个方向的重力加速度
dyna.Set("Gravity", 0.0, 0.0, 0.0);

// 设置结果输出时步
dyna.Set("Output_Interval", 500);

// 导入网格数据
blkdyn.ImportGrid("Gid", "pore-seepage.msh");

// 定义X、Y、Z三个方向的渗透系数
var arrayK = [1e-8, 1e-8, 1e-8];

// 指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByCoord(1000.0, 1e6, 0.0, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

// 定义梯度值
var fArrayGrad = [0.0, 0.0, 0.0];

// 动态边界条件参数设置
var aValue = [
    [0, 0],
    [50, 1e4],
    [100, 3e4],
    [150, 5e4],
    [200, 4e4],
    [300, 3e4]
];

// 应用动态边界条件
poresp.ApplyDynaConditionBySphere("pp", aValue, fArrayGrad, 0.5, 0.5, 0, 0.19, 0.21, true);

// 监控点设置
dyna.Monitor("block", "fpp", 5, 5, 0);
dyna.Monitor("block", "magfvel", 5, 5, 0);
dyna.Monitor("block", "discharge", 5, 5, 0);

// 自动计算时步
dyna.TimeStepCorrect();

// 设置时间步长
dyna.Set("Time_Step", 0.005);

// 求解10万步
dyna.Solve(100000);

// 打印提示信息
print("Solution Finished");
