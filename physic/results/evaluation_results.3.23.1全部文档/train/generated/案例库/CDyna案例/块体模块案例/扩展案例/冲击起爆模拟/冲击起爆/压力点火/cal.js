// 初始化求解器参数
setCurDir(getSrcDir());

dyna.Set("Time_Step", 3e-4);
dyna.Set("Output_Interval", 100);

// 定义网格
skwave.DefMesh(3, [1000, 500, 100], [200, 200, 60]);

// 设置固体区域
skwave.SetSolid(1, 140, 220, 190, 310, -50, 50);
skwave.SetSolidByCylinder(1, [800, 250, -30], [800, 250, 30], 0, 30);

// 设置气体云区域
skwave.SetGasCloud(1, 0, 200, 0, 500, -100, 200);
skwave.SetGasCloudByCylinder(1, [600, 250, -100], [600, 250, 100], 0, 100);

// 初始化气体云
skwave.InitBySphere(8.321e4, 1.201, [0, 0, 0], [0, 0, 0], 10000.0);
skwave.SetFirePos(600, 250, 0, 20, 1.945, 4.162E2, 6.27E5);

// 设置边界条件
skwave.SetBound(0, 0, 0, 0, 1, 0);

// 添加监控点
for (var i = 1; i < 10; i++) {
    dyna.Monitor("skwave", "sw_dens", 100 * i, 250, 50);
}

for (var i = 1; i < 10; i++) {
    dyna.Monitor("skwave", "sw_pp", 100 * i, 250, 50);
}

for (var i = 1; i < 10; i++) {
    dyna.Monitor("skwave", "sw_temp", 100 * i, 250, 50);
}

// 运行求解器
dyna.DynaCycle(10);

print("求解完成");
