setCurDir(getSrcDir());

// 初始化环境
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置重力加速度为0
dyna.Set("Gravity 0.0 0.0 0.0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置计算结果输出间隔
dyna.Set("Output_Interval 100");

// 设置监测信息输出时步
dyna.Set("Monitor_Iter 10");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 打开接触更新开关
dyna.Set("If_Renew_Contact 1");

// 设置接触容差
dyna.Set("Contact_Detect_Tol 0.001");

// 定义流体域网格（冲击波模块）
skwave.DefMesh(3, [500, 500, 500], [100, 100, 100]);

// 设置固体边界（可选，用于模拟容器壁）
skwave.SetSolid(1, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 定义炸药装药区域（圆柱形装药）
skwave.SetGasCloudByCylinder(1, [0, 0, 0], [0, 0, 20], 0, 10);

// 设置流体域初始状态：压力、密度、流速
skwave.Init(1.013e5, 1.225, [0, 0, 0]);

// 配置炸药JWL状态方程参数（TNT典型参数）
// 序号、装药密度、初始比内能、fA、fB、fR1、fA、fA、fA、爆速、点火坐标、点火时间、持续时间
blkdyn.SetJWLSource(1, 1630, 7.0e9, 371.2e9, 3.2e9, 4.2, 0.95, 0.30, 21e9, 7830, [0, 0, 0], 0, 15e-3);

// 绑定JWL源到流体域
blkdyn.BindJWLSource(1, 1, 1);

// 设置爆生气体逸散参数（特征时间、特征指数、ID范围）
blkdyn.SetJWLGasLeakMat(5e-4, 1.2, 1, 10);

// 设置点火位置及点火后气体参数
// x=0, y=0, z=0, 半径=5m, 密度=1.945kg/m³, 径向速度=416.2m/s, 压力=6.27e5Pa
skwave.SetFirePos(0, 0, 0, 5, 1.945, 416.2, 6.27e5);

// 设置起爆时间（点火延迟）
dyna.Set("SK_ActT 0.0");

// 设置监测点记录压力、密度、温度等物理量
for (var i = 1; i <= 20; i++) {
    dyna.Monitor("skwave", "sw_dens", i * 5, 250, 0);
    dyna.Monitor("skwave", "sw_pp", i * 5, 250, 0);
    dyna.Monitor("skwave", "sw_temp", i * 5, 250, 0);
}

// 设置并行计算选项（千万单元级工程问题）
dyna.Set("Parallel_Cal 1");

// 执行计算循环
dyna.DynaCycle(100);

print("冲击起爆-压力点火仿真完成");
