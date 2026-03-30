setCurDir(getSrcDir());

// 初始化仿真环境
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0 0 0");
dyna.Set("Output_Interval 100");
dyna.Set("Large_Displace 1");
dyna.Set("Mechanic_Cal 1");

// 导入网格模型（示例：使用内置测试网格）
blkdyn.ImportGrid("gid", "test_model.msh");

// 设置模型为线性弹性模型
blkdyn.SetModel("linear");

// 设置材料参数：密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角
blkdyn.SetMat(2500, 3e10, 0.25, 3e5, 1e5, 25, 10);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.01);

// 创建动态载荷数据文件
var loadFile = "dynamic_load.txt";
var fileContent = "10\n"; // 第一行：载荷序列个数
fileContent += "0.0 0.0\n";   // 第二行：t=0s, F=0N
fileContent += "0.001 5000.0\n"; // t=0.001s, F=5000N
fileContent += "0.002 10000.0\n"; // t=0.002s, F=10000N
fileContent += "0.003 7500.0\n"; // t=0.003s, F=7500N
fileContent += "0.004 2500.0\n"; // t=0.004s, F=2500N
fileContent += "0.005 0.0\n";    // t=0.005s, F=0N
fileContent += "0.006 -2500.0\n"; // t=0.006s, F=-2500N
fileContent += "0.007 -5000.0\n"; // t=0.007s, F=-5000N
fileContent += "0.008 0.0\n";    // t=0.008s, F=0N

// 将载荷数据写入文件（通过系统命令）
var fs = require("fs");
if (typeof fs !== 'undefined') {
    fs.writeFileSync(loadFile, fileContent);
}

// 定义目标单元组号范围：组1到组3
var nGrp = [1, 3];

// 定义坐标选择范围（X: -0.9m ~ 0.9m, Y: -1e5m ~ 1e5m, Z: -1e5m ~ 1e5m）
var fCoord = [-0.9, 0.9, -1e5, 1e5, -1e5, 1e5];

// 定义法向选择参数：考虑法向，单位法向量(-1, 0, 0)，容差0.5
var fDir = [1, -1, 0, 0, 0.5];

// 设定三个方向载荷系数（仅X方向施加力）
var coeff = [1e6, 0, 0]; // X方向系数1e6 Pa，Y、Z方向为0

// 配置局部坐标系施力标志：false表示使用全局坐标系
var if_set = false;

// 调用ApplyDynaVarFromFileByGCD施加动态边界条件
blkdyn.ApplyDynaVarFromFileByGCD("force", if_set, coeff, loadFile, nGrp, fCoord, fDir);

// 配置结果输出请求：监测位移、应力及载荷历史数据
dyna.Monitor("block", "xvel", 2, 5, 0); // 监测节点2-5的X方向速度
dyna.Monitor("block", "sxx", 2, 5, 0);  // 监测节点2-5的X方向应力
dyna.Monitor("block", "syy", 2, 5, 0);  // 监测节点2-5的Y方向应力
dyna.Monitor("block", "szz", 2, 5, 0);  // 监测节点2-5的Z方向应力

// 设置计算时步
dyna.TimeStepCorrect(0.01);

// 执行求解（迭代次数根据问题复杂度调整）
dyna.DynaCycle(0.01);
dyna.Solve(5000);

// 释放动态链接库资源
dyna.FreeUDF();
