setCurDir(getSrcDir());

// 设置求解器基本参数
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Contact_Detect_Tol 0.001");
dyna.Set("Particle_Out_Kill 1 -3 3 -0.1 3 -3 3 0");

// 导入刚性面边界网格（组号2）
rdface.Import(2, "boundary.msh");

// 创建第一组随机颗粒（高度范围-1到0，半径0.01m）
var x = [-0.6, 0.6];
var y = [-0.6, 0.6];
var z = [-1, 0];
pdyna.CreateByCoord(5000, 1, 1, 0.01, 0.01, 0.0, x, y, z);

// 创建第二组随机颗粒（高度范围-2到-1，半径0.015m）
var z2 = [-2, -1];
pdyna.CreateByCoord(5000, 2, 1, 0.015, 0.015, 0.0, x, y, z2);

// 设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

// 设置颗粒材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数
pdyna.SetMat(2500, 1e7, 0.25, 0.0, 0.0, 25, 0.0, 0.3);

// 设置计算时步
dyna.Set("Time_Step 1e-4");

// 执行求解（迭代1万步）
dyna.Solve(10000);

// 导出刚性面撞击信息（组号范围1-2）
pfly.ExportRigidFaceTargetInfo(1, 2);
