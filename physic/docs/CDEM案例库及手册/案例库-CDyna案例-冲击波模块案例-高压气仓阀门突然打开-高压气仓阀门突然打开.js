setCurDir(getSrcDir());

//设置计算时步
dyna.Set("Time_Step 2e-6");
//设置云图输出间隔
dyna.Set("Output_Interval 500");

//定义一个二维的流体域
skwave.DefMesh(2, [3, 3], [300, 300]);

skwave.SetSolid(1, -1e3, 1e3, -1e3, 1e3, -1e-3, 1e3);
skwave.SetSolid(0, 0.05 , 1.0, 0.05, 2.95, -1, 1);
skwave.SetSolid(0, 0.9, 2.0, 1.45, 1.55, -1, 1);
skwave.SetSolid(0, 1.9, 2.9, 1.35, 1.65, -1, 1);

skwave.InitBySphere(1.01e5, 1.02, [0,0,0], [0,0, 0], 100.0);

skwave.Init(1.01e7, 102, [0,0,0], 0.05 , 1.5, 0.05, 2.95, -1, 1);

dyna.Monitor("skwave","sw_dens", 0.5, 1.5, 0);
dyna.Monitor("skwave","sw_dens", 1.0, 1.5, 0);
dyna.Monitor("skwave","sw_dens", 1.5, 1.5, 0);
dyna.Monitor("skwave","sw_dens", 2.0, 1.5, 0);
dyna.Monitor("skwave","sw_dens", 2.5, 1.5, 0);

dyna.Monitor("skwave","sw_pp", 0.5, 1.5, 0);
dyna.Monitor("skwave","sw_pp", 1.0, 1.5, 0);
dyna.Monitor("skwave","sw_pp", 1.5, 1.5, 0);
dyna.Monitor("skwave","sw_pp", 2.0, 1.5, 0);
dyna.Monitor("skwave","sw_pp", 2.5, 1.5, 0);


dyna.DynaCycle(2e-2);

print("求解完毕");