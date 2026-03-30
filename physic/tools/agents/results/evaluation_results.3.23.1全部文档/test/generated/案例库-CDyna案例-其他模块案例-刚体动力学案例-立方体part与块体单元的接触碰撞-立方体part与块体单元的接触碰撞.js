setCurDir(getSrcDir());

// 初始化求解器环境
dyna.Clear();
imeshing.clear();

// ==================== 求解器参数设置 ====================
dyna.Set("Time_Step 1e-3");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Output_Interval 500");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Renew_Interval 100");
dyna.Set("Contact_Detect_Tol 1e-3");
dyna.Set("SaveFile_Out 1");

// ==================== 重力与初始条件 ====================
dyna.Set("Gravity 0 -9.8 0");

// ==================== 创建块体单元网格 ====================
blkdyn.GenBrick3D(1, 1, 1, 1, 1, 1, 1);

// 设置块体边界为接触面
blkdyn.CrtBoundIFaceByGroup(1);
blkdyn.UpdateIFaceMesh();

// 设置块体模型为本构类型
blkdyn.SetModel("linear");

// 设置块体材料参数：密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角
blkdyn.SetMat(2500, 1e9, 0.3, 1e6, 1e6, 15, 10);

// 设置块体局部阻尼
blkdyn.SetLocalDamp(0.01);

// ==================== 创建刚体部件 ====================
rdface.Import("ansys", "rdfacemodel.dat");
var partId = rdface.CrtPart("cube_part", 6, 8);

// 设置刚体部件属性：密度、质心坐标、惯性张量
rdface.SetPartProp(8900, [0.5, 0.5, 0.5], [1e5, 1e5, 1e5, 0, 0, 0], "cube_part");

// ==================== 设置刚体局部阻尼 ====================
rdface.SetPartLocalDamp(0.02, 0.02);

// ==================== 接触面设置 ====================
blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(1e9, 1e9, 25.0, 0.0, 0.0);

// ==================== 边界条件 ====================
blkdyn.FixV("xy", 0.0, "y", -1e10, 1e10);

// ==================== 初始碰撞速度设置 ====================
var x = new Array(-1e10, 1e10);
var y = new Array(-1e10, 1e10);
var z = new Array(-1e10, 1e10);

blkdyn.SetV("x", 5.0, x[0], x[1], y[0], y[1], z[0], z[1]);

// ==================== 监测设置 ====================
// 监测刚体部件的Z方向位移
dyna.Monitor("rdface", "rg_PartDisZ", partId, 0, 0);

// 监测块体关键节点的X方向位移
dyna.Monitor("block", "xdis", 1.0, 1.0, 1.0);

// 监测接触面平均接触力（组号1-10）
dyna.Monitor("rdface", "rg_bxForce", 1, 10, 1);

// 监测系统断裂度
dyna.Monitor("gvalue", "gv_block_crack_ratio");

// ==================== 求解器收敛控制 ====================
dyna.TimeStepCorrect(0.2);

// ==================== 启动求解 ====================
dyna.Solve(100000);
