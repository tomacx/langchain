setCurDir(getSrcDir());

// 设置计算参数
dyna.Set("Time_Step", 2e-6);
dyna.Set("Output_Interval", 100);

// 定义冲击波网格
skwave.DefMesh(3, [50, 50, 50], [100, 100, 100]);

// 设置固体区域
skwave.SetSolid(1, -25, 25, -25, 25, -25, 25);

// 初始化冲击波源
skwave.InitBySphere(1.01e5, 1.02, [0, 0, 0], [0, 0, 0], 1000.0);
skwave.InitBySphere(1e9, 1000, [0, 0, 0], [10, 10, 10], 0.3);

// 设置监测点
for (var i = 1; i < 10; i++) {
    dyna.Monitor("skwave", "sw_dens", 5 * i, 25, 0);
}

for (var i = 1; i < 10; i++) {
    dyna.Monitor("skwave", "sw_pp", 5 * i, 25, 0);
}

// 运行计算
dyna.DynaCycle(0.1);

print("求解完毕");
