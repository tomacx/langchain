setCurDir(getSrcDir());

// 初始化环境配置
dyna.Set("Mechanic_Cal 1");
dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0 0.0 0");
dyna.Set("Large_Displace 0");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.5");
dyna.Set("Output_Interval 1000");
dyna.Set("Moniter_Iter 100");
dyna.Set("Contact_Detect_Tol 0.0");

// 导入网格文件（纯砂浆试件几何）
blkdyn.ImportGrid("gmsh", "mortar_test.msh");

// 创建接触界面并更新网格
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置块体单元为线弹性模型
blkdyn.SetModel("linear");

// 设置砂浆材料参数：密度、弹性模量、泊松比、抗拉强度、抗压强度、内摩擦角、粘聚力
blkdyn.SetMatByGroup(2000, 3e10, 0.25, 1e6, 3e6, 30.0, 10.0, 1);

// 设定接触面本构为脆性断裂Mohr-Coulomb模型
blkdyn.SetIModel("brittleMC");

// 设置接触面单位面积法向刚度
blkdyn.SetIStiffByElem(10.0);

// 设置局部阻尼系数
blkdyn.SetLocalDamp(0.2);

// 固定底部边界条件（Y方向约束）
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// 设置监测点：顶部区域应力监测
dyna.Monitor("block", "syy", 0, 0.15, 0);
dyna.Monitor("block", "syy", 0.05, 0.15, 0);
dyna.Monitor("block", "syy", 0.075, 0.15, 0);
dyna.Monitor("block", "syy", 0.1, 0.15, 0);
dyna.Monitor("block", "syy", 0.15, 0.15, 0);

// 设置监测点：底部区域应力监测
dyna.Monitor("block", "syy", 0, 0.0, 0);
dyna.Monitor("block", "syy", 0.05, 0.0, 0);
dyna.Monitor("block", "syy", 0.1, 0.0, 0);

// 设置监测点：中部区域位移监测
dyna.Monitor("block", "ydis", 0.075, 0.075, 0);
dyna.Monitor("block", "ydis", 0.075, 0.125, 0);

// 执行动态分析计算（10000步）
dyna.DynaCycle(10000);
