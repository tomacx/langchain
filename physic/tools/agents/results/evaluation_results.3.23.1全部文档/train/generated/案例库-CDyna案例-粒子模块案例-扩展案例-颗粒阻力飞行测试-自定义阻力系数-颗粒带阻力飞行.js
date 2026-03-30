setCurDir(getSrcDir());

// 关闭虚拟质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 云图输出间隔设定为500
dyna.Set("Output_Interval 500");

// 设置重力加速度方向为Y轴负向
dyna.Set("Gravity 0.0 -9.8 0");

// 创建单个颗粒，直径1cm
pdyna.SingleCreate(1, 2, 5e-3, 0, 200, 0);

// 脆断模型
pdyna.SetModel("brittleMC");

// 密度 弹模 泊松比 抗拉强度 粘聚力 内摩擦角 局部阻尼系数 粘性阻尼系数
pdyna.SetMat(16930, 4.1e11, 0.2, 0, 0, 30, 0.0, 0.0);

// 初始化速度为-100m/s（Y轴负向）
pdyna.InitCondByGroup("velocity", [0, -100, 0], 1, 100);

// 设置速度监测点
dyna.Monitor("particle", "pa_yvel", 0, 200, 0);

// 设置位移监测点
dyna.Monitor("particle", "pa_ydis", 0, 200, 0);

// 设置阻力系数监测点
dyna.Monitor("particle", "pa_drag_force", 0, 200, 0);

// 1-传统颗粒流；2-PCMM颗粒；3-带阻力的飞行颗粒（不进行接触更新计算）
dyna.Set("Particle_Cal_Type 3");

// 设置飞行参数，空气密度，地面高程
// 空气阻力模式（1-常阻力，2-马赫阻力，3-雷诺阻力, 4-用户自定义阻力）
// 阻力参数（1时为阻力系数，2为声速，3为动力粘度, 4-文件名）
pfly.SetFlyPara(1.069, -2, 4, "custom_drag_coeff.txt");

// 创建自定义阻力系数表文件
var dragFile = getSrcDir() + "/custom_drag_coeff.txt";
var fileContent = "5!行数\n";
fileContent += "0.0 0.5\n";
fileContent += "10.0 0.48\n";
fileContent += "20.0 0.46\n";
fileContent += "30.0 0.44\n";
fileContent += "40.0 0.42\n";
fileContent += "50.0 0.40\n";
fileContent += "60.0 0.38\n";
fileContent += "70.0 0.36\n";
fileContent += "80.0 0.34\n";
fileContent += "90.0 0.32\n";
fileContent += "100.0 0.30\n";
fileContent += "150.0 0.25\n";
fileContent += "200.0 0.20\n";

// 写入阻力系数表文件
var fs = require("fs");
if (fs.existsSync(dragFile)) {
    fs.unlinkSync(dragFile);
}
fs.writeFileSync(dragFile, fileContent);

// 设置计算时步
dyna.Set("Time_Step 1e-4");

// 求解至稳定（30000步）
dyna.Solve(30000);
