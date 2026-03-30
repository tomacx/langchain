setCurDir(getSrcDir());

// 清除dyna信息
dyna.Clear();
// 清除平台结果信息
doc.clearResult();

// 打开大位移开关
dyna.Set("Large_Displace 1");

// 打开接触更新开关
dyna.Set("If_Renew_Contact 1");

// 设置云图输出间隔为500
dyna.Set("Output_Interval 500");

// 设置虚拟时步为0.4
dyna.Set("Virtural_Step 0.4");

// 设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置接触容差
dyna.Set("Contact_Detect_Tol 0.005");

// 导入ansys格式的网格
blkdyn.ImportGrid("ansys", "groupcheck.dat");

// 不同组号交界面进行切割
blkdyn.CrtIFace(-1, -1);

// 接触切割后，更新网格
blkdyn.UpdateIFaceMesh();

// 设置单元本构为线弹性模型
blkdyn.SetModel("linear");

// 设置单元材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼
blkdyn.SetMat(2500, 3e9, 0.25, 1e6, 1e4, 15, 15);

// 设置接触面本构为线弹性模型
blkdyn.SetIModel("linear");

// 设置接触面材料参数：法向刚度、切向刚度、内摩擦角、粘聚力、阻尼系数
blkdyn.SetIMat(1e9, 1e9, 15, 0, 0);

// 固定Y底部的Y方向位移
blkdyn.FixV("y", 0, "y", -1, 0.001);

// 设置接触面模型为脆性断裂模型
blkdyn.SetIModel("brittleMC");

// 设置局部阻尼为0.01
blkdyn.SetLocalDamp(0.01);

// 自动计算时步
dyna.TimeStepCorrect(0.8);

// 监测块体总破坏度
dyna.Monitor("gvalue", "gv_block_broken_ratio");

// 监测块体总体应变能
dyna.Monitor("gvalue", "gv_block_strain_energy");

// 求解1.5万步
dyna.Solve(15000);

print("Solution is OK!");
