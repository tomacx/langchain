setCurDir(getSrcDir());

// 设置求解参数
dyna.Set("Time_Step", 1e-5);
dyna.Set("Output_Interval", 100);

// 定义网格
skwave.DefMesh(3, [20, 20, 20], [100, 100, 100]);

// 设置固体区域
skwave.SetSolid(1, -50, 50, -50, 50, -50, 50);

// 初始化气体云
skwave.InitBySphere(8.321e4, 1.201, [0, 0, 0], [0, 0, 0], 10000.0);

// 设置可燃气体区域
skwave.SetGasCloud(1, -50, 50, -50, 50, -50, 50);

// 设置起爆点
skwave.SetFirePos(0, 0, 0, 20, 1.945, 4.162E2, 6.27E5);

// 添加监控点
for (var i = 1; i < 10; i++) {
    dyna.Monitor("skwave", "sw_dens", 10 * i, 0, 0);
}

for (var i = 1; i < 10; i++) {
    dyna.Monitor("skwave", "sw_pp", 10 * i, 0, 0);
}

// 求解
dyna.DynaCycle(10);

print("求解完成");
