setCurDir(getSrcDir());

// ========== 1. 初始化仿真环境并设置基本参数 ==========
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 2.0e-3");
dyna.Set("Output_Interval 500");
dyna.Set("Block_Soften_Value 0.2 0.2");

// ========== 2. 设置颗粒飞行参数 ==========
var flyPara = {
    If_Cal_Particle: 1,
    Particle_Cal_Type: 1,
    If_Particle_Cal_Rolling: 1,
    If_Particle_Cal_Torsion_Spring: 1
};
SetFlyPara(flyPara);

// ========== 3. 设置颗粒性质参数 ==========
var shapePara = {
    density: 2500,
    elastic_modulus: 5e7,
    poisson_ratio: 0.25,
    tensile_strength: 1e6,
    cohesion: 5e6,
    internal_friction_angle: 30,
    local_trans_damping: 0.01,
    local_rot_damping: 0.1,
    viscous_damping_ratio: 0.1
};
SetShapePara(shapePara);

// ========== 4. 创建几何模型和网格 ==========
var height = 2.0;
var length = 0.8;
var dout = 0.15;
var din = 0.14;
var thick = dout - din;

var sloop1 = geo.GenCylinder(-0.5 * length, height, 0, 0.5 * length, height, 0, 0.0, dout, 0.05, 0.05, 1);
var sloop2 = geo.GenCylinder(-0.5 * length + thick, height, 0, 0.5 * length - thick, height, 0, 0.0, din, 0.05, 0.05, 2);

var id1 = geo.GenVolume([sloop1, sloop2], 1);
var id2 = geo.GenVolume([sloop2], 2);

mesh.GenMeshByGmsh(3);

// ========== 5. 设置材料参数 ==========
blkdyn.SetMat(13000, 2e11, 0.3, 50e6, 50e6, 0, 0, 1); // 侧壁破片等效层
blkdyn.SetMat(1700, 1e9, 0.3, 800e6, 800e6, 0, 0, 2); // 炸药单元

// ========== 6. 设置起爆源参数 ==========
var apos = [-0.5 * length, height, 0];
blkdyn.SetLandauSource(1, 1700, 7957, 7e6, 3.0, 1.3333, 26e9, apos, 0.0, 10);
blkdyn.BindLandauSource(1, 2, 2);

blkdyn.SetModel("SoftenMC", 1);
blkdyn.SetModel("Landau", 2);

// ========== 7. 创建颗粒并导入 ==========
var prad = 0.004;
var rowsum = Math.floor((length - 2.0 * thick) / (prad * 2.0));
var colsum = Math.floor(2.0 * Math.PI * (din + 0.5 * thick) / (prad * 2.0));

for(var i = 0; i < rowsum; i++) {
    var xcoord = -0.5 * length + thick + prad + i * 2.0 * prad;
    var igroup = i + 1;
    var qq = "" + igroup;
    imesh.genParCircle(3, qq, colsum, prad, din + 0.5 * thick, xcoord, height, 0, 1, 0, 0);
}

imesh.exportPDyna("Ball.dat");

// ========== 8. 导入颗粒并设置材料 ==========
pdyna.Import("pdyna", "Ball.dat");
pdyna.SetModel("brittleMC");
pdyna.SetPartMat(2500, 5e7, 0.25, 1e6, 5e6, 30, 0.01, 0.1, 0.1);

// ========== 9. 创建环形靶板用于监测穿透行为 ==========
var targetRadius = 0.5;
var targetHeight = 0.1;
CrtPeneTarget(targetRadius, targetHeight, 180);

// ========== 10. 设置监测点 ==========
for(var i = 0; i <= 10; i++) {
    dyna.Monitor("block", "yvel", -0.5 * length + i * 0.1 * length, height, 0);
}

// ========== 11. 计算装药比与壳体质量 ==========
var chargeRatio = CalChargeRatio();
var shellMass = CalShellMass();

// ========== 12. 设置阻尼和求解参数 ==========
blkdyn.SetLocalDamp(0.0);
dyna.Set("Time_Step 5e-8");
pdyna.SetModel("none");

// ========== 13. 执行仿真运行 ==========
dyna.Solve(10000);

// ========== 14. 导出靶板穿透信息 ==========
ExportPeneTargetInfo();

// ========== 15. 保存结果文件 ==========
dyna.Save("blast.sav");

// ========== 16. 关闭脚本执行会话 ==========
console.log("颗粒飞散计算完成，结果已保存至 blast.sav");
