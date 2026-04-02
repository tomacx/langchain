// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

// 设置输出的间隔为500步
dyna.Set("Output_Interval 1000");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 耦合刚度采用全局的值，脆断模型
dyna.Set("If_Contact_Use_GlobMat 1 3 2e8 2e8 0 0 5.0");

// 颗粒与块体单元间的接触搜索采用高级模式
dyna.Set("If_Search_PBContact_Adavance 1");

// 设置三个方向的重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置接触容差为0.001m
dyna.Set("Contact_Detect_Tol 1e-3");

// 执行计算前，是否自动修正接触容差，1-修正。
dyna.Set("If_ContTol_Auto_C 1");

// 设置颗粒的计算模式为4---mpm
dyna.Set("Particle_Cal_Type 4");

// 常规FEM
dyna.Set("MPM_Cal_Mode 2");

// 是否计算接触更新，1-计算。
dyna.Set("If_Renew_Contact 1");

// 块体、颗粒接触搜索模式。九宫格法
dyna.Set("Contact_Search_Method 1");

// 导入GiD格式的巷道网格文件
blkdyn.ImportGrid("gmsh", "example.msh");

// 创建接触面并更新接触面网格
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置实体单元为线弹性模型
blkdyn.SetModel("linear");

// 设置固体单元的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 30.0, 0.8);

// 设置所有接触面的本构为脆性断裂的Mohr-Coulomb本构
blkdyn.SetIModel("brittleMC");

// 设定接触面上的材料，依次为单位面积法向刚度、单位面积切向刚度、内摩擦角、粘聚力、抗拉强度
blkdyn.SetIStiffByElem(10.0);
blkdyn.SetIStrengthByElem();

// 设置局部阻尼为0.2
blkdyn.SetLocalDamp(0.8);

// 监测y方向应力
dyna.Monitor("block", "syy", 0,     0.15, 0);
dyna.Monitor("block", "syy", 0.05,  0.15, 0);
dyna.Monitor("block", "syy", 0.075, 0.15, 0);
dyna.Monitor("block", "syy", 0.1,   0.15, 0);
dyna.Monitor("block", "syy", 0.15,  0.15, 0);

// 底部5个点
dyna.Monitor("block", "syy", 0,     0.0, 0);
dyna.Monitor("block", "syy", 0.05,  0.0, 0);
dyna.Monitor("block", "syy", 0.075, 0.0, 0);
dyna.Monitor("block", "syy", 0.1,   0.0, 0);
dyna.Monitor("block", "syy", 0.15,  0.0, 0);

// 计算3万步
dyna.Solve(30000);
