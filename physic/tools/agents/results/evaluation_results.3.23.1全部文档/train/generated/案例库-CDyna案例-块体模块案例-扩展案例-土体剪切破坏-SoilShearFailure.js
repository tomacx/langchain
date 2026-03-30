setCurDir(getSrcDir());

// 初始化CDyna仿真环境
dyna.Set("Mechanic_Cal 1");

// 设置计算参数
dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0 0.0 0");
dyna.Set("Large_Displace 0");
dyna.Set("Output_Interval 200");
dyna.Set("GiD_Out 0");
dyna.Set("Msr_Out 0");
dyna.Set("Moniter_Iter 100");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.4");
dyna.Set("Renew_Interval 100");
dyna.Set("Contact_Detect_Tol 0.00");
dyna.Set("If_Renew_Contact 1");
dyna.Set("SaveFile_Out 0");
dyna.Set("Interface_Soften_Value 1e-2 3e-2");

// 接触面特征长度
dyna.Set("Indep_CharL 0.0005");

// 导入土体网格模型
blkdyn.ImportGrid("gmsh", "soil.msh");

// 创建并更新接触面
blkdyn.CrtIFace(1, 1);
blkdyn.UpdateIFaceMesh();

// 设置单元模型为剪切失效模型
blkdyn.SetModel("MC");
blkdyn.SetIModel("SSMC");

// 设置土体材料参数：密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角
blkdyn.SetMatByGroup(1800, 5e7, 0.14, 130e3, 1e6, 36, 10.0, 1);

// 设置单元刚度
blkdyn.SetIStiffByElem(20.0);

// 设置单元强度参数
blkdyn.SetIStrengthByElem();

// 模型底部Y方向约束（固定）
blkdyn.FixVByCoord("xy", 0.0, -1e10, 1e10, -1e-4, 1e-4, -1e10, 1e10);

// 模型右侧X方向约束
blkdyn.FixVByCoord("x", 0.0, 0.061799, 0.061801, -1e10, 1e10, -1e10, 1e10);

// 求解至稳定状态
dyna.Solve();

// 模型左侧上部施加X方向水平准静态速度载荷（剪切破坏触发）
blkdyn.FixBoundVByCoord("x", 5e-7, -0.001, 0.001, 0.012501, 0.025, -1e10, 1e10);
blkdyn.FixVByCoord("x", 5e-7, -0.001, 0.001, 0.01255, 0.025, -1e10, 1e10);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.1);

// 执行剪切破坏计算
dyna.Solve(5000);

print("Solution Finished");
