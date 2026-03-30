setCurDir(getSrcDir());

// 初始化CDyna仿真环境
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 200");
dyna.Set("Monitor_Iter 10");
dyna.Set("Contact_Detect_Tol 1e-5");
dyna.Set("If_Contact_Use_FaceMat 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("If_Virtural_Mass 0");

// 导入矿石样本网格数据
blkdyn.ImportGrid("gid", "ore.msh");

// 创建接触面设置
blkdyn.CrtIFace(2, 2);
blkdyn.CrtBoundIFaceByCoord(-1e5, 1e5, 0.0479, 0.0501, -1e5, 1e5);
blkdyn.UpdateIFaceMesh();

// 设置块体本构模型为线弹性
blkdyn.SetModel("linear");

// 定义岩石材料力学参数（密度、弹性模量、泊松比、粘聚力、内摩擦角）
blkdyn.SetMatByGroupRange(2500, 5e10, 0.25, 15e6, 10e6, 40.0, 10.0, 2, 2);
blkdyn.SetMatByGroupRange(2700, 6e10, 0.28, 20e6, 12e6, 45.0, 12.0, 1, 1);

// 设置接触面模型为断裂能模型以支持非连续变形与破裂演化
blkdyn.SetIModel("FracE");
blkdyn.SetIModelByCoord("brittleMC", -1e5, 1e5, 0.0499, 0.0501, -1e5, 1e5);

// 指定接触面基础材料参数（刚度、强度）
blkdyn.SetIMat(1e13, 1e13, 40.0, 15e6, 10e6);
blkdyn.SetIMatByCoord(1e13, 1e13, 5.0, 0.0, 0.0, -1e5, 1e5, 0.0499, 0.0501, -1e5, 1e5);

// 设置接触面断裂能参数
blkdyn.SetIFracEnergyByGroupInterface(100, 1000, 1, 1);

// 设置底部固定边界条件
blkdyn.SetBC("fix", -1e5, 1e5, 0.0, -1e5, 1e5, 0.0, 0, 2);

// 设置顶部压缩位移加载边界条件
blkdyn.SetBC("disp", -1e5, 1e5, 0.0, -1e5, 1e5, 0.0, 1, 3);

// 初始化动态边界条件模拟冲击压力波传播
blkdyn.SetDynamicBC(1e6, 0.01, 0.0, 0.0, 0.0, 0.0);

// 设置监测点追踪节点位移、应力分布及损伤因子演化
dyna.Monitor("block", "xdis", 1.0, 1.0, 1.0);
dyna.Monitor("gvalue", "gv_block_strain_energy");
dyna.Monitor("gvalue", "gv_block_kinetic_energy");
dyna.Monitor("gvalue", "gv_block_crack_ratio");
dyna.Monitor("gvalue", "gv_block_broken_ratio");

// 配置输出设置记录能量平衡数据
blkdyn.SetOutputEnergy(1);
blkdyn.SetOutputStress(1);
blkdyn.SetOutputDamage(1);

// 调用核心求解函数计算岩石在压缩载荷下的渐进破坏与散体运动过程
blkdyn.Solve();

// 导出仿真结果包括位移场、裂纹分布图及能量平衡数据
doc.ExportResult("result_ore_impact.dat");
