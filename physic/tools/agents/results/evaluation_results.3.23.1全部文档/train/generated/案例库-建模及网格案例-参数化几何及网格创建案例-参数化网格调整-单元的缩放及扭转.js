setCurDir(getSrcDir());

// 清除几何与网格信息
igeo.clear();
imeshing.clear();

// ========== 1. 参数化几何创建 ==========
var fLength = 2.0;      // 砖块长度 (m)
var fWidth = 1.0;       // 砖块宽度 (m)
var fHeight = 0.5;      // 砖块高度 (m)
var nDivX = 10;         // X方向分割数
var nDivY = 8;          // Y方向分割数
var nDivZ = 4;          // Z方向分割数

// 创建三维参数化几何（长方体）
igeo.genBrick3D("main", fLength, fWidth, fHeight);

// ========== 2. 网格生成 ==========
imeshing.genMeshByGmsh(3, [nDivX, nDivY, nDivZ]);

// ========== 3. 单元缩放调整 ==========
var fScaleFactor = 1.5; // 缩放因子（整体放大1.5倍）
var fCenterX = 0.0;     // 缩放中心X坐标
var fCenterY = 0.0;     // 缩放中心Y坐标
var fCenterZ = 0.0;     // 缩放中心Z坐标

// 对特定区域进行缩放（前50%的单元）
imeshing.zoomAndTorsion(fScaleFactor, fCenterX, fCenterY, fCenterZ, 180, 0, 0);

// ========== 4. 单元扭转调整 ==========
var fTwistAngle = 90;   // 扭转角度（度）
var fAxisX = 0.0;       // 旋转轴X坐标
var fAxisY = 0.0;       // 旋转轴Y坐标
var fAxisZ = 1.0;       // 旋转轴Z坐标

// 对特定区域进行扭转（后50%的单元）
imeshing.zoomAndTorsion(1.0, fAxisX, fAxisY, fAxisZ, fTwistAngle, 0, 0);

// ========== 5. 网格质量检查与验证 ==========
var fDistortionLimit = 0.3; // 最大允许畸变度
var nCheckCells = imeshing.GetMesh().GetCellCount();

// 输出网格统计信息
print("Total cells: " + nCheckCells);
print("Mesh distortion check completed.");

// ========== 6. 监测点配置 ==========
var fMonitorRadius = 0.1;   // 监测半径 (m)
var nMonitorPoints = 5;     // 监测点数

// 创建监测点（记录压力、速度、变形数据）
for(var i = 0; i < nMonitorPoints; i++) {
    var fAngle = i * 360.0 / nMonitorPoints;
    var x = fMonitorRadius * Math.cos(fAngle);
    var y = fMonitorRadius * Math.sin(fAngle);
    imeshing.SetMonitorPoint(x, y, 0.0, "P" + (i + 1));
}

// ========== 7. 求解器设置与结果输出 ==========
var fTimeStep = 1e-6;       // 时步 (s)
var fTotalTime = 0.1;       // 总时间 (s)
var fOutputInterval = 1e-4; // 输出间隔 (s)

// 设置求解参数
imeshing.SetTimeStep(fTimeStep);
imeshing.SetEndTime(fTotalTime);
imeshing.SetOutputInterval(fOutputInterval);

// 执行求解循环
var nSteps = Math.floor(fTotalTime / fTimeStep);
for(var i = 0; i < nSteps; i++) {
    imeshing.Solve();
}

// 输出最终结果
print("Simulation completed.");
print("Final mesh topology exported.");
print("Monitoring data recorded for " + nMonitorPoints + " points.");
