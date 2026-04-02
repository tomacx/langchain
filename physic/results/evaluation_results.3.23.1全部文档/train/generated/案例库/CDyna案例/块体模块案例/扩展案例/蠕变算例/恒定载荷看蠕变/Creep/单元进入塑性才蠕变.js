setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();

doc.clearResult();
dyna.Clear();

// 创建一个矩形实体
igeo.genRectS(0, 0, 0, 1, 0.1, 0, 0.05, 1);

// 使用Gmsh生成网格
imeshing.genMeshByGmsh(2);

// 将平台网格读入dyna内核
blkdyn.GetMesh(imeshing);

// 设置材料模型和参数
blkdyn.SetModel("burger");
blkdyn.SetMat(2000, 3e9, 0.3, 8e6, 5e6, 30, 10);

// 设置蠕变材料参数并绑定
blkdyn.SetCreepMat(1, 3e12, 3e9, 1e11, 3e9);
blkdyn.BindCreepMat(1, 1, 1);

// 固定边界条件
blkdyn.FixV("x", 0.0, "x", -0.01, 0.001);

// 设置施加的三个基础值
var values = new Array(1e6, 0, 0);
// 设置9个变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);

/// 若单元面心位于坐标范围内，则施加面力。
blkdyn.ApplyConditionByCoord("face_force", values, gradient, 0.999, 1.01, -1, 1, -1, 1, false);

// 设置监控点
dyna.Monitor("block","xdis", 0.2, 0, 0);
dyna.Monitor("block","xdis", 0.4, 0, 0);
dyna.Monitor("block","xdis", 0.6, 0, 0);
dyna.Monitor("block","xdis", 0.8, 0, 0);
dyna.Monitor("block","xdis", 1.0, 0, 0);

dyna.Monitor("block","sxx", 0.2, 0, 0);
dyna.Monitor("block","sxx", 0.4, 0, 0);
dyna.Monitor("block","sxx", 0.6, 0, 0);
dyna.Monitor("block","sxx", 0.8, 0, 0);
dyna.Monitor("block","sxx", 1.0, 0, 0);

// 设置时间步长
dyna.Set("Time_Step", 36.0);

// 求解
dyna.Solve(50000);
