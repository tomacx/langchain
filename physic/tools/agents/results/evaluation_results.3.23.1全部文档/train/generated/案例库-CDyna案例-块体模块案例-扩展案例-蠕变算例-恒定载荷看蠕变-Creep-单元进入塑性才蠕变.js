setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();

doc.clearResult();
dyna.Clear();

// 创建几何体：1x1x0.5的长方体
igeo.genRectS(0, 0, 0, 1, 0.1, 0, 0.05, 1);

imeshing.genMeshByGmsh(2);

// 设置蠕变计算相关参数
dyna.Set("Creep_Cal 1");
dyna.Set("Creep_G_Inherit 1");
dyna.Set("Auto_Creep_Time 0");
dyna.Set("Elem_Plastic_Cal_Creep 1"); // 仅当单元进入塑性状态时才计算蠕变

// 设置输出和求解控制参数
dyna.Set("Output_Interval 500");
dyna.Set("Gravity 0 0 0");
dyna.Set("Large_Displace 0");

// 将平台网格读入dyna内核
blkdyn.GetMesh(imeshing);

// 设置块体单元本构模型为Burger模型（支持蠕变）
blkdyn.SetModel("burger");

// 设置基础材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼
blkdyn.SetMat(2000, 3e9, 0.3, 8e6, 5e6, 30, 10);

// 设置全局蠕变材料参数：马克斯韦尔体粘度、马克斯韦尔体剪切模量、开尔文体粘度、开尔文体剪切模量
blkdyn.SetCreepMat(1, 3e12, 3e9, 1e11, 3e9);

// 将蠕变材料号与块体单元组进行关联绑定
blkdyn.BindCreepMat(1, 1, 1);

// 固定左侧面（X方向位移约束）
blkdyn.FixV("x", 0.0, "x", -0.01, 0.001);

// 设置施加的恒定载荷：1MPa的面力
var values = new Array(1e6, 0, 0);

// 设置9个变化梯度（均匀分布）
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);

// 在X方向右侧面施加面力
blkdyn.ApplyConditionByCoord("face_force", values, gradient, 0.999, 1.01, -1, 1, -1, 1, false);

// 设置监测点：X方向位移（沿长度方向）
dyna.Monitor("block", "xdis", 0.2, 0, 0);
dyna.Monitor("block", "xdis", 0.4, 0, 0);
dyna.Monitor("block", "xdis", 0.6, 0, 0);
dyna.Monitor("block", "xdis", 0.8, 0, 0);
dyna.Monitor("block", "xdis", 1.0, 0, 0);

// 设置监测点：X方向应力（沿长度方向）
dyna.Monitor("block", "sxx", 0.2, 0, 0);
dyna.Monitor("block", "sxx", 0.4, 0, 0);
dyna.Monitor("block", "sxx", 0.6, 0, 0);
dyna.Monitor("block", "sxx", 0.8, 0, 0);
dyna.Monitor("block", "sxx", 1.0, 0, 0);

// 设置时间步长（根据蠕变过程调整）
dyna.Set("Time_Step 36.0");

// 执行求解
dyna.Solve(50000);
