setCurDir(getSrcDir());

// 初始化CDyna核心模块配置
dyna.Set("Mechanic_Cal 0");
dyna.Set("Config_PoreSeepage 1");
dyna.Set("PoreSeepage_Cal 1");
dyna.Set("Config_FracSeepage 1");
dyna.Set("FracSeepage_Cal 1");
dyna.Set("FS_PoreS_Interaction 1");

// 设置物理环境参数
dyna.Set("Gravity 0.0 -10.0 0.0");
dyna.Set("Output_Interval 500");
dyna.Set("Time_Step 0.0005");

// 导入网格模型
blkdyn.ImportGrid("gid", "porefracgrid.msh");

// 创建接触面并更新网格
blkdyn.CrtIFace(-1, -1);
blkdyn.UpdateIFaceMesh();

// 定义孔隙渗流参数：密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
var arrayK = new Array(8e-8, 8e-8, 8e-8);
poresp.SetPropByCoord(1000.0, 1e6, 0.0, 0.2, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

// 创建裂隙单元
fracsp.CreateGridFromBlock(2);

// 设置裂隙渗流参数：密度、体积模量、渗透系数、裂隙初始开度、组号范围
fracsp.SetPropByGroup(1000.0, 1e6, 8e-5, 1e-2, 1, 11);

// 定义梯度值
var fArrayGrad = new Array(0.0, 0.0, 0.0);

// 设置右侧裂隙边界压力条件（50kPa）
fracsp.ApplyConditionByCoord("pp", 5e4, fArrayGrad, 9.99, 11.0, -1e5, 1e5, -1e5, 1e5);

// 配置接触面断裂能参数（沿X轴方向）
var coord1 = new Array(0, 0, 0);
var coord2 = new Array(100, 0, 0);
blkdyn.SetIFracEnergyByLine(100, 2000, coord1, coord2, 1e-3);

// 初始化孔隙渗流条件（使用圆柱体区域）
var cylinderGrad = new Array(0.0, 0.0, 0.0);
poresp.InitConditionByCylinder("pp", 1e6, cylinderGrad, 0.0, 0.0, -1.0, 0.0, 0.0, 1.0, 0.1, 0.5, false);

// 初始化裂隙与孔隙的耦合计算
fracsp.CalIntPoreSp();

// 配置监测点坐标（在模型中心位置）
var monitorCoord = new Array(50.0, 25.0, 0.0);
dyna.Monitor("block", "fpp", 7, 5, 0);
dyna.Monitor("block", "fpp", 8, 5, 0);

// 执行求解循环（10万步）
dyna.Solve(100000);

// 在指定时步输出监测信息
dyna.OutputMonitorData();

// 检查全局变量状态确认计算收敛性
var unbalance = dyna.GetValue("UnBalance_Ratio");
if (unbalance < 1e-4) {
    print("Solution Converged Successfully");
} else {
    print("Warning: Solution may not have fully converged");
}

// 保存最终仿真结果
dyna.OutputModelResult();

print("PoreFracSeep Simulation Completed");
