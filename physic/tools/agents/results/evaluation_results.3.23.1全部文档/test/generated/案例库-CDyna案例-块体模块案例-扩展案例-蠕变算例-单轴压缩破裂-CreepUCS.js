setCurDir(getSrcDir());

// 初始化环境
igeo.clear();
imeshing.clear();
doc.clearResult();
dyna.Clear();

// 创建岩石试件几何（100mm x 50mm x 200mm）
igeo.genRectS(0, 0, 0, 0.1, 0.05, 0, 0.2);

// 生成表面网格
imeshing.genSurfMesh("rock", "", 50, 25, "quad", "invdist1");

// 将平台网格读入dyna内核
blkdyn.GetMesh(imeshing);

// 设置全局蠕变计算参数
dyna.Set("Creep_Cal 1");
dyna.Set("Auto_Creep_Time 1");
dyna.Set("HourGlass_Damp_Factor 0.15");
dyna.Set("DP_Model_Option 1");
dyna.Set("Elem_Plastic_Cal_Creep 1");
dyna.Set("Large_Displace 1");
dyna.Set("Gravity 0 0 -9.8");

// 设置材料参数（岩石：密度2500kg/m³，弹性模量3e10Pa，泊松比0.25）
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 3e6, 30.0, 10.0, 1);

// 设置蠕变材料参数（Burger模型）
blkdyn.SetCreepMat(1, 3e12, 3e9, 1e11, 3e9);

// 绑定蠕变材料到单元组
blkdyn.BindCreepMat(1, 1, 1);

// Y方向底部固定（法向约束）
blkdyn.FixV("y", 8e-8, "y", -0.001, 0.001);

// Y方向顶部施加单轴压缩载荷（准静态速度）
blkdyn.FixV("y", -8e-8, "y", 0.199, 0.201);

// 设置沙漏阻尼和虚质量参数
blkdyn.SetLocalDamp(0.8);
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.4");

// 设置单元软化断裂应变
dyna.Set("Block_Soften_Value 0.005 0.01");
dyna.Set("Elem_Kill_Option 1 0.01 0.005 1 1");

// 允许块体转化为颗粒
dyna.Set("If_Allow_Block_To_Particles 1 1");

// 设置输出间隔
dyna.Set("Output_Interval 500");
dyna.Set("Moniter_Iter 10");

// 创建监测靶板（监测中心区域，半径0.08m）
pfly.CrtPeneTarget(0.0, 0.0, 0.0, 0.08, -0.1, 0.1);

// 设置典型测点应力监测
dyna.Monitor("block", "sxx", 0.025, 0.0, 0);
dyna.Monitor("block", "sxx", 0.075, 0.0, 0);
dyna.Monitor("block", "syy", 0.025, 0.0, 0);
dyna.Monitor("block", "syy", 0.075, 0.0, 0);

// 设置时间步长
dyna.Set("Time_Step 1e-6");

// 执行求解（根据蠕变特性设置足够的时间步数）
dyna.Solve(200000);

// 导出靶板监测信息
pfly.ExportPeneTargetInfo();
