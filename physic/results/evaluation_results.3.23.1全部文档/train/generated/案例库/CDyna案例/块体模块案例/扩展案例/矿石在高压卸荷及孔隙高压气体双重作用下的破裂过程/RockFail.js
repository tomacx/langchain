setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 设置力学计算参数
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 200");
dyna.Set("Moniter_Iter 10");
dyna.Set("Contact_Detect_Tol 1e-5");
dyna.Set("If_Contact_Use_FaceMat 1");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("If_Renew_Contact 1");
dyna.Set("If_Cal_Rayleigh 0");
dyna.Set("Contact_Search_Method 2");

// 导入网格
blkdyn.ImportGrid("gid", "ore.msh");

// 创建接触面
blkdyn.CrtIFace(2, 2);
blkdyn.CrtBoundIFaceByCoord(-1e5, 1e5, 0.0479, 0.0501, -1e5, 1e5);

// 更新网格信息
blkdyn.UpdateIFaceMesh();

// 设置材料参数
blkdyn.SetModel("linear");
blkdyn.SetMatByGroupRange(2500, 5e10, 0.25, 15e6, 10e6, 40.0, 10.0, 2, 2);
blkdyn.SetMatByGroupRange(7800, 2.1e11, 0.25, 15e6, 10e6, 40.0, 10.0, 1, 1);

// 设置接触面模型
blkdyn.SetIModel("FracE");
blkdyn.SetIModelByCoord("brittleMC", -1e5, 1e5, 0.0499, 0.0501, -1e5, 1e5);
blkdyn.SetIMat(1e13, 1e13, 40.0, 15e6, 10e6);
blkdyn.SetIMatByCoord(1e13, 1e13, 5.0, 0.0, 0.0, -1e5, 1e5, 0.0499, 0.0501, -1e5, 1e5);
blkdyn.SetIFracEnergyByGroupInterface(10, 10, 1, 1);

// 监测接触面的破坏度及破裂度
dyna.Monitor("gvalue", "gv_spring_broke");
dyna.Monitor("gvalue", "gv_spring_crack");

// 求解
dyna.Solve(3000);
