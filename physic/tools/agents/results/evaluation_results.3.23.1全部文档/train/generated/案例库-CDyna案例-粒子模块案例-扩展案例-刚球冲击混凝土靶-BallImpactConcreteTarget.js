setCurDir(getSrcDir());

// 初始化计算参数
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0.0 0.0 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 2e-3");
dyna.Set("Time_Step 2e-5");

// 创建刚性弹丸（球体）
var ballCoord = new Array();
ballCoord[0] = new Array(-0.1, -0.1, -0.1);
ballCoord[1] = new Array(0.1, -0.1, -0.1);
ballCoord[2] = new Array(0.1, 0.1, -0.1);
ballCoord[3] = new Array(-0.1, 0.1, -0.1);
rdface.Create(1, 1, 4, ballCoord);

// 创建混凝土靶板（矩形板）
var concreteCoord = new Array();
concreteCoord[0] = new Array(-0.15, -0.15, 0.01);
concreteCoord[1] = new Array(0.15, -0.15, 0.01);
concreteCoord[2] = new Array(0.15, 0.15, 0.01);
concreteCoord[3] = new Array(-0.15, 0.15, 0.01);
rdface.Create(2, 2, 4, concreteCoord);

// 设置弹丸材料参数（刚性钨合金）
pdyna.SetMat(19220, 7.1e11, 0.23, 1e9, 1e9, 0, 0.005, 0.0, 1);

// 设置混凝土材料参数（脆性断裂模型）
pdyna.SetMat(2550, 3e10, 0.25, 5e6, 5e6, 35, 0.005, 0.0, 2);

// 初始化弹丸速度（沿Y轴负方向冲击）
var fvalue = new Array(0.0, -100.0, 0.0);
pdyna.InitCondByGroup("velocity", fvalue, 1, 1);

// 固定靶板底部颗粒约束
pdyna.FixV("xyz", 0.0, "y", -0.16, -0.149);
pdyna.FixV("xyz", 0.0, "y", 0.149, 0.16);

// 设置接触界面材料参数（法向刚度、切向刚度、摩擦角、粘聚力、抗拉强度）
blkdyn.SetIMatByGroupInterface(5e9, 5e9, 30, 1e6, 1e5, -1, -1);

// 设置块体模型为Mohr-Coulomb脆性断裂模型
blkdyn.SetIModel("SSMC");

// 创建可穿透环形靶板（监测侵彻深度）
pfly.CrtPeneTarget(0.0, 0.0, 0.0, 0.15, -0.02, 0.0);

// 时间步长修正
dyna.TimeStepCorrect(0.8);

// 执行求解（10000步）
dyna.Solve(10000);

// 导出侵彻靶板统计信息
pfly.ExportPeneTargetInfo();

print("Solution is ok!");
