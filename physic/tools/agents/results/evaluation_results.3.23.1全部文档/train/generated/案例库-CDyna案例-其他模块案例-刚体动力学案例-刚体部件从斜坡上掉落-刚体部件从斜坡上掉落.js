setCurDir(getSrcDir());

dyna.Clear();
imeshing.clear();

// 配置全局参数
dyna.Set("Time_Step 1e-3");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Output_Interval 200");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Renew_Interval 10");
dyna.Set("Block_Rdface_Contact_Scheme 3");
dyna.Set("If_Cal_EE_Contact 1");

// 创建斜坡几何模型（长方体）
imeshing.genBrick3D("slope", 20, 5, 20, 20, 4, 20, -5, -2, -5);

// 获取网格并关联到块体模块
blkdyn.GetMesh(imeshing);

// 创建接触边界界面
blkdyn.CrtBoundIFaceByGroup(1);
blkdyn.UpdateIFaceMesh();

// 设置线性模型
blkdyn.SetModel("linear");

// 设置斜坡材料属性（密度、弹性模量、泊松比等）
blkdyn.SetMat(2000, 3e8, 0.3, 5e3, 3e3, 15, 10);

// 设置块体模型类型
blkdyn.SetIModel("brittleMC");

// 设置单元刚度与强度
blkdyn.SetIStiffByElem(10);
blkdyn.SetIStrengthByElem(1);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.01);

// 固定斜坡边界（X方向）
blkdyn.FixV("xyz", 0.0, "x", -6, -4.999);
blkdyn.FixV("xyz", 0.0, "x", 4.999, 6);

// 固定斜坡底部（Y方向）
blkdyn.FixV("xyz", 0.0, "y", -100, 100);

// 创建刚体部件（掉落物）
rdface.CrtPart("falling_part");

// 设置刚体部件属性（密度、惯性矩等）
rdface.SetPartProp(2500, [0.001, 0.001, 0.001], [1.0, 1.0, 1.0, 0.0, 0.0, 0.0], "falling_part");

// 设置刚体局部阻尼
rdface.SetPartLocalDamp(0.05, 0.05);

// 施加重力载荷（重力加速度 -9.8 m/s²）
dyna.Set("Gravity 0 -9.8 0");

// 时间步长修正
dyna.TimeStepCorrect(0.1);

// 配置输出监测请求
dyna.Monitor("block", "xdis", 5, 2, 0);
dyna.Monitor("block", "ydis", 5, 2, 0);
dyna.Monitor("block", "zdis", 5, 2, 0);

// 执行仿真计算
dyna.Solve(100000);
