//设置工作路径为JS脚本所在路径
setCurDir(getSrcDir());

//关闭虚拟质量计算开关
dyna.Set("If_Virtural_Mass 0");

//云图输出间隔设定为500
dyna.Set("Output_Interval 500");

////创建单个颗粒，直径1cm
pdyna. SingleCreate(1, 2, 5e-3, 0, 200, 0);

//脆断模型
pdyna.SetModel("brittleMC");

//密度 弹模 泊松比 抗拉强度 粘聚力 内摩擦角 局部阻尼系数 粘性阻尼系数
pdyna.SetMat(16930, 4.1e11, 0.2, 0, 0, 30, 0.0, 0.0);

//初始化速度为-100m/s
pdyna.InitCondByGroup ("velocity", [0, -100, 0], 1,100);

//设置速度监测点
dyna.Monitor("particle", "pa_yvel", 0, 200, 0);

//设置位移监测点
dyna.Monitor("particle", "pa_ydis", 0, 200, 0);

//1-传统颗粒流； 2-PCMM 颗粒； 3-带阻力的飞行颗粒（不进行接触更新计算）
dyna.Set("Particle_Cal_Type 3");

//设置飞行参数，空气密度，地面高程
//空气阻力模式（1-常阻力，2-马赫阻力，3-雷诺阻力, 4-用户自定义阻力）
//阻力参数（1时为阻力系数，2为声速，3为动力粘度, 4-文件名）
pfly.SetFlyPara( 1.069, -2, 4, "自定义阻力系数.txt");

///设置计算时步
dyna.Set("Time_Step 1e-4");

//求解至稳定
dyna.Solve();