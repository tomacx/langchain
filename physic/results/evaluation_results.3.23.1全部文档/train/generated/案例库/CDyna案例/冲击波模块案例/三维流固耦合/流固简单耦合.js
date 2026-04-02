setCurDir(getSrcDir());

// 清除数据
dyna.Clear();
doc.clearResult();

// 设置计算参数
dyna.Set("Output_Interval 100");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Interface_Soften_Value 3e-3 3e-3");
dyna.Set("Solid_Cal_Mode 2");

// 导入计算网格
blkdyn.ImportGrid("ansys", "bricks.dat");
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置材料参数
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 3e10, 0.25, 6e6, 5e6, 35, 15);
blkdyn.SetIModel("SSMC");
blkdyn.SetIMat(1e12, 1e12, 35, 6e6, 5e6);

// 固定边界条件
blkdyn.FixV("xyz", 0.0, "y", -1e-2, 1e-2);
blkdyn.FixV("xyz", 0.0, "y", 2.01, 2.02);
blkdyn.FixV("xyz", 0.0, "x", -1e-2, 1e-2);
blkdyn.FixV("xyz", 0.0, "x", 2.27, 2.29);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.01);

// 冲击波设置
skwave.DefMesh(3, [3, 3, 2], [50, 60, 50], [-0.2, -0.5, -1]);
skwave.InheritSolid();
skwave.SetSolid(1, -5, 5, -5, 0.2, -5, 5);

// 冲击波初始化
skwave.InitBySphere(1.01e5, 1.02, [0, 0, 0], [0, 0, 0], 1000.0);
skwave.InitBySphere(1e9, 1000, [0, 0, 0], [1.14, 1.0, 0.5], 0.3);

// 设置时间步长并计算
dyna.Set("Time_Step", 2e-6);
dyna.DynaCycle(0.1);

print("求解完毕");
