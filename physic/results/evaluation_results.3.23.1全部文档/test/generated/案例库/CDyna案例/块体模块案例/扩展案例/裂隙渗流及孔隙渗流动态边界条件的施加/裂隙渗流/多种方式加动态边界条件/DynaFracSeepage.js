// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir();

// 清除之前的计算结果和文档结果
dyna.Clear();
doc.clearResult();

// 关闭力学计算开关
dyna.Set("Mechanic_Cal", 0);

// 包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage", 1);

// 开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal", 1);

// 设置重力加速度
dyna.Set("Gravity", [0.0, 0.0, -9.8]);

// 设置结果输出时步
dyna.Set("Output_Interval", 500);

// 导入网格模型
blkdyn.ImportGrid("Gid", "mountainmodel.msh");

// 定义X、Y、Z三个方向的渗透系数
var arrayK = [1e-8, 1e-8, 1e-8];

// 指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByCoord(1000.0, 1e6, 0.0, 0.3, arrayK, 1.0, -5e6, 5e6, -5e6, 5e6, -5e6, 5e6);

// 定义梯度数组
var fArrayGrad = [0.0, 0.0, 0.0];

// 动态条件值数组
var aValue = [
    [0, 0],
    [50e4, 1e4],
    [100e4, 3e4],
    [150e4, 5e4],
    [200e4, 4e4],
    [300e4, 3e4]
];

// 根据山体表面法向施加动态条件
poresp.ApplyDynaBoundCondition("pp", aValue, fArrayGrad, 0, 0, 1, 0.1);

// 设置时间步长
dyna.Set("Time_Step", 1e3);

// 求解5000步
dyna.Solve(5000);

// 打印提示信息
print("Solution Finished");
