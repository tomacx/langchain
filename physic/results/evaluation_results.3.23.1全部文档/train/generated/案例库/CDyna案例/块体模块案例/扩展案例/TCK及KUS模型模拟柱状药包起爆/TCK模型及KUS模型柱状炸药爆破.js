setCurDir(getSrcDir());

// 设置计算参数
dyna.Set("Mechanic_Cal 1");
dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0.0 0.0 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 100");
dyna.Set("GiD_Out 0");
dyna.Set("Msr_Out 0");
dyna.Set("Moniter_Iter 10");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Virtural_Step 0.6");

// 导入网格
var msh1 = imesh.importGmsh("boreblast.msh");

// 获取网格数据
blkdyn.GetMesh(msh1);

// 设置材料模型和参数
blkdyn.SetModel("Young", 1);
blkdyn.SetMat(2500, 8e10, 0.3, 3.7e7, 1e7, 35.0, 15.0, 1);

// 设置炸药源参数
blkdyn.SetModel("Landau", 2);
blkdyn.SetMat(1150, 8e10, 0.3, 3.7e7, 1e7, 35.0, 15.0, 2);
var apos = [10.0, 10.0, 0.0];
blkdyn.SetLandauSource(1, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 0.0, 10);
blkdyn.BindLandauSource(1, 2, 2);

// 设置监控点
dyna.Monitor("block", "sxx", 11, 10, 0);
dyna.Monitor("block", "sxx", 13, 10, 0);
dyna.Monitor("block", "sxx", 16, 10, 0);

// 设置阻尼
blkdyn.SetLocalDamp(0.0);
blkdyn.SetRayleighDamp(1e-6, 0.0);

// 设置时间步长并求解
dyna.Set("Time_Step 2e-6");
dyna.DynaCycle(4e-3);

print("Solution Finished");
