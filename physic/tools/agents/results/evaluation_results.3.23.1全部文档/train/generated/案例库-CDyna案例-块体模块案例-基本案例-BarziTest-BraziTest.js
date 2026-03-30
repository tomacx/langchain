setCurDir(getSrcDir());

// 系统参数配置
dyna.Set("Mechanic_Cal 1");
dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Large_Displace 0");
dyna.Set("Output_Interval 2000");
dyna.Set("GiD_Out 0");
dyna.Set("Moniter_Iter 100");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.5");
dyna.Set("Contact_Detect_Tol 0.00");
dyna.Set("If_Renew_Contact 0");
dyna.Set("SaveFile_Out 0");

// 创建几何模型 - 半径2cm的圆盘
blkdyn.GenCircle(0.0, 0.02, 20, 60, 1);

// 交界面处理
blkdyn.CrtIFace(1, 1);
blkdyn.UpdateIFaceMesh();

// 单元力学模型设置
blkdyn.SetModel("linear");

// 材料参数设置 - 密度、弹性模量、泊松比、粘聚力、抗拉强度等
blkdyn.SetMatByGroup(2500, 1e10, 0.25, 10e6, 4e6, 40.0, 10.0, 1);

// 交界面断裂模型设置
blkdyn.SetIModel("FracE");

// 交界面材料参数 - 法向刚度、切向刚度、内摩擦角、粘聚力、抗拉强度
blkdyn.SetIMat(5e13, 5e13, 40, 5e6, 1e6);

// 断裂能参数设置 - 拉伸断裂能、剪切断裂能
blkdyn.SetIFracEnergyByGroupInterface(50.0, 500.0, 1, 1);

// 边界条件 - 底部节点法向约束（Y方向）
blkdyn.FixVByCoord("y", 0.0, -1e10, 1e10, -0.0201, -0.0199, -1e10, 1e10);

// 边界条件 - 顶部节点施加准静态速度载荷
blkdyn.FixVByCoord("y", -2e-9, -1e10, 1e10, 0.0199, 0.0201, -1e10, 1e10);

// 执行计算
dyna.Solve(100000);

// 输出完成信息
print("Solution Finished");
