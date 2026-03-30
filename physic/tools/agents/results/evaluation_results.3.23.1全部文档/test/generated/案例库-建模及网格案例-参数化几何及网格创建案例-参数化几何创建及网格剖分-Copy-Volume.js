setCurDir(getSrcDir());

// ========== 1. 参数化几何定义 ==========
var L = 20.0;   // 长度 (m)
var W = 15.0;   // 宽度 (m)
var H = 10.0;   // 高度 (m)
var nX = 4;     // X方向分割数
var nY = 3;     // Y方向分割数
var nZ = 2;     // Z方向分割数

// ========== 2. 创建参数化3D砖块体积 ==========
var Volume1 = igeo.genBrickV(0, 0, 0, L, W, H, 1, 1);
var Volume2 = igeo.genBrickV(L, 0, 0, L, W, H, 1, 2);
var Volume3 = igeo.genBrickV(0, W, 0, L, W, H, 1, 3);

// ========== 3. 体复制操作 (Copy-Volume) ==========
var aVolumes = [Volume1, Volume2, Volume3];
var Ope1 = igeo.copy("Volume", aVolumes, -L/2, -W/2, -H/2, L/2, W/2, H/2);

// ========== 4. 三维网格剖分 ==========
imeshing.genMeshByGmsh(3, "CopyVolume");

// ========== 5. 导入网格到求解器 ==========
var Mesh1 = GetMesh("CopyVolume.msh", 1);

// ========== 6. 设置监测组 ==========
SetGroupByID(Mesh1, 1, "Group1");
SetGroupByID(Mesh1, 2, "Group2");
SetGroupByID(Mesh1, 3, "Group3");

// ========== 7. 配置输出设置 ==========
var OutputDir = getSrcDir() + "/Results/";
if (!fs.existsSync(OutputDir)) {
    fs.mkdirSync(OutputDir);
}

// 设置位移、应力、应变输出
SetOutputFile("displacement", OutputDir + "disp.dat");
SetOutputFile("stress", OutputDir + "stress.dat");
SetOutputFile("strain", OutputDir + "strain.dat");

// ========== 8. 执行计算过程 ==========
var TimeStep = 1e-6;   // 时间步长 (s)
var TotalTime = 0.1;   // 总计算时间 (s)

RunSimulation(Mesh1, TimeStep, TotalTime);

// ========== 9. 获取并导出监测数据 ==========
var DispData = GetGroupData("Group1", "displacement");
var StressData = GetGroupData("Group2", "stress");
var StrainData = GetGroupData("Group3", "strain");

print("Simulation completed successfully.");
print("Displacement data saved to: " + OutputDir + "disp.dat");
print("Stress data saved to: " + OutputDir + "stress.dat");
print("Strain data saved to: " + OutputDir + "strain.dat");
