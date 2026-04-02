// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置三个方向的重力加速度均为0
dyna.Set("Gravity 0.0 0.0 0.0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 500");

// 设置监测信息输出时步为10步
dyna.Set("Monitor_Iter 10");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 打开接触检测更新网格信息
dyna.Set("If_Renew_Contact 1");

// 设置PCMM颗粒的接触容差
dyna.Set("PCMM_Elem_Tol 2e-4");

// 设置颗粒的计算模式为2-PCMM颗粒模式
dyna.Set("Particle_Cal_Type 1");

// 设置MPM计算模式
dyna.Set("MPM_Cal_Mode 2");

// 导入Gmsh格式的网格文件
blkdyn.ImportGrid("gmsh", "CDEM.msh");

// 指定组1-2的单元本构为线弹性本构
blkdyn.SetModel("linear");
blkdyn.SetModel("JWL", 2);

// 设置材料参数，炸药
blkdyn.SetMat(2000, 1.5e8, 0.25, 5e6, 5e6, 30, 5);
blkdyn.SetMat(1150, 1e8, 0.25, 3e6, 1e6, 15, 5, 2);

// 设定TNT爆源参数
var apos = [60.0, 60.0, 0.0];
blkdyn.SetJWLSource(1, 1630, 3e9, 10e9, 1e9, 4.2, 0.95, 0.3, 5e9, 6930.0, apos, 0.0, 10.0);
blkdyn.BindJWLSource(1, 2, 2);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.001);

// 施加无反射边界条件
blkdyn.SetQuietBoundByCoord(-0.1, 0.1, -1e5, 1e5, -1e5, 1e5);
blkdyn.SetQuietBoundByCoord(119.1, 120.1, -1e5, 1e5, -1e5, 1e5);
blkdyn.SetQuietBoundByCoord(-1e5, 1e5, -0.1, 0.1, -1e5, 1e5);
blkdyn.SetQuietBoundByCoord(-1e5, 1e5, 119.1, 120.1, -1e5, 1e5);

// 监测Y方向应力
for (var i = 0; i <= 5; i++) {
    dyna.Monitor("block", "syy", 5, 5.0 + i, 0);
}

// 监测X方向应力
for (var i = 0; i <= 5; i++) {
    dyna.Monitor("block", "sxx", 5.0 + i, 4.8, 0);
}
