setCurDir(getSrcDir());

// 初始化仿真环境
dyna.Set("Mechanic_Cal 1");
dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("Moniter_Iter 100");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Virtural_Step 0.6");
dyna.Set("Renew_Interval 10");
dyna.Set("Contact_Detect_Tol 1e-3");
dyna.Set("If_Renew_Contact 1");
dyna.Set("If_Cal_EE_Contact 1");

// 导入网格文件
blkdyn.ImportGrid("ansys", "ThreeBC2.dat");

// 创建接触面并更新
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置单元模型为线弹性
blkdyn.SetModel("linear");

// 设置三个块体的材料参数（密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角）
blkdyn.SetMatByGroup(2500, 1e9, 0.3, 6e4, 3e4, 25.0, 10.0, 1);
blkdyn.SetMatByGroup(2500, 1e9, 0.3, 6e4, 3e4, 25.0, 10.0, 2);
blkdyn.SetMatByGroup(2500, 1e9, 0.3, 6e4, 3e4, 25.0, 10.0, 3);

// 设置接触面材料参数（法向刚度、切向刚度、内摩擦角、粘聚力、抗拉强度）
blkdyn.SetIMat(5e10, 5e10, 10.0, 0.0, 0.0);

// 固定边界条件（x方向速度为0，y和z方向自由）
blkdyn.FixVByCoord("xyz", 0.0, -1e10, 1e10, -1e10, 0.01, -1e10, 1e10);

// 设置局部阻尼系数
blkdyn.SetLocalDamp(0.05);

// 设置监测点（监测三个块体的x方向位移）
dyna.Monitor("block", "xdis", 0, 10, 0);
dyna.Monitor("block", "xdis", 12.5, 15, 0);
dyna.Monitor("block", "xdis", 15, 20, 0);

// 设置接触面本构为脆性断裂Mohr-Coulomb模型
blkdyn.SetIModel("brittleMC");

// 设置时间步长
dyna.Set("Time_Step 5e-5");

// 执行求解
dyna.Solve();

// 获取后处理数据（统计应力）
var stressData = GetParStatiStress(0, 1.0, 1.0, 1.0);

// 计算无反射边界
CalQuietBound();

// 输出结果信息
print("Solution Finished");
print("Contact forces and displacements monitored successfully");
