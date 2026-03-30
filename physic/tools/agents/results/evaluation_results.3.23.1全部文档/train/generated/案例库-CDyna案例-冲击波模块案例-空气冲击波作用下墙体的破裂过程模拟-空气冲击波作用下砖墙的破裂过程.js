setCurDir(getSrcDir());

// 清除所有现有数据
igeo.clear();
imesh.clear();
dyna.Clear();
doc.ClearResult();

// ==================== 全局计算参数设置 ====================
dyna.Set("Output_Interval 100");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Interface_Soften_Value 3e-3 3e-3");
dyna.Set("Solid_Cal_Mode 2");
dyna.Set("Time_Step 2e-6");

// ==================== 导入砖墙网格模型 ====================
blkdyn.ImportGrid("ansys", "bricks.dat");
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// ==================== 设置材料属性参数 ====================
// 砖墙材料：密度、弹性模量、泊松比、剪切模量、杨氏模量等
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 3e10, 0.25, 6e6, 5e6, 35, 15);

// 接触面本构模型设置
blkdyn.SetIModel("SSMC");
blkdyn.SetIMat(1e12, 1e12, 35, 6e6, 5e6);

// ==================== 设置冲击波区域网格 ====================
skwave.DefMesh(3, [3, 3, 2], [50, 60, 50], [-0.2, -0.5, -1]);
skwave.InheritSolid();

// ==================== 设置固体边界区域 ====================
skwave.SetSolid(1, -5, 5, -5, 0.2, -5, 5);

// ==================== 初始化冲击波源参数 ====================
// 初始状态：压力、密度、坐标范围、衰减指数
skwave.InitBySphere(1.01e5, 1.02, [0, 0, 0], [0, 0, 0], 1000.0);

// 炸药爆炸点及冲击波参数
skwave.InitBySphere(1e9, 1000, [0, 0, 0], [1.14, 1.0, 0.5], 0.3);

// ==================== 设置边界约束条件 ====================
// 固定墙体底部（Y方向）
blkdyn.FixV("xyz", 0.0, "y", -1e-2, 1e-2);
blkdyn.FixV("xyz", 0.0, "y", 2.01, 2.02);

// 固定墙体两侧（X方向）
blkdyn.FixV("xyz", 0.0, "x", -1e-2, 1e-2);
blkdyn.FixV("xyz", 0.0, "x", 2.27, 2.29);

// ==================== 设置冲击波动态载荷条件 ====================
// 等效TNT质量、爆炸点坐标、起爆时间、声速、衰减指数、坐标范围
blkdyn.ApplyShockWaveByCoord(100.0, [5, 2, 3], 0, 340, 1.0, 0.299, 9.701, -1, 3.81, 0.299, 5.701);

// ==================== 设置监测变量输出路径 ====================
// 监测空气压力、密度、流速等时空演化规律
dyna.Monitor("skwave", "sw_pp", 1, 5, 0);
dyna.Monitor("skwave", "sw_pp", 2, 5, 0);
dyna.Monitor("skwave", "sw_dens", 1, 5, 0);
dyna.Monitor("skwave", "sw_dens", 2, 5, 0);

// ==================== 执行求解计算 ====================
dyna.DynaCycle(0.1);

print("求解完毕");
