setCurDir(getSrcDir());

// 清理环境
dyna.Clear();
imeshing.clear();
doc.clearResult();

// 设置求解器参数
dyna.Set("Time_Step 1e-3");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Output_Interval 200");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Renew_Interval 10");
dyna.Set("Block_Rdface_Contact_Scheme 3");
dyna.Set("If_Cal_EE_Contact 1");
dyna.Set("If_Virtural_Mass 0");

// 创建斜坡网格（底部）
imeshing.genBrick3D("slope", 10, 2, 10, 20, 2, 20, -5, -2, -5);

// 创建刚体块网格
imeshing.genBrick3D("block", 4, 2, 4, 6, 2, 6, 8, 0, 0);

// 获取网格并设置接触面
blkdyn.GetMesh(imeshing);
blkdyn.CrtBoundIFaceByGroup(1);
blkdyn.UpdateIFaceMesh();

// 旋转斜坡网格形成斜面
blkdyn.RotateGrid("slope", [0, 0, 0], [0, 0, 1], 30, 15);

// 设置单元模型为线弹性
blkdyn.SetModel("linear");

// 设置材料参数（密度、杨氏模量、泊松比、剪切模量、体积模量等）
blkdyn.SetMat(2500, 3e8, 0.25, 1e6, 1e6, 15, 10);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.01);

// 固定斜坡底部边界条件（X方向）
blkdyn.FixV("xyz", 0.0, "x", -100, 100);

// 固定斜坡顶部边界条件（Y方向限制）
blkdyn.FixV("xyz", 0.0, "y", -2.01, -1.99);

// 设置刚体块监测点（监测位移和速度）
dyna.Monitor("block", "xdis", 5.0, 3.0, 0);
dyna.Monitor("block", "ydis", 5.0, 3.0, 0);
dyna.Monitor("block", "zdis", 5.0, 3.0, 0);

// 设置刚体块监测点（监测速度）
dyna.Monitor("block", "xvel", 5.0, 3.0, 0);
dyna.Monitor("block", "yvel", 5.0, 3.0, 0);
dyna.Monitor("block", "zvel", 5.0, 3.0, 0);

// 时间步长修正
dyna.TimeStepCorrect(0.1);

// 执行求解
dyna.Solve(100000);

// 输出监测数据
dyna.OutputMonitorData();

// 导出结果信息
ExportInfo();
