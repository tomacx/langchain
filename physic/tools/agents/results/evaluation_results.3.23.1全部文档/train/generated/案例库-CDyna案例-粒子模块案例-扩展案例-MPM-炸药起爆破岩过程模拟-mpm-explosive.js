setCurDir(getSrcDir());

// ==================== 全局参数设置 ====================
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 0.0 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Output_Interval 200");
dyna.Set("Moniter_Iter 10");
dyna.Set("Time_Step 1e-8");
dyna.Set("Particle_Cal_Type 4");
dyna.Set("MPM_Cal_Mode 2");

// ==================== 导入炸药单元 ====================
blkdyn.ImportGrid("gid", "explosive.msh");

// ==================== 设置炸药本构模型 ====================
blkdyn.SetModel("JWL");

// 设置炸药基本参数：density, young, poisson, tension, cohesion, friction, localdamp, viscdamp
blkdyn.SetMat(1630, 7e9, 0.25, 3e6, 1e6, 35, 0.0, 0);

// ==================== 设置TNT朗道参数 ====================
// 典型TNT朗道参数：density=1630, D=6930, Q=4.5e6, Gama1=3.0, Gama2=1.33333, P_CJ=20e9
var pos = new Array(0.0, 0.0, 0.0);
blkdyn.SetLandauSource(1, 1630, 6930, 4.5e6, 3.0, 1.33333, 20e9, pos, 0.0, 1e-2);

// 绑定朗道源到炸药单元
blkdyn.BindLandauSource(1, 1, 100);

// ==================== 设置炸药局部阻尼 ====================
blkdyn.SetLocalDamp(0.0);

// ==================== 导入岩石颗粒模型 ====================
pdyna.Import("gid", "rock.msh");

// ==================== 设置岩石材料参数 ====================
// density, young, poisson, tension, cohesion, friction, localdamp, viscdamp
pdyna.SetMat(2500, 7e10, 0.25, 20e6, 40e6, 35, 0.01, 0);

// ==================== 创建MPM背景网格 ====================
mpm.SetBackGrid(2, 0.01, [-0.3, -0.3, 0], [60, 60, 0]);

// ==================== 设置MPM模型为Mohr-Coulomb ====================
mpm.SetModelByGroup("MC", 1, 2);

// ==================== 设置无反射边界条件 ====================
blkdyn.SetQuietBoundByCoord(-0.1, 0.1, -1e5, 1e5, -1e5, 1e5);
blkdyn.SetQuietBoundByCoord(119.1, 120.1, -1e5, 1e5, -1e5, 1e5);
blkdyn.SetQuietBoundByCoord(-1e5, 1e5, -0.1, 0.1, -1e5, 1e5);
blkdyn.SetQuietBoundByCoord(-1e5, 1e5, 119.1, 120.1, -1e5, 1e5);

// ==================== 设置接触参数 ====================
dyna.Set("If_Contact_Use_GlobMat 1 2 1e13 1e13 0.0 0.0 0.0");
dyna.Set("PCMM_Elem_Tol 2e-4");

// ==================== 求解计算 ====================
dyna.DynaCycle(5e-3);
