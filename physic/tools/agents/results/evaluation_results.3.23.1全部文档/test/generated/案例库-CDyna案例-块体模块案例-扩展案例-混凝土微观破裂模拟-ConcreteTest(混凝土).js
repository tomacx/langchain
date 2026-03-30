setCurDir(getSrcDir());

// 初始化与力学开关
dyna.Set("Mechanic_Cal 1");
dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0 0.0 0");
dyna.Set("Large_Displace 0");
dyna.Set("If_Renew_Contact 0");
dyna.Set("Output_Interval 500");
dyna.Set("Moniter_Iter 100");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.5");
dyna.Set("Contact_Detect_Tol 0.0");

// 导入或创建混凝土试样网格（150mm立方体）
blkdyn.ImportGrid("gmsh", "concrete.msh");

// 创建接触面并更新网格
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置实体单元为线弹性模型
blkdyn.SetModel("linear");

// 设置混凝土材料参数：密度、弹性模量、泊松比、抗拉强度、抗压强度等
blkdyn.SetMatByGroup(2500, 3e10, 0.2, 10e6, 40e6, 30.0, 10.0, 1);

// 设置边界条件：底部固定，顶部加载
blkdyn.FixV("xy", 0.0, "y", -0.075, 0.075);
blkdyn.FixV("x", 0.0, "x", -0.075, 0.075);

// 设置顶部加载位移（模拟压缩试验）
blkdyn.FixV("y", 0.0, "y", 0.075, 0.08);

// 设定所有接触面的本构为脆性断裂的Mohr-Coulomb本构
blkdyn.SetIModel("brittleMC");

// 设定接触面上的材料参数：单位面积法向刚度、切向刚度等
blkdyn.SetIStiffByElem(10.0);

// 设置接触面强度参数（粘聚力、抗拉强度）
blkdyn.SetIStrengthByElem();

// 设置局部阻尼
blkdyn.SetLocalDamp(0.2);

// 设置监测点：顶部和底部应力监测
dyna.Monitor("block", "syy", -0.075, 0.075, 0);
dyna.Monitor("block", "syy", -0.05, 0.075, 0);
dyna.Monitor("block", "syy", -0.025, 0.075, 0);
dyna.Monitor("block", "syy", 0.0, 0.075, 0);
dyna.Monitor("block", "syy", 0.025, 0.075, 0);
dyna.Monitor("block", "syy", 0.05, 0.075, 0);

// 设置位移监测
dyna.Monitor("block", "ydis", -0.075, 0.075, 0);

// 执行求解（10000步）
dyna.Solve(10000);

// 释放动态链接库
dyna.FreeUDF();
