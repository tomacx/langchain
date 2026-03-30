setCurDir(getSrcDir());

// 初始化计算环境
dyna.Clear();
doc.clearResult();

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置重力加速度为0（霍普金森杆实验通常在无重力环境下）
dyna.Set("Gravity 0.0 0.0 0.0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置结果输出间隔
dyna.Set("Output_Interval 500");

// 设置监测信息输出时步
dyna.Set("Monitor_Iter 10");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 打开接触更新开关
dyna.Set("If_Renew_Contact 1");

// 设置接触容差
dyna.Set("Contact_Detect_Tol 1e-5");

// 设置使用面材料定义接触
dyna.Set("If_Contact_Use_FaceMat 1");

// ==================== 几何建模 ====================
// 清除Mesh模块几何数据
igeo.clear();

// 清除imeshing网格数据
imeshing.clear();

// 创建霍普金森杆（striker）- 圆柱形杆件
var strikerLoop = igeo.genCylinder(0, 0, 0, 0.05, 1.0, 0); // 半径0.05m，长度1.0m

// 创建岩体试样（立方体）
var rockLoop = igeo.genRect(1.05, -0.25, 0, 1.25, 0.25, 0); // 位置在杆端右侧

// 生成面
igeo.genSurface([strikerLoop], 1); // 杆件表面
igeo.genSurface([rockLoop], 2);    // 岩体表面

// 生成三维网格
imeshing.genMeshByGmsh(3);

// BlockDyna从平台下载网格
blkdyn.GetMesh(imeshing);

// ==================== 接触面设置 ====================
// 对杆件与岩体接触面进行切割，设置为接触面
blkdyn.CrtIFace(1);

// 更新网格信息
blkdyn.UpdateIFaceMesh();

// ==================== 材料参数设置 ====================
// 设置块体模型为线弹性（用于钢材）
blkdyn.SetModel("linear");

// 设置杆件（组1）材料参数：密度、杨氏模量、泊松比、屈服强度、抗拉强度、内摩擦角、粘聚力
blkdyn.SetMatByGroupRange(7800, 2.1e11, 0.3, 500e6, 500e6, 0.0, 0.0, 1, 1);

// 设置岩体（组2）材料参数：密度、杨氏模量、泊松比、屈服强度、抗拉强度、内摩擦角、粘聚力
blkdyn.SetMatByGroupRange(2650, 3e10, 0.25, 10e6, 5e6, 40.0, 10.0, 2, 2);

// ==================== 接触面本构设置 ====================
// 将接触面模型设定为脆性断裂Mohr-Coulomb本构
blkdyn.SetIModel("brittleMC");

// 指定所有接触面的基础材料参数：法向刚度、切向刚度、内摩擦角、粘聚力、抗拉强度
blkdyn.SetIMat(1e13, 1e13, 40.0, 15e6, 10e6);

// ==================== 边界条件设置 ====================
// 固定岩体远端边界（x方向）
blkdyn.FixV("xy", 1.25, "x", -0.001, 0.001);

// 固定杆件远端（防止整体刚体运动）
blkdyn.FixV("xy", 0.0, "x", -0.001, 0.001);

// ==================== 初始条件设置 ====================
// 施加striker杆初始撞击速度（沿X方向，-50 m/s表示向左撞击）
blkdyn.InitConditionByCoord("velocity", [7800, 2.1e11, 0.3, 500e6, 500e6, 0.0, 0.0],
                           -50.0, 0.0, 0.0, 0.0, 0.0, 0.0);

// ==================== 监测设置 ====================
// 监测与指定点最近的节点的x方向位移
dyna.Monitor("block", "xdis", 1.05, -0.25, 0.0);

// 监测系统断裂度（损伤因子）
dyna.Monitor("gvalue", "gv_block_crack_ratio");

// 监测块体等效破裂体积
dyna.Monitor("gvalue", "gv_block_equiv_frac_volume");

// 监测接触面总变形能
dyna.Monitor("gvalue", "gv_contact_strain_energy");

// ==================== 求解设置 ====================
// 设置虚拟时步（用于显式动力学）
dyna.Set("Virtural_Step 0.5");

// 执行核心求解函数调用，计算时长100微秒（霍普金森杆典型撞击时间）
dyna.Solve(100);
