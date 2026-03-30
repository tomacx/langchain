setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();

doc.clearResult();
dyna.Clear();

// 创建几何模型：长方体块体
igeo.genRectS(0, 0, 0, 1, 0.1, 0, 0.05, 1);

// 网格划分
imeshing.genMeshByGmsh(2);

// 设置求解器参数
dyna.Set("Creep_Cal 1");
dyna.Set("Creep_G_Inherit 1");
dyna.Set("Auto_Creep_Time 0");
dyna.Set("Elem_Plastic_Cal_Creep 0");
dyna.Set("Output_Interval 500");
dyna.Set("Gravity 0 0 0");
dyna.Set("Large_Displace 0");

// 将平台网格读入dyna内核
blkdyn.GetMesh(imeshing);

// 设置材料模型为Burger模型（蠕变模型）
blkdyn.SetModel("burger");

// 设置基础材料参数：密度、弹性模量、泊松比、抗拉强度、抗压强度、粘聚力、内摩擦角
blkdyn.SetMat(2000, 3e9, 0.3, 8e6, 5e6, 30, 10);

// 设置全局蠕变材料参数：马克斯韦尔体粘度、马克斯韦尔体剪切模量、开尔文体粘度、开尔文体剪切模量
blkdyn.SetCreepMat(1, 3e12, 3e9, 1e11, 3e9);

// 将蠕变材料ID=1与单元组1-1进行关联
blkdyn.BindCreepMat(1, 1, 1);

// 设置边界条件：固定X方向位移（松弛测试需要约束）
blkdyn.FixV("x", 0.0, "x", -0.01, 0.001);
blkdyn.FixV("x", 0.0, "x", 0.999, 1.01);

// 设置初始应力状态：X方向施加1MPa拉应力用于松弛测试
var values = new Array(1e6, 0, 0);
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
blkdyn.InitConditionByCoord("stress", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 设置监测点：监测X方向位移和X方向应力
dyna.Monitor("block", "xdis", 0.0, 0, 0);
dyna.Monitor("block", "xdis", 0.2, 0, 0);
dyna.Monitor("block", "xdis", 0.4, 0, 0);
dyna.Monitor("block", "xdis", 0.6, 0, 0);
dyna.Monitor("block", "xdis", 0.8, 0, 0);
dyna.Monitor("block", "xdis", 1.0, 0, 0);

dyna.Monitor("block", "sxx", 0.0, 0, 0);
dyna.Monitor("block", "sxx", 0.2, 0, 0);
dyna.Monitor("block", "sxx", 0.4, 0, 0);
dyna.Monitor("block", "sxx", 0.6, 0, 0);
dyna.Monitor("block", "sxx", 0.8, 0, 0);
dyna.Monitor("block", "sxx", 1.0, 0, 0);

// 设置时间步长（根据松弛过程调整）
dyna.Set("Time_Step 0.1");

// 执行求解：50000个时间步，覆盖完整松弛周期
dyna.Solve(50000);
