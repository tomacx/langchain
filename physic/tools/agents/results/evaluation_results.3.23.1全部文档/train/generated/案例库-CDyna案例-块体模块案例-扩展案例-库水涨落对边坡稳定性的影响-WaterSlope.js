setCurDir(getSrcDir());

// 初始化模型配置
dyna.Set("Mechanic_Cal 1");
dyna.Set("Config_PoreSeepage 1");
dyna.Set("PoreSeepage_Cal 0");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Output_Interval 2000");
dyna.Set("PoreSP_Bound_To_Solid 1");

// 导入网格文件（示例：边坡模型）
blkdyn.ImportGrid("gid", "slope50m.msh");

// 设置材料参数：密度、弹性模量、泊松比、粘聚力、内摩擦角、屈服准则、硬化参数
blkdyn.SetMat(2200, 1e9, 0.3, 2e4, 2e4, 25, 15);

// 设置边界约束：固定底部和两侧
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 39.99, 41);
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// 定义孔隙渗流参数：密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
var arrayK = new Array(1e-10, 1e-10, 1e-10);
poresp.SetPropByCoord(1000.0, 1e6, 0.0, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

// 设置初始孔隙水压力边界条件
var fArrayGrad = new Array(0, -9800, 0);
poresp.InitConditionByCoord("pp", 1e5, fArrayGrad, -500, 500, -500, 500, false);

// 设置初始饱和度边界条件
var fArrayGrad2 = new Array(0, 0, 0);
poresp.InitConditionByCoord("sat", 1.0, fArrayGrad2, -500, 500, -500, 500, false);

// 设置水位高度限制参数（防止无限注水）
dyna.Set("Flow_Bound_Height_Limit 10.0");

// 定义潜在破裂面接触面并设置力学强度为零
blkdyn.SetContactIFace(1, "slope", 0.0, 0.0, 0.0, 1e-6, 0.0, 0.0);

// 配置简单水力压裂模式参数：压力边界类型、注入点坐标
var fC = new Array(20.0, 12.5, 0.0);
blkdyn.SetSimpleHyFracPram(1, 1, 1e5, 0.9, fC, true);

// 设置注入流体参数：不同时间段的粘度、密度变化
var aVisc = new Array(4);
aVisc[0] = [0, 1e-4];
aVisc[1] = [5e5, 1e-2];
aVisc[2] = [5e6, 1e-1];
aVisc[3] = [1e8, 1];

var aDens = new Array(4);
aDens[0] = [0, 1000];
aDens[1] = [5e5, 1020];
aDens[2] = [5e6, 1040];
aDens[3] = [1e8, 1060];

var idJet = fracsp.SetJetProp(0.0, aVisc, null, aDens);

// 设置监测点：位移和孔隙水压力
dyna.Monitor("block", "xdis", 10, 10, 0);
dyna.Monitor("block", "xdis", 20, 12.5, 0);
dyna.Monitor("block", "pp", 20, 12.5, 0);

// 执行初始计算步骤
dyna.Solve();

// 切换到Mohr-Coulomb模型进行稳定性分析
blkdyn.SetModel("MC");
dyna.Solve();

// 初始化位移条件
blkdyn.InitConditionByGroup("displace", [0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], 1, 1);

// 开启孔隙渗流与固体耦合的比奥固结计算
dyna.Set("PoreSeepage_Cal 1");
dyna.Set("If_Biot_Cal 1");
dyna.Set("Time_Now 0");
dyna.TimeStepCorrect(1.0);

// 动态更新边界条件响应水位波动
var fBoundV1 = 1e5;
var fBoundV2 = 0.9;
poresp.ApplyConditionByCoord("pp", fBoundV1, fArrayGrad, -1, 11, 0.001, 10.01, -500, 500, true);

// 执行完整计算过程
dyna.Solve();

// 后处理：获取监测点数据评估边坡稳定性
var xdis = dyna.GetMonitorValue("block", "xdis", 20, 12.5, 0);
var pp = dyna.GetMonitorValue("block", "pp", 20, 12.5, 0);

// 输出结果文件路径配置
doc.SetResultPath("result/WaterSlope");
doc.SetResultFormat("vtk");
