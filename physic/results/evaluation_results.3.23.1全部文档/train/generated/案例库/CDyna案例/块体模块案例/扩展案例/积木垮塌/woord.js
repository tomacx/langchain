setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();

doc.clearResult();
dyna.Clear();

// 创建一个矩形几何体
igeo.genRectS(0, 0, 0, 1, 0.1, 0, 0.05, 1);

// 使用Gmsh生成网格
imeshing.genMeshByGmsh(2);

// 设置蠕变计算参数
dyna.Set("Creep_Cal", 1);
dyna.Set("Creep_G_Inherit", 1);
dyna.Set("Auto_Creep_Time", 0);
dyna.Set("Elem_Plastic_Cal_Creep", 1); // 只有进入塑性的单元才进行蠕变计算

// 设置输出间隔
dyna.Set("Output_Interval", 500);

// 关闭重力和大位移效应
dyna.Set("Gravity", 0, 0, 0);
dyna.Set("Large_Displace", 0);

// 将网格读入Dyna内核
blkdyn.GetMesh(imeshing);

// 设置材料模型为Burger蠕变模型
blkdyn.SetModel("burger");

// 定义材料参数
blkdyn.SetMat(2000, 3e9, 0.3, 8e6, 5e6, 30, 10);

// 定义蠕变材料参数
blkdyn.SetCreepMat(1, 3e12, 3e9, 1e11, 3e9);
blkdyn.BindCreepMat(1, 1, 1);

// 固定x=0的边界条件
blkdyn.FixV("x", 0.0, "x", -0.01, 0.001);

// 在x=1处施加面力
var values = new Array(1e6, 0, 0);
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
blkdyn.ApplyConditionByCoord("face_force", values, gradient, 0.999, 1.01, -1, 1, -1, 1, false);

// 监控位移和应力
dyna.Monitor("block", "xdis", 0.2, 0, 0);
dyna.Monitor("block", "xdis", 0.4, 0, 0);
dyna.Monitor("block", "xdis", 0.6, 0, 0);
dyna.Monitor("block", "xdis", 0.8, 0, 0);
dyna.Monitor("block", "xdis", 1.0, 0, 0);

dyna.Monitor("block", "sxx", 0.2, 0, 0);
dyna.Monitor("block", "sxx", 0.4, 0, 0);
dyna.Monitor("block", "sxx", 0.6, 0, 0);
dyna.Monitor("block", "sxx", 0.8, 0, 0);
dyna.Monitor("block", "sxx", 1.0, 0, 0);

// 设置时间步长
dyna.Set("Time_Step", 36.0)

// 运行模拟
dyna.Solve(50000);
