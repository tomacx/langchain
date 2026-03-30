setCurDir(getSrcDir());

// 初始化CDyna环境参数
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
dyna.Set("Block_Soften_Value 5e-3 3e-2");
dyna.Set("If_Cal_Rayleigh 1");

// 导入围岩计算网格
blkdyn.ImportGrid("gmsh", "boreblast.msh");

// 设置岩石材料属性（密度、弹性模量、泊松比、屈服强度等）
blkdyn.SetMatByGroupRange(1221, 2.65e9, 0.23, 3.8e6, 0.64e6, 34.0, 15.0, 1, 2);

// 设置材料模型为SoftenMC（适用于岩石损伤模拟）
blkdyn.SetModel("SoftenMC", 1);

// 设置炮孔中心位置坐标
var apos = [10.0, 10.0, 0.0];

// 设置朗道爆源参数（ID=1，密度、弹性模量、屈服强度等）
blkdyn.SetLandauSource(1, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 0.0, 10);

// 绑定朗道爆源到单元
blkdyn.BindLandauSource(1, 2, 2);

// 设置炸药材料模型为Landau
blkdyn.SetModel("Landau", 2);

// 设置固定边界条件（X方向）
blkdyn.SetQuietBoundByCoord(-0.001, 0.001, -100, 100, -100, 100);

// 设置固定边界条件（Y方向）
blkdyn.SetQuietBoundByCoord(19.999, 31, -100, 100, -100, 100);

// 设置固定边界条件（Z方向）
blkdyn.SetQuietBoundByCoord(-100, 100, -0.001, 0.001, -100, 100);

// 设置固定边界条件（X方向另一侧）
blkdyn.SetQuietBoundByCoord(-100, 100, 19.999, 31, -100, 100);

// 设置应力监测点（单元ID和积分点）
dyna.Monitor("block", "sxx", 11, 10, 0);
dyna.Monitor("block", "sxx", 13, 10, 0);
dyna.Monitor("block", "sxx", 16, 10, 0);

// 设置阻尼参数
blkdyn.SetLocalDamp(0.0);
blkdyn.SetRayleighDamp(5e-6, 0.0);

// 设置时间步长
dyna.Set("Time_Step 2e-6");

// 执行求解（计算时长4ms）
dyna.DynaCycle(4e-3);

print("Solution Finished");
