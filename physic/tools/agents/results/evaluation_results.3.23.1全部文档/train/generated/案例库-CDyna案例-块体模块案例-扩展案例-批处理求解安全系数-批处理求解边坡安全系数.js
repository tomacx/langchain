setCurDir(getSrcDir());

// ========== 批处理参数定义 ==========
var SlopeH = [10.0, 15.0, 20.0, 25.0, 30.0];
var Sita = [45.0, 45.0, 45.0, 45.0, 45.0];
var Fos = new Array(5);
var LeftLRatio = 1.0;
var RightLRatio = 2.0;
var BaseHRatio = 1.5;
var size1 = 1.5;
var size2 = 4.0;

// 岩土材料参数（密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角）
var rho = 2000;
var E = 3e8;
var nu = 0.33;
var c = 5e4;
var t = 1e4;
var phi = 25.0;
var psi = 10.0;

// 求解控制参数
var displimit = 1.0;
var unbalance_ratio = "1e-4";
var save_filename = "slope.sav";

// ========== 批处理循环 ==========
for(var i = 0; i < SlopeH.length; i++) {
    // 清除各模块数据
    igeo.clear();
    imeshing.clear();
    dyna.Clear();
    doc.clearResult();

    // ========== 几何创建 ==========
    var SlopeL = SlopeH[i] / Math.tan(Sita[i] / 180.0 * Math.PI);
    var LeftL = LeftLRatio * SlopeL;
    var RightL = RightLRatio * SlopeL;
    var BaseH = BaseHRatio * SlopeH[i];
    var TotalL = LeftL + SlopeL + RightL;
    var TotalH = BaseH + SlopeH[i];

    var aCoord = new Array(6);
    aCoord[0] = [0, 0, 0, size2];
    aCoord[1] = [TotalL, 0, 0, size2];
    aCoord[2] = [TotalL, TotalH, 0, size2];
    aCoord[3] = [LeftL + SlopeL, TotalH, 0, size1];
    aCoord[4] = [LeftL, BaseH, 0, size1];
    aCoord[5] = [0, BaseH, 0, size2];

    igeo.genPloygenS(aCoord, 1);

    // ========== 网格划分 ==========
    imeshing.genMeshByGmsh(2);

    // ========== 导入网格到核心计算模块 ==========
    blkdyn.GetMesh(imeshing);

    // ========== 设置求解参数 ==========
    dyna.Set("Mechanic_Cal 1");
    dyna.Set("UnBalance_Ratio " + unbalance_ratio);
    dyna.Set("Gravity 0 -9.8 0");
    dyna.Set("Large_Displace 0");
    dyna.Set("Output_Interval 5000");
    dyna.Set("Moniter_Iter 100");
    dyna.Set("If_Virtural_Mass 1");
    dyna.Set("Virtural_Step 0.6");

    // ========== 设置材料参数 ==========
    blkdyn.SetModel("MC");
    blkdyn.SetMat(rho, E, nu, c, t, phi, psi);

    // ========== 设置边界条件 ==========
    blkdyn.FixVByCoord("x", 0.0, -0.001, 0.001, -1e10, 1e10, -1e10, 1e10);
    blkdyn.FixVByCoord("x", 0.0, TotalL - 0.001, TotalL + 0.001, -1e10, 1e10, -1e10, 1e10);
    blkdyn.FixVByCoord("y", 0.0, -1e10, 1e10, -1e10, 0.001, -1e10, 1e10);

    // ========== 设置阻尼 ==========
    blkdyn.SetLocalDamp(0.8);

    // ========== 设置监测点 ==========
    var monitorCoord = [SlopeL / 2, SlopeH[i] / 2, 0];
    dyna.Monitor("block", "xdis", monitorCoord[0], monitorCoord[1], monitorCoord[2]);

    // ========== 执行安全系数求解 ==========
    var coord = new Array(monitorCoord[0], monitorCoord[1], monitorCoord[2]);
    Fos[i] = dyna.SolveFos(5000, 8, displimit, coord, save_filename);

    print("工况" + (i+1) + " - 坡高: " + SlopeH[i] + "m, 安全系数: " + Fos[i]);
}

// ========== 输出汇总报告 ==========
print("\n========== 批处理求解完成 ==========");
print("总工况数: " + SlopeH.length);
print("各工况安全系数结果:");
for(var j = 0; j < Fos.length; j++) {
    print("  坡高" + (j+1) + "m: " + Fos[j]);
}
print("=====================================");
