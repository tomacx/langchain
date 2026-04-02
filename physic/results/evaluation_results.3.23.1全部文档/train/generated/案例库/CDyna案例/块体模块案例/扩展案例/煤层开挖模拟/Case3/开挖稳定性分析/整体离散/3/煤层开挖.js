setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置系统收敛的不平衡率为 1e-5
dyna.Set("UnBalance_Ratio 1e-2");

// 设置3个方向的重力加速度值
dyna.Set("Gravity 0 -9.8 0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置接触更新
dyna.Set("If_Renew_Contact 1");

// 设置计算结果的输出间隔为 500 步
dyna.Set("Output_Interval 500");

// 导入2D网格
blkdyn.ImportGrid("ansys", "coal.dat");

// 创建交界面
blkdyn.CrtIFace();

// 更新交界面网格信息
blkdyn.UpdateIFaceMesh();

// 设置材料模型为线弹性
blkdyn.SetModel("linear");

// 设置粉砂岩的材料参数
blkdyn.SetMat(1742, 0.01e9, 0.26, 126e3, 37.5e3, 16.3, 10, 1);
blkdyn.SetMat(1742, 0.01e9, 0.26, 126e3, 37.5e3, 16.3, 10, 4);

// 设置煤层的材料参数
blkdyn.SetMat(1072, 0.06e9, 0.31, 57.8e3, 9.29e3, 17.7, 10, 2);

// 设置泥岩的材料参数
blkdyn.SetMat(1728, 0.03e9, 0.28, 55.1e3, 17.1e3, 14.5, 10, 3);

// 监测块体破坏度
dyna.Monitor("gvalue", "gv_block_broken_ratio");

// 开始计算
dyna.Solve();
