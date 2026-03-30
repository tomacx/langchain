setCurDir(getSrcDir());

// ==================== 1. 初始化仿真环境 ====================
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
dyna.Set("If_Cal_Rayleigh 1");

// ==================== 2. 导入网格模型 ====================
var msh1 = imesh.importGmsh("boreblast.msh");
blkdyn.GetMesh(msh1);

// ==================== 3. 设置材料模型与参数 ====================
// 岩体材料 - Young模型 (组1)
blkdyn.SetModel("Young", 1);
blkdyn.SetMat(2500, 8e10, 0.3, 3.7e7, 1e7, 35.0, 15.0, 1);

// 炸药材料 - Landau模型 (组2)
blkdyn.SetModel("Landau", 2);
blkdyn.SetMat(1150, 8e10, 0.3, 3.7e7, 1e7, 35.0, 15.0, 2);

// ==================== 4. 设置起爆点与点火源 ====================
var apos = [10.0, 10.0, 0.0];
blkdyn.SetLandauSource(1, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 0.0, 10);
blkdyn.BindLandauSource(1, 2, 2);

// ==================== 5. 设置边界条件 ====================
// 无反射边界条件
blkdyn.SetQuietBoundByCoord(-0.1, 0.1, -1e5, 1e5, -1e5, 1e5);
blkdyn.SetQuietBoundByCoord(119.1, 120.1, -1e5, 1e5, -1e5, 1e5);
blkdyn.SetQuietBoundByCoord(-1e5, 1e5, -0.1, 0.1, -1e5, 1e5);
blkdyn.SetQuietBoundByCoord(-1e5, 1e5, 119.1, 120.1, -1e5, 1e5);

// ==================== 6. 设置阻尼 ====================
blkdyn.SetLocalDamp(0.0);
blkdyn.SetRayleighDamp(1e-6, 0.0);

// ==================== 7. 设置监测传感器 ====================
dyna.Monitor("block", "sxx", 11, 10, 0);
dyna.Monitor("block", "sxx", 13, 10, 0);
dyna.Monitor("block", "sxx", 16, 10, 0);

// ==================== 8. 设置时间步与求解 ====================
dyna.Set("Time_Step 2e-6");
dyna.DynaCycle(4e-3);

print("Solution Finished");
