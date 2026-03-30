setCurDir(getSrcDir());

// 设置求解器基本参数
dyna.Set("Time_Step 1e-5");
dyna.Set("Output_Interval 200");

// 定义2D网格尺寸和单元数量
skwave.DefMesh(2, [10, 10], [100, 100]);

// 设置固体区域（非流体区域）
skwave.SetSolid(1, 4, 6, 4, 6, -1, 1);

// 定义冲击波入流多边形区域（顺时针或逆时针排列）
var aPolygon = new Array(3);
aPolygon[0] = [0, 0, 0];
aPolygon[1] = [5, 0, 0];
aPolygon[2] = [5, 5, 0];

// 根据多边形区域设定冲击波入流条件（压力、密度）
skwave.InitByPolygon(1e5, 1.01, aPolygon);

// 设置X和Y方向边界条件（0=透射，1=固壁），2D情况下不设置Z方向
skwave.SetBound(1, 1, 1, 1);

// 设置监测节点：密度监测
dyna.Monitor("skwave", "sw_dens", 1, 5, 0);
dyna.Monitor("skwave", "sw_dens", 2, 5, 0);
dyna.Monitor("skwave", "sw_dens", 3, 5, 0);

// 设置监测节点：压力监测
dyna.Monitor("skwave", "sw_pp", 1, 5, 0);
dyna.Monitor("skwave", "sw_pp", 2, 5, 0);
dyna.Monitor("skwave", "sw_pp", 3, 5, 0);

// 设置求解循环次数（可根据需要调整）
dyna.DynaCycle(10);

print("冲击波入流条件设置完成，求解结束");
