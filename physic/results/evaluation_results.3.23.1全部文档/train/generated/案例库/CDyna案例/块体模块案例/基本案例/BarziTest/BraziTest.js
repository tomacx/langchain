setCurDir(getSrcDir());

dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");

dyna.Set("If_Virtural_Mass 0");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 2.0e-3");
dyna.Set("Output_Interval 500");
dyna.Set("Block_Soften_Value 0.2 0.2");
dyna.Set("If_Cal_Particle 0");

blkdyn.ImportGrid("ansys", "2_0.01.dat");

// 将设定坐标范围内的自由表面设置为接触面
blkdyn.CrtBoundIFaceByCoord(-1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
// 更新接触面网格
blkdyn.UpdateIFaceMesh();

// 设置单元本构模型为线弹性模型
blkdyn.SetModel("linear");
// 设置炸药参数 density young poisson cohesion tension friction dilation
blkdyn.SetMat(1800, 3e9, 0.24, 3e5, 1e5, 0, 0, 2);
// 设置侧壁破片参数（钢）-等效层
blkdyn.SetMat(9000, 4e11, 0.3, 800e5, 800e5, 0, 0, 1);

// 设置接触面模型
blkdyn.SetIModel("brittleMC");
// 设置接触面参数
blkdyn.SetIMat(5e11, 5e11, 0.01, 0, 0);
blkdyn.SetIStiffByElem(100);
blkdyn.SetIStrengthByElem();

// 设置阻尼为0
blkdyn.SetLocalDamp(0.1);

// 施加重力
blkdyn.ApplyGravity();

// 爆炸载荷设定
var pos = new Array(2);
for (var i = 0; i < 2; i++) {
    pos[i] = [i * 0.31, 0.0, 0];
}
blkdyn.SetLandauSource(1, 1800, 8070, 5.67e6, 2.4, 1.3, 3.4e9, pos[0], 0, 1e-4);
blkdyn.SetLandauSource(2, 1800, 8070, 5.67e6, 2.4, 1.3, 3.4e9, pos[1], 0, 1e-4);

// 求解
dyna.Solve(1000);
