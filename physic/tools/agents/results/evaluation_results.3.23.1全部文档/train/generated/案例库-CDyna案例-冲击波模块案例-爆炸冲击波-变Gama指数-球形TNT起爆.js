setCurDir(getSrcDir());

// 初始化并行计算线程
dyna.numThreads = 8;

// 全局参数设置
dyna.Set("Gravity 0 0 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 0");
dyna.Set("Contact_Detect_Tol 1e-4");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Output_Interval 50");
dyna.Set("Monitor_Iter 2");
dyna.Set("Time_Now 0");

// 定义流体域网格：3D网格，1x1x1单元，尺寸100mm，原点[0,0,0]
skwave.DefMesh(3, [1, 1, 1], [100, 100, 100], [0, 0, 0]);

// 设置朗道变Gama模型：nMode=2，TNT参数
// fDens=1630, fD=6930, fQ=4.5e6, fGama1=3.0, fGama2=1.33333
skwave.SetGama(2, 1630.0, 6930.0, 4.5e6, 3.0, 4.0 / 3.0);

// 初始化空气流体域：初始压力1.01e5 Pa，密度1.02 kg/m³，半径1000mm
skwave.InitBySphere(1.01e5, 1.02, [0, 0, 0], [0, 0, 0], 1000.0);

// 初始化TNT炸药：CJ压力20e9 Pa，密度1630 kg/m³，半径100mm
skwave.InitBySphere(20e9, 1630, [0, 0, 0], [0, 0, 0], 0.1);

// 设置边界条件：无反射边界（透射）
skwave.SetBound(1, 0, 1, 0, 1, 0);

// 设置起爆点位置（球心）
var firePos = new Array(0.0, 0.0, 0.0);

// 设置起爆时间
var fBeginTime = 0.0;

// 设置炸药能量释放持续时间
var fLastTime = 15e-3; // 15ms

// 布置监测传感器：压力监测点（径向、切向、轴向）
for (var i = 0; i < 10; i++) {
    dyna.Monitor("skwave", "sw_pp", (i + 1) * 0.1, 0, 0); // 径向监测
}

for (var i = 0; i < 10; i++) {
    dyna.Monitor("skwave", "sw_pp", 0, (i + 1) * 0.1, 0); // 切向监测
}

for (var i = 0; i < 10; i++) {
    dyna.Monitor("skwave", "sw_pp", 0, 0, (i + 1) * 0.1); // 轴向监测
}

// 时间步长设置
dyna.Set("Time_Step 3e-4");

// 执行仿真计算
dyna.DynaCycle(4e-4);

print("冲击波传播仿真完成");
