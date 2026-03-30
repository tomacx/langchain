setCurDir(getSrcDir());

// 初始化全局参数
dyna.Set("Mechanic_Cal 1");
dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("Moniter_Iter 100");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Virtural_Step 0.6");
dyna.Set("Renew_Interval 100");
dyna.Set("Contact_Detect_Tol 1e-3");
dyna.Set("If_Renew_Contact 1");
dyna.Set("If_Cal_EE_Contact 1");
dyna.Set("Time_Step 2e-4");

// 创建三个碰撞块体几何模型
blkdyn.GenBrick3D(5, 5, 5, 5, 5, 5, 1);
blkdyn.GenBrick3D(5, 5, 5, 10, 10, 10, 2);
blkdyn.GenBrick3D(5, 5, 5, 15, 15, 15, 3);

// 创建接触面并更新网格
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置单元模型为线弹性模型
blkdyn.SetModel("linear");

// 设置三块体的材料参数（密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角）
blkdyn.SetMatByGroup(2500, 1e9, 0.3, 6e4, 3e4, 25.0, 10.0, 1);
blkdyn.SetMatByGroup(2500, 1e9, 0.3, 6e4, 3e4, 25.0, 10.0, 2);
blkdyn.SetMatByGroup(2500, 1e9, 0.3, 6e4, 3e4, 25.0, 10.0, 3);

// 设置接触面材料参数（单位面积法向刚度、单位面积切向刚度、内摩擦角、粘聚力、抗拉强度）
blkdyn.SetIMat(1e10, 1e10, 25.0, 0.0, 0.0);

// 设置接触面本构为脆性断裂的Mohr-Coulomb本构
blkdyn.SetIModel("brittleMC");

// 固定底部块体（组号1）的x、y方向速度
blkdyn.FixVByCoord("xy", 0.0, -1e10, 5, -1e10, 5);

// 设置局部阻尼系数
blkdyn.SetLocalDamp(0.01);

// 配置监测点（监测三个块体在碰撞过程中的位移响应）
dyna.Monitor("block", "xdis", 2.5, 7.5, 0);
dyna.Monitor("block", "xdis", 7.5, 12.5, 0);
dyna.Monitor("block", "xdis", 12.5, 17.5, 0);
dyna.Monitor("gvalue", "gv_spring_crack_ratio");

// 为中间块体（组号2）赋予初始碰撞速度
blkdyn.SetVByGroup(0, 0, -10.0, 2);

// 执行求解器计算
dyna.Solve();

print("Solution Finished");
