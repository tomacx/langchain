setCurDir(getSrcDir());

// 初始化计算开关
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 0.0 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 100");
dyna.Set("Monitor_Iter 10");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("If_Renew_Contact 1");
dyna.Set("If_Cal_Rayleigh 1");

// 导入Gmsh网格模型
blkdyn.ImportGrid("gid", "surface.msh");

// 创建结构面界面连接炸药与岩体（-1,-1表示所有组间离散）
blkdyn.CrtIFace(-1, -1);

// 更新接触面网格信息
blkdyn.UpdateIFaceMesh();

// 设置炸药组（组2）为本构为JWL爆源模型
blkdyn.SetModel("Landau", 2);

// 设置岩体组（组1）为本构为线弹性本构
blkdyn.SetModel("linear", 1);

// 设置炸药与岩体的材料参数（密度、弹性模量、泊松比、抗拉强度、抗压强度、粘聚力、内摩擦角、单元数范围）
blkdyn.SetMatByGroupRange(2500, 5e10, 0.25, 15e6, 10e6, 40.0, 10.0, 1, 100);

// 设置接触面模型为断裂能模型
blkdyn.SetIModel("brittleMC");

// 设置软弱夹层参数（弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角）
blkdyn.SetIMat(5e10, 20.0, 1e5, 1e5);

// 设置岩块与爆炸气体参数
blkdyn.SetIMat(1e13, 1e13, 0, 0, 0, 1, 14);

// 设置JWL炸药参数（材料序号、爆速、爆压、爆温、反应系数、状态方程系数、装药位置、密度等）
var apos = [5.0, 4.8, 0.0];
blkdyn.SetLandauSource(1, 115, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 0.0, 15e-3);

// 绑定炸药源到指定组
blkdyn.BindLandauSource(1, 2, 1);

// 设置监测与指定点最近的节点的冲击波压力（sw_pp）
dyna.Monitor("skwave", "sw_pp", 1.0, 1.0, 1.0);

// 设置监测与指定点最近的节点的X方向位移（xdis）
dyna.Monitor("block", "xdis", 5.0, 4.8, 0.0);

// 监测块体系统的总应变能
dyna.Monitor("gvalue", "gv_block_strain_energy");

// 监测块体系统的总动能
dyna.Monitor("gvalue", "gv_block_kinetic_energy");

// 监测块体强损伤区体积占比
dyna.Monitor("gvalue", "gv_block_strong_damage_ratio");

// 设置局部阻尼为0.0
blkdyn.SetLocalDamp(0.0);

// 设置瑞利阻尼系数（刚度阻尼系数、质量阻尼系数）
blkdyn.SetRayleighDamp(1e-7, 0.0);

// 调用核心求解函数启动计算
blkdyn.Solve();
