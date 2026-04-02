// 设置当前路径为脚本文件所在路径
setCurDir(getSrcDir());

// 清除dyna模块数据
dyna.Clear();

// 清除平台数据
doc.ClearResult();

// 设置输出间隔为500步
dyna.Set("Output_Interval 500");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 设置计算时间步为0.2ms
dyna.Set("Time_Step 2.0e-4");

// 设置三个方向的重力加速度
dyna.Set("Gravity 0.0 0.0 -9.8");

// 设置接触容差为0.001m
dyna.Set("Contact_Detect_Tol 0.001");

// 导入ansys格式的网格文件
blkdyn.ImportGrid("ansys", "Landslide.dat");

// 在组1与组2的交界面上创建接触面
blkdyn.CrtIFace(1, 2);

// 更新接触面网格
blkdyn.UpdateIFaceMesh();

// 将单元模型设置为线弹性模型
blkdyn.SetModel("linear");

// 设置组1及组2的材料参数
blkdyn.SetMatByGroup(2500, 1e9, 0.25, 10e6, 8e6, 40.0, 10.0, 1);
blkdyn.SetMatByGroup(2500, 1e9, 0.25, 10e6, 8e6, 40.0, 10.0, 2);

// 设置接触面的模型为线弹性模型
blkdyn.SetIModel("linear");

// 将所有接触面的材料参数均设置为一种值
blkdyn.SetIMat(5e9, 5e9, 10, 1e4, 1e4);

// 模型底部施加全约束
blkdyn.FixVByCoord("xy", 0.0, -1e10, 1e10, -0.001, 0.001, -1e10, 1e10);

// 模型左右两侧施加法向约束
blkdyn.FixVByCoord("x", 0.0, -0.001, 0.001, -1e10, 1e10, -1e10, 1e10);
blkdyn.FixVByCoord("x", 0.0, 14.99, 15.01, -1e10, 1e10, -1e10, 1e10);

// 求解至稳定
dyna.Solve();

// 将接触面模型切换至脆性断裂的Mohr-Coulomb模型
blkdyn.SetIModel("brittleMC");

// 设置局部阻尼为0
blkdyn.SetLocalDamp(0.0, 1);
blkdyn.SetLocalDamp(0.0, 2);

// 求解滑坡过程
dyna.Solve();

// 将接触面模型切换回线弹性模型
blkdyn.SetIModel("linear");

// 更新接触面网格
blkdyn.UpdateIFaceMesh();

// 导出结果数据
doc.ExportResult("Landslide_result.dat");
