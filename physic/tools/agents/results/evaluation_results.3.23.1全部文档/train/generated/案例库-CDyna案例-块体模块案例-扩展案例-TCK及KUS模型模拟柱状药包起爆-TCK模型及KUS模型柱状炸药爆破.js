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

// ==================== 2. 导入柱状药包几何模型 ====================
var msh1 = imesh.importGmsh("boreblast.msh");
blkdyn.GetMesh(msh1);

// ==================== 3. 设置围岩材料（TCK模型） ====================
blkdyn.SetModel("TCK", 1);
blkdyn.SetMat(2500, 8e10, 0.3, 3.7e7, 1e7, 35.0, 15.0, 1);

// ==================== 4. 设置炸药材料（JWL模型） ====================
blkdyn.SetModel("JWL", 2);
blkdyn.SetMat(1630, 7.0e9, 0.25, 3e6, 1e6, 35, 15);

// ==================== 5. 设置起爆点位置 ====================
var pos = new Array(3);
pos[0] = [0.0, 0.0, 0.0];
pos[1] = [1.0, 0.0, 0.0];
pos[2] = [2.0, 0.0, 0.0];

// ==================== 6. 设置JWL爆源参数（TNT炸药） ====================
blkdyn.SetJWLSource(2, 1630, 7.0e9, 371.2e9, 3.2e9, 4.2, 0.95, 0.30, 21e9, 6930, pos, 0.0, 15e-3);
blkdyn.BindJWLSource(2, 2, 100);

// ==================== 7. 设置气体泄漏衰减参数 ====================
blkdyn.SetJWLGasLeakMat(5e-4, 1.2, 2, 2);

// ==================== 8. 定义监测点（压力、应力等） ====================
dyna.Monitor("block", "sxx", 11, 10, 0);
dyna.Monitor("block", "sxx", 13, 10, 0);
dyna.Monitor("block", "sxx", 16, 10, 0);

// ==================== 9. 设置阻尼参数 ====================
blkdyn.SetLocalDamp(0.0);
blkdyn.SetRayleighDamp(1e-6, 0.0);

// ==================== 10. 设置时间步与求解时长 ====================
dyna.Set("Time_Step 2e-6");
dyna.DynaCycle(4e-3);

print("Solution Finished");
