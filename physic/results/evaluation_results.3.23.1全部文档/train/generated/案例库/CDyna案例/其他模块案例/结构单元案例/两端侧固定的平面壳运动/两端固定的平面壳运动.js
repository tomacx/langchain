setCurDir(getSrcDir());

// 清除数据和结果
dyna.Clear();
doc.clearResult();

// 设置计算参数
dyna.Set("Mechanic_Cal", 1);
dyna.Set("UnBalance_Ratio", 1e-5);
dyna.Set("Gravity", 0, -9.8, 0);
dyna.Set("Large_Displace", 1);
dyna.Set("Output_Interval", 500);

// 打开接触更新开关
dyna.Set("If_Renew_Contact", 1);

// 创建网格并设置组号
blkdyn.GenBrick2D(400, 200, 50, 25, 1);
blkdyn.SetGroupByCoord(2, 80, 320, 24, 40, -1, 1);

// 创建接触面并更新拓扑
blkdyn.CrtIFace(1, 2);
blkdyn.UpdateIFaceMesh();

// 设置单元模型和材料参数
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 1e10, 0.25, 1e6, 0.8e6, 40.0, 10.0);

// 设置接触面模型及参数
blkdyn.SetIModel("linear");
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();

// 施加约束条件
blkdyn.FixV("y", 0.0, "y", -0.01, 0.01);
blkdyn.FixV("x", 0.0, "x", -0.01, 0.01);
blkdyn.FixV("x", 0.0, "x", 399.99, 401);

// 监测块体破坏度和竖直应力
dyna.Monitor("gvalue", "gv_block_broken_ratio");
dyna.Monitor("block", "syy", 200, 150, 0);

// 开始计算
dyna.Solve();
