setCurDir(getSrcDir());

// 初始化环境设置
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("RdFace_MechModel 3"); // 3表示壳单元模型

// 创建平面壳单元几何（2D网格）
igeo.genRectS(0, 0, 0, 4.0, 0.1, 0, 4.0, 1);

// 生成壳单元网格
imeshing.genMeshByGmsh(2);

// 将网格读入dyna内核
blkdyn.GetMesh(imeshing);

// 设置结构单元材料模型为线弹性
blkdyn.SetModel("linear");

// 设置材料参数：密度, 弹性模量, 泊松比, 屈服强度, 切变模量, 其他参数
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 40, 15);

// 设置壳单元边界条件 - 两端侧向固定（X方向约束）
blkdyn.FixV("x", 0.0, "x", -0.01, 0.01); // 左侧固定
blkdyn.FixV("x", 3.99, "x", -0.01, 0.01); // 右侧固定

// 设置壳单元边界条件 - Y方向约束（防止刚体位移）
blkdyn.FixV("y", 0.0, "y", -0.01, 0.01); // 底部固定
blkdyn.FixV("z", 0.0, "z", -0.01, 0.01); // Z方向约束

// 设置动态计算时步
dyna.Set("Time_Step 2e-5");

// 设置监测点用于后续输出
dyna.Monitor("block", "ydis", 1.0, 0, 0);
dyna.Monitor("block", "ydis", 2.0, 0, 0);
dyna.Monitor("block", "ydis", 3.0, 0, 0);

// 设置计算步数
var stepCount = 10000;

// 执行求解
blkdyn.Solve(stepCount);
