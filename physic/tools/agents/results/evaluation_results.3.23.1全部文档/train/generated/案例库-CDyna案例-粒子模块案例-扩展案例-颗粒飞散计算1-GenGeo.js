setCurDir(getSrcDir());

// ========== 1. 初始化仿真环境 ==========
var height = 2.0;      // 计算区域高度
var length = 0.8;      // 圆域半径
var prad = 0.004;      // 颗粒半径 (m)
var nGrains = 500;     // 颗粒总数

// ========== 2. 创建二维圆域模型 ==========
// blkdyn.GenCircle(<fRadIn, fRadOut, iNoRad, iNoCir, iGroup>)
// 内半径=0表示实心圆，外半径=length，径向分割10，环向分割30，组号1
blkdyn.GenCircle(0.0, length, 10, 30, 1);

// ========== 3. 导入网格到颗粒求解器 ==========
blkdyn.GetMesh("imeshing");

// ========== 4. 在圆域范围内随机生成颗粒单元 ==========
// pdyna.CreateByCoord(<iTotalNo, iGrp, iType, fBallRad, fCircleRad, CenterX, CenterY, CenterZ, NormalX, NormalY, NormalZ>)
var x = new Array(0.0, length);
var y = new Array(0.0, 0.0);
var z = new Array(0.0, height);

// 第一组颗粒：实心圆域内随机分布
pdyna.CreateByCoord(nGrains, 1, 2, prad, length, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);

// ========== 5. 设置材料属性 ==========
// pdyna.SetMat(<iMatID, fYoungModulus, fPoissonRatio, fDensity, fShearModulus, fBulkModulus, fThermalCond, iGrp>)
pdyna.SetMat(17936, 4e11, 0.2, 2500.0, 0.0, 0.0, 0.0, 1);

// ========== 6. 设置仿真控制参数 ==========
// 重力方向：Y轴负半轴
dyna.Set("Gravity 0 -9.8 0");

// 允许大变形
dyna.Set("Large_Displace 1");

// 虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 接触检测更新
dyna.Set("If_Renew_Contact 1");

// 接触检测容差
dyna.Set("Contact_Detect_Tol 2.0e-3");

// 输出间隔
dyna.Set("Output_Interval 500");

// 软化值
dyna.Set("Block_Soften_Value 0.2 0.2");

// 不计算粒子（使用已有颗粒）
dyna.Set("If_Cal_Particle 0");

// ========== 7. 设置阻尼系数 ==========
blkdyn.SetLocalDamp(0.0);

// ========== 8. 设置时间步长和求解时长 ==========
dyna.Set("Time_Step 5e-8");

// ========== 9. 设置监测点（监测速度等变量） ==========
for(var i = 0; i <= 10; i++) {
    dyna.Monitor("block", "yvel", -0.5 * length + i * 0.1 * length, height, 0);
}

// ========== 10. 导出颗粒数据到PDyna格式 ==========
pdyna.exportPDyna("Ball.dat");

// ========== 11. 导入颗粒并设置模型类型 ==========
pdyna.Import("pdyna", "Ball.dat");
pdyna.SetModel("brittleMC");

// ========== 12. 执行求解 ==========
dyna.Solve(10000);

// ========== 13. 保存结果文件 ==========
dyna.Save("blast.sav");

// ========== 14. 导出靶板信息（可选） ==========
pfly.ExportPeneCircleTargetInfo(90.0, 100.0, 50.0, 1);
