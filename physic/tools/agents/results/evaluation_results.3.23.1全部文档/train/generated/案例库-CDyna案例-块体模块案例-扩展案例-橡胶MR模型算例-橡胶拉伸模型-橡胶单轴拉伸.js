setCurDir(getSrcDir());

// 清除核心模块及结果文件
dyna.Clear();
doc.clearResult();

// 大变形开关
dyna.Set("Large_Displace 1");

// 输出间隔
dyna.Set("Output_Interval 500");

// 虚拟质量开关（橡胶材料需要）
dyna.Set("If_Virtural_Mass 1");

// 重力加速度
dyna.Set("Gravity 0 0 0");

// 虚拟时步设置
dyna.Set("Virtural_Step 0.5");

// 创建单轴拉伸试件（长方体：长0.1m×宽0.01m×高0.01m，20×2×2单元）
blkdyn.GenBrick3D(0.1, 0.01, 0.01, 20, 2, 2, 1);

// 设置单元本构模型为MR（橡胶模型）
blkdyn.SetModel("MR");

// 设置基础材料参数：密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角、组号
blkdyn.SetMat(1100, 2e7, 0.485, 1e6, 1e6, 35, 15);

// 设置MR模型材料参数（11个参数：C10~C03、D、μ）
// C10=0.8073MPa, C01=0.1689MPa, D=100MPa, μ=0.0
var MRMat = [0.8073, 0.1689, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 100.0, 0.0];
blkdyn.SetMRMat(1, MRMat);

// 关联MR材料参数到单元组
blkdyn.BindMRMat(1, 1, 100);

// 左侧固定边界条件（X方向法向约束）
blkdyn.FixV("x", 0, "x", -0.0001, 0.0001);

// 右侧施加准静态拉伸速度载荷（X方向）
blkdyn.FixV("x", 1e-9, "x", 0.099, 0.101);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.2);

// 监测X方向正应变（多个测点）
dyna.Monitor("block", "soxx", 0.04, 0.0125, 0.0);
dyna.Monitor("block", "soxx", 0.05, 0.0125, 0.0);
dyna.Monitor("block", "soxx", 0.06, 0.0125, 0.0);

// 监测X方向正应力（多个测点）
dyna.Monitor("block", "sxx", 0.04, 0.0125, 0.0);
dyna.Monitor("block", "sxx", 0.05, 0.0125, 0.0);
dyna.Monitor("block", "sxx", 0.06, 0.0125, 0.0);

// 监测静水压力（内置变量P）
dyna.Monitor("block", "General_P5", 0.04, 0.0125, 0.0);
dyna.Monitor("block", "General_P5", 0.05, 0.0125, 0.0);
dyna.Monitor("block", "General_P5", 0.06, 0.0125, 0.0);

// 执行求解（根据加载速度，约需14万步完成拉伸）
dyna.Solve(140000);
