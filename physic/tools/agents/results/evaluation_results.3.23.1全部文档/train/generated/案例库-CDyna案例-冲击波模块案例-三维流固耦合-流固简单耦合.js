setCurDir(getSrcDir());

// 初始化仿真环境
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0 0 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Interface_Soften_Value 3e-3 3e-3");
dyna.Set("Solid_Cal_Mode 2");

// 激活冲击波模块（全局开关量 SK_GasModel = 2）
dyna.Set("SK_GasModel 2");

// 清除现有数据
dyna.Clear();
doc.clearResult();

// 设置计算时间步
dyna.Set("Time_Step 2e-6");

// 定义三维流体计算域正交网格（19m×11m×4.7m，每个方向分割数分别为160、90、35）
skwave.DefMesh(3, [19.0, 11.0, 4.7], [160, 90, 35], [-0.4, -0.5, -0.6]);

// 继承固体边界（将固体区域标记为流体域中的固体边界）
skwave.InheritSolid();

// 设置固体区域（类型1表示固体，坐标范围定义固体边界）
skwave.SetSolid(1, -5, 5, -5, 0.2, -5, 5);

// 初始化未燃烧气体（空气：密度1.01e5 Pa，绝热指数1.02，声速340 m/s）
skwave.InitBySphere(1.01e5, 1.02, [0, 0, 0], [0, 0, 0], 1000.0);

// 初始化炸药（密度1e9 kg/m³，质量1000 kg，起爆点坐标[8.95, 3.3, 2.0]）
skwave.InitBySphere(1e9, 1000, [0, 0, 0], [8.95, 3.3, 2.0], 0.3);

// 设置固体材料参数（密度、弹性模量、泊松比、屈服强度等）
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 3e10, 0.25, 6e6, 5e6, 35, 15);

// 设置接触面本构模型
blkdyn.SetIModel("SSMC");
blkdyn.SetIMat(1e12, 1e12, 35, 6e6, 5e6);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.01);

// 固定固体底面位移（约束Y方向）
blkdyn.FixV("xyz", 0.0, "y", -1e-2, 1e-2);
blkdyn.FixV("xyz", 0.0, "y", 2.11, 2.13);

// 固定固体侧面位移（约束X方向）
blkdyn.FixV("xyz", 0.0, "x", -1e-2, 1e-2);
blkdyn.FixV("xyz", 0.0, "x", 2.51, 2.53);

// 设置监测信息：流体压力、流速、温度等
dyna.Monitor("skwave", "sw_pp", 0, 0, 0);
dyna.Monitor("skwave", "sw_xvel", 0, 0, 0);
dyna.Monitor("skwave", "sw_yvel", 0, 0, 0);
dyna.Monitor("skwave", "sw_zvel", 0, 0, 0);
dyna.Monitor("skwave", "sw_temp", 0, 0, 0);

// 设置固体结构响应监测（位移、应力）
dyna.Monitor("block", "ydis", -5, 5, 0);
dyna.Monitor("block", "xstress", -5, 5, 0);

// 执行计算（计算时间0.1秒）
dyna.DynaCycle(0.1);

print("求解完成");
