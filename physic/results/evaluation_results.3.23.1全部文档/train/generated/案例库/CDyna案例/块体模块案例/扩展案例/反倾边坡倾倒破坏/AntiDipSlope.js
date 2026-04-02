// 设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

// 设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 1");

// 设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置接触容差，没找到接触之前，容差设置大一点
dyna.Set("Contact_Detect_Tol 5e-3");

// 导入gid格式的块体网格数据
blkdyn.ImportGrid("gid", "blockmesh.msh");

// 创建边界界面
blkdyn.CrtBoundIFaceByCoord(-1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 更新界面网格
blkdyn.UpdateIFaceMesh();

// 设置块体模型为线弹性模型
blkdyn.SetModel("linear");

// 设置块体材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼
blkdyn.SetMat(2500, 1e9, 0.25, 3e6, 1e6, 45, 15);

// 设置界面模型为线弹性模型
blkdyn.SetIModel("linear");

// 设置界面材料参数，依次为法向刚度、切向刚度、内摩擦角、粘聚力、局部阻尼
blkdyn.SetIMat(1e10, 1e10, 35, 1e6, 1e6);

// 导入gid格式的颗粒数据
pdyna.Import("gid", "parmesh.msh");

// 设置颗粒模型为线弹性模型
pdyna.SetModel("linear");

// 设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e8, 0.25, 1e4, 1e4, 20, 0.8, 0.0);

// 设置动态计算时步为1e-4秒
dyna.TimeStepCorrect(0.8);

// 计算3万步
dyna.Solve(30000);
