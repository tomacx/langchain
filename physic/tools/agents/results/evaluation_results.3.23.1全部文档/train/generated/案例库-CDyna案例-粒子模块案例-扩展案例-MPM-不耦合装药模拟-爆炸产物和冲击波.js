setCurDir(getSrcDir());

// 初始化仿真环境
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 0.0 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 0.0");
dyna.Set("Output_Interval 500");
dyna.Set("Moniter_Iter 10");
dyna.Set("If_Virtural_Mass 0");

// 设置颗粒计算模式为MPM
dyna.Set("Particle_Cal_Type 4");
dyna.Set("MPM_Cal_Mode 2");

// 创建装药几何模型（炸药圆柱体）
var x1 = -0.5;
var y1 = -0.5;
var x2 = 0.5;
var y2 = 0.5;
var z1 = -0.1;
var z2 = 0.1;

pdyna.RegularCreateByCoord(1, 1, 0.01, x1, y1, z1, x2, y2, z2);

// 创建介质几何模型（岩土块体）
var med_x1 = -1.5;
var med_y1 = -1.5;
var med_z1 = -0.5;
var med_x2 = 1.5;
var med_y2 = 1.5;
var med_z2 = 0.5;

pdyna.RegularCreateByCoord(2, 1, 0.01, med_x1, med_y1, med_z1, med_x2, med_y2, med_z2);

// 设置炸药材料参数（朗道模型）
var fDensity = 1630; // TNT密度 kg/m³
var fD = 6930.0;     // 爆速 m/s
var fQ = 4.5e6;      // 热值 J/kg
var fGama1 = 3.0;    // 朗道参数gamma1
var fGama2 = 1.33333;// 朗道参数gamma2
var fP_CJ = 20e9;    // CJ压力 Pa

// 设置炸药材料属性（组1）
pdyna.SetMat(fDensity, 1e8, 0.25, 1e6, 1e6, 15, 0.0, 0.0, 1);

// 设置朗道模型参数
var firePos = [0.0, 0.0, 0.0]; // 起爆点位置
pdyna.SetLandauSource(1, fDensity, fD, fQ, fGama1, fGama2, fP_CJ, firePos, 0.0, 15e-3);

// 绑定朗道模型到炸药单元
pdyna.BindLandauSource(1, 1, 1);

// 设置介质材料参数（Mohr-Coulomb本构）
pdyna.SetMatByCoord(2500, 7e10, 0.25, 20e6, 40e6, 35, 0.01, 0.0, [med_x1, med_y1, med_z1], [med_x2, med_y2, med_z2]);

// 创建MPM背景网格
mpm.SetBackGrid(2, 0.01, [-1.5, -1.5, -0.5], [1.5, 1.5, 0.5]);

// 设置炸药单元为MPM模型
mpm.SetModelByGroup("Landau", 1, 1);

// 设置介质单元为Mohr-Coulomb模型
mpm.SetModelByGroup("MC", 2, 2);

// 设置无反射边界条件
blkdyn.SetQuietBoundByCoord(-0.5, 0.5, -1e5, 1e5, -1e5, 1e5);
blkdyn.SetQuietBoundByCoord(1.5, 2.5, -1e5, 1e5, -1e5, 1e5);
blkdyn.SetQuietBoundByCoord(-1e5, 1e5, -0.5, 0.5, -1e5, 1e5);
blkdyn.SetQuietBoundByCoord(-1e5, 1e5, 1.5, 2.5, -1e5, 1e5);

// 设置局部阻尼
pdyna.SetLocalDamp(0.001);

// 创建监测点请求（记录特定位置的压力、速度历史）
var monitorPos = [0.0, 0.0, 0.2]; // 监测点位置
pdyna.CreateMonitorPoint(monitorPos[0], monitorPos[1], monitorPos[2]);

// 设置起爆时间参数
dyna.Set("fBeginTime 0.0");
dyna.Set("fLastTime 15e-3");

// 求解仿真（总时长约20ms）
dyna.DynaCycle(20e-3);

// 输出结果文件
pdyna.ExportResults();
