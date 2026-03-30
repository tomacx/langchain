setCurDir(getSrcDir());

// 初始化输出设置
dyna.Set("Output_Interval 1000");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("GiD_Out 1");
dyna.Set("If_Search_PBContact_Adavance 1");

// 设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置接触容差
dyna.Set("Contact_Detect_Tol 5e-3");

// 导入块体网格（边坡主体）
blkdyn.ImportGrid("gid", "blockmesh2.msh");

// 创建刚性面边界
blkdyn.CrtBoundIFaceByCoord(-1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 更新界面网格
blkdyn.UpdateIFaceMesh();

// 设置块体模型为线性弹性
blkdyn.SetModel("linear");

// 设置块体材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角
blkdyn.SetMat(2500, 1e9, 0.25, 3e6, 1e6, 45, 15);

// 设置块体界面模型为线性
blkdyn.SetIModel("linear");

// 设置块体界面材料参数
blkdyn.SetIMat(1e10, 1e10, 35, 1e6, 1e6);

// 导入刚性面边界
rdface.Import("gid", "bound.msh");

// 导入颗粒网格（土石混合体中的土体部分）
pdyna.Import("gid", "parmesh2.msh");

// 设置颗粒模型为线性弹性
pdyna.SetModel("linear");

// 设置颗粒材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数
pdyna.SetMat(2500, 1e8, 0.25, 1e4, 1e4, 20, 0.8, 0.0);

// 关闭虚拟质量计算
dyna.Set("If_Virtural_Mass 0");

// 设置块体界面模型为脆性断裂 Mohr-Coulomb 模型
blkdyn.SetIModel("brittleMC");

// 设置颗粒模型为脆性断裂 Mohr-Coulomb 模型
pdyna.SetModel("brittleMC");

// 设置局部阻尼
blkdyn.SetLocalDamp(0.01);
pdyna.SetSingleMat("LocalDamp", 0.01);

// 设置动态计算时步为 1e-4 秒
dyna.TimeStepCorrect(0.8);

// 在节理位置设置用户自定义变量 UDM_P 用于监测应力演化
blkdyn.SetUDMByCoord("UDM_P", [20, 15, 0], 1e6);
blkdyn.SetUDMByCoord("UDM_P", [25, 15, 0], 1e6);

// 配置监测点跟踪位移和能量等关键物理量
dyna.Monitor("block", "xdis", 10, 10, 0);
dyna.Monitor("block", "xdis", 14.2, 16.3, 0);
dyna.Monitor("block", "xdis", 20, 25, 0);

// 监测块体系统的断裂度
dyna.Monitor("gvalue", "gv_spring_crack_ratio");

// 监测块体总破坏度
dyna.Monitor("gvalue", "gv_block_broken_ratio");

// 监测接触面总变形能
dyna.Monitor("gvalue", "gv_contact_strain_energy");

// 求解动力学分析（计算 10 万步）
dyna.Solve(100000);

print("边坡失稳破坏仿真完成！");
