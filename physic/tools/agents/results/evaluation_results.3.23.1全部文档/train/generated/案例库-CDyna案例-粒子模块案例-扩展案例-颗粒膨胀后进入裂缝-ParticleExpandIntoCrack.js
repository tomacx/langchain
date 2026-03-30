setCurDir(getSrcDir());

// ==================== 1. 初始化仿真环境 ====================
dyna.Set("If_Particle_NForce_Incremental 0");
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Particle_Renew_Interval 1");

// ==================== 2. 设置物理参数 ====================
dyna.Set("Gravity 0.0 0.0 0.0");
dyna.Set("Contact_Detect_Tol 0.001");
dyna.Set("Time_Step 1e-5");

// ==================== 3. 创建裂缝边界网格 ====================
var crackCoord = [
    [0, 0, 0],
    [1.0, 0, 0],
    [1.0, 0.5, 0],
    [0, 0.5, 0]
];

rdface.Create(1, 1, 2, crackCoord); // 裂缝壁面1
rdface.Create(2, 2, 2, crackCoord); // 裂缝壁面2

// ==================== 4. 导入或创建边界网格 ====================
blkdyn.ImportGrid("gid", "crack_boundary.msh");
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();
blkdyn.SetModel("MC");

// ==================== 5. 设置块体材料参数 ====================
blkdyn.SetMat(2500, 1e8, 0.25, 10e6, 5e6, 25, 15);
blkdyn.SetIModel("brittleMC");
blkdyn.SetIStrengthByElem();
blkdyn.SetIStiffByElem(1.0);
blkdyn.SetLocalDamp(0.05);

// ==================== 6. 固定边界 ====================
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 0.999, 1.01);
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);
blkdyn.FixV("y", 0.0, "y", 0.999, 1.01);

// ==================== 7. 生成膨胀颗粒组 ====================
var x = [0.41, 0.59];
var y = [0.41, 0.59];
var z = [-1, 1];

pdyna.CreateByCoord(2000, 1, 1, 0.003, 0.005, 0.003, x, y, z);

// ==================== 8. 设置颗粒材料参数 ====================
pdyna.SetModel("brittleMC");
pdyna.SetMat(2500, 2e7, 0.25, 0.0, 0.0, 15, 0.0, 0.1);

// ==================== 9. 设置初始速度场驱动颗粒运动 ====================
var velocity = [0.0, 0.0, 0.5]; // Z方向向裂缝内部膨胀的初始速度
pdyna.ApplyVelocityByGroup(velocity, 1, 1);

// ==================== 10. 配置接触属性 ====================
blkdyn.SetContact("If_Calc_Contact 1");
blkdyn.SetContact("Contact_Type 2"); // 颗粒与块体接触类型

// ==================== 11. 调用ExportPeneCircleTargetInfo导出统计信息 ====================
for (var i = 0; i < 5; i++) {
    pfly.ExportPeneCircleTargetInfo(39, 56, 1.0 / 56.0, 1, 1, 2);
}

// ==================== 12. 执行求解器循环 ====================
dyna.Solve(10000);

// ==================== 13. 导出结果文件 ====================
pdyna.exportPDyna("par.dat");
