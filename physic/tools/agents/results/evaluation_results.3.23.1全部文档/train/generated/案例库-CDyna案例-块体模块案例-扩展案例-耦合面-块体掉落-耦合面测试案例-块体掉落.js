setCurDir(getSrcDir());

// 初始化仿真环境参数
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Contact_Detect_Tol 1e-4");
dyna.Set("If_Cal_EE_Contact 1");

// 导入或生成块体网格几何模型
blkdyn.ImportGrid("gid", "BlockDropModel.msh");

// 设置块体材料模型为线性弹性
blkdyn.SetModel("linear");

// 设置块体材料参数：密度、弹性模量、泊松比、抗拉强度、抗压强度、内摩擦角、粘聚力
blkdyn.SetMat(2500, 3e9, 0.25, 1e4, 1e4, 15, 15);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.01);

// 创建耦合面（用于块体间接触）
trff.CrtFace(2, 100);

// 设置耦合面模型为脆性断裂模型
trff.SetModel("brittleMC");

// 设置耦合面材料参数：法向刚度、切向刚度、内摩擦角、粘聚力、抗拉强度、阻尼系数
trff.SetMat(1e9, 1e9, 20, 0, 0, 1e8);

// 设置重力加速度边界条件（Y方向向下）
dyna.Set("Gravity 0 -9.8 0");

// 固定底部区域约束
blkdyn.FixVByGroupInterface("xyz", 0.0, 1, 1);

// 创建监测点：追踪位移、应力及损伤因子
dyna.Monitor("block", "xdis", 1.0, 1.0, 1.0);
dyna.Monitor("block", "ydis", 1.0, 1.0, 1.0);
dyna.Monitor("block", "zdis", 1.0, 1.0, 1.0);
dyna.Monitor("gvalue", "gv_block_broken_ratio");
dyna.Monitor("gvalue", "gv_block_crack_ratio");
dyna.Monitor("gvalue", "gv_block_strong_damage_ratio");

// 监测接触面力
dyna.Monitor("rdface", "rg_bxForce", 1, 10, 1);

// 设置时间步长控制参数
dyna.TimeStepCorrect(0.8);

// 检查模型完整性
blkdyn.GetMesh(blkdyn);

// 执行求解并保存结果
dyna.Solve();
