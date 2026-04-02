setCurDir(getSrcDir());

// 清除环境中的数据
doc.clearResult();
igeo.clear();
imeshing.clear();

// 设置计算参数
dyna.Set("Output_Interval 500");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Contact_Detect_Tol 1e-3");

// 导入几何模型
rdface.Import("ansys", "Bound.dat");

// 设置计算参数
dyna.Set("Gravity 0.0 -9.8 0.0");

// 创建块体并生成网格
igeo.genBrickV(450, 450, 310, 550, 550, 400, 10, 1);
imeshing.genMeshByGmsh(3);

// 获取网格数据
blkdyn.GetMesh(imeshing);

// 创建接触面并更新网格
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置材料模型和参数
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 5e8, 0.3, 0, 0, 15, 0);
blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(5e9, 5e9, 15, 0, 0);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.02);

// 求解计算
dyna.TimeStepCorrect(0.6);
dyna.Solve(40000);
