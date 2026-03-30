setCurDir(getSrcDir());

// 清除几何和网格信息（可选）
igeo.clear();
imeshing.clear();

// 创建二维砖块网格
imeshing.genBrick2D("fg", 5, 5, 10, 10);

// 旋转拉伸操作
imeshing.rotaExtrude(-1, 0, 0, -1, 1, 0, 180, 20);

// 设置分组（按区域重新分组）
SetGroupByID(1, "group1");
SetGroupByID(2, "group2");

// 分配材料参数
dyna.SetMaterialProperty("group1", "density", 2500.0);
dyna.SetMaterialProperty("group1", "elastic_modulus", 30e9);
dyna.SetMaterialProperty("group1", "poisson_ratio", 0.3);

dyna.SetMaterialProperty("group2", "density", 2700.0);
dyna.SetMaterialProperty("group2", "elastic_modulus", 40e9);
dyna.SetMaterialProperty("group2", "poisson_ratio", 0.25);

// 设置边界条件（固定约束）
SetBoundaryCondition("fixed", "x", 0, 0, 0);
SetBoundaryCondition("fixed", "y", 0, 0, 0);
SetBoundaryCondition("fixed", "z", 0, 0, 0);

// 设置外部载荷激励
SetLoad("gravity", 9.81, 0, -1, 0);

// 配置结果输出选项
SetOutputOption("displacement", true);
SetOutputOption("stress", true);
SetOutputOption("strain", true);

// 启动求解器
dyna.Solve();

print("仿真计算完成");
