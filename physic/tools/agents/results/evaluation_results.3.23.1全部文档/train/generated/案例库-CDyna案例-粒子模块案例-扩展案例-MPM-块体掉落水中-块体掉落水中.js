setCurDir(getSrcDir());

// ========== 1. 初始化仿真环境参数 ==========
dyna.Set("Output_Interval 1000");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Time_Step 2e-5");
dyna.Set("UnBalance_Ratio 1e-3");
dyna.Set("Particle_Cal_Type 4");
dyna.Set("If_Contact_Use_GlobMat 1 2 1e8 1e8 0.0 0.0 0.0");

// ========== 2. 创建块体几何与网格 ==========
igeo.genCircleS(0.5, 1.3, 0, 0.15, 0.02, 3);
imeshing.genMeshByGmsh(2);
blkdyn.GetMesh(imeshing);

// 设置块体为线弹性模型
blkdyn.SetModel("linear");
blkdyn.SetMat(2000, 1e8, 0.3, 1e6, 1e6, 35, 15);
blkdyn.SetLocalDamp(0.01);

// ========== 3. 创建水体粒子与MPM背景网格 ==========
pdyna.RegularCreateByCoord(1, 1, 0.01, -0.16, 1.16, -0.16, 1.1, 0.0, 0);
pdyna.RegularCreateByCoord(1, 1, 0.01, -0.16, -0.02, 1, 2, 0.0, 0);
pdyna.RegularCreateByCoord(1, 1, 0.01, 1.04, 1.16, 1, 2, 0.0, 0);

// 设置水体材料参数（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼）
pdyna.SetMat(1000, 2.18e9, 0.25, 8e6, 16e6, 40, 0.02, 0.0);

// 创建MPM背景网格（维度、单元尺寸、坐标范围）
mpm.SetBackGrid(3, 0.06, [-0.3, -0.3, 0], [28, 40, 0]);

// 设置MPM流体模型为理想弹塑性
mpm.SetModelByGroup("Fluid", 1, 2);
mpm.SetKGVByGroup(5e6, 0.0, 1e-3, 1, 11);
dyna.Set("MPM_Fluid_Tension 1e2");

// ========== 4. 设置边界条件与接触 ==========
// 固定水体左右两侧及底部（模拟容器壁）
pdyna.FixV("xyz", 0, "x", -1, -0.001);
pdyna.FixV("xyz", 0, "x", 1.021, 2);
pdyna.FixV("xyz", 0, "y", -1, -0.001);

// 设置块体初始下落速度（向下方向）
blkdyn.SetVel(0, 0, -5.0);

// ========== 5. 设置监测点 ==========
dyna.Monitor("block_disp", 0, "y");
dyna.Monitor("block_vel", 0, "y");
dyna.Monitor("impact_force", 0, "z");

// ========== 6. 结果输出配置 ==========
dyna.Set("Result_File_Path ./results/");
dyna.Set("History_Curve_Interval 100");
dyna.Set("Deformation_Snapshot_Interval 500");

// ========== 7. 启动求解与检查状态 ==========
var stepCount = dyna.DynaCycle(20);
console.log("仿真完成，总步数：" + stepCount);

// 导出结果
doc.ExportResult();
