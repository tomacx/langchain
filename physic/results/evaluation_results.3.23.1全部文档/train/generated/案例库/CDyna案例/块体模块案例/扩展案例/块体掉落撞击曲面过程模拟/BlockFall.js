setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 设置模拟参数
dyna.Set("Output_Interval 500");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Contact_Detect_Tol 1e-1");

// 导入边界数据
rdface.Import("ansys", "Bound.dat");

// 设置接触检测参数
dyna.Set("If_Cal_EE_Contact 1");

// 创建几何模型
igeo.genBrickV(450, 450, 310, 550, 550, 400, 10, 1);

// 网格划分
imeshing.genMeshByGmsh(3);

// 设置重力参数
dyna.Set("Gravity 0 0 -9.8");

// 获取网格信息
blkdyn.GetMesh(imeshing);

// 创建交界面并更新网格
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置材料模型和参数
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 5e8, 0.3, 0, 0, 15, 0);
blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(5e9, 5e9, 15, 0, 0);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.02);

// 自动计算时间步长
dyna.TimeStepCorrect(0.6);

// 求解模拟
dyna.Solve(40000);

// 输出结果到平台
doc.outputResult();
