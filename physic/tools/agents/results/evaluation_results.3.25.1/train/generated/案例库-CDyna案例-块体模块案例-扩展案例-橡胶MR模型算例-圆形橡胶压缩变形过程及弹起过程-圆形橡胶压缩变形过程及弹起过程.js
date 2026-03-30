setCurDir(getSrcDir());

// 初始化仿真环境并清除所有之前的计算数据与几何模型
dyna.Clear();
imeshing.clear();
igeo.clear();
doc.clearResult();

// 生成圆形橡胶的几何形状
igeo.genCircleS(0, 0.5, 0, 1.0, 0.05, 3);

// 调用网格划分工具对生成的几何体进行离散化网格处理
imeshing.genMeshByGmsh(2);

// 设置全局仿真控制参数
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Renew_Interval 10");
dyna.Set("Contact_Detect_Tol 0.001");
dyna.Set("Block_Rdface_Contact_Scheme 3");

// 获取网格并创建边界界面组
blkdyn.GetMesh(imeshing);
blkdyn.CrtBoundIFaceByGroup(3);
blkdyn.UpdateIFaceMesh();

// 设置单元本构为MR模型（橡胶模型）
blkdyn.SetModel("MR");

// 设置基础材料参数：密度、杨氏模量、泊松比、拉伸强度、粘聚力、摩擦角、局部阻尼
blkdyn.SetMat(1100, 2e9, 0.485, 1e6, 1e6, 35, 15);

// 设置MR材料参数（9参数模型）
var MRMat = [0.352, 0.027, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1, 0.0];

// 核心模块增加橡胶参数
blkdyn.SetMRMat(1, MRMat);

// 关联橡胶参数
blkdyn.BindMRMat(1, 1, 100);

// 设置界面接触属性（刚性面）
blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(5e11, 5e11, 0, 0, 0);

// 设置局部阻尼系数
blkdyn.SetLocalDamp(0.00);

// 调整时间步长与局部阻尼系数以确保数值计算的稳定性
dyna.TimeStepCorrect(0.1);
dyna.Set("Time_Step 2e-6");
dyna.Set("Virtural_Step 0.5");

// 创建接触面模型并关联刚性面以定义压缩边界条件
rdface.Create(1, 1, 2, [[-0.5, -0.5, 0], [-0.5, 0.5, 0]]);
rdface.Create(2, 1, 2, [[0.5, -0.5, 0], [0.5, 0.5, 0]]);

// 定义加载时程曲线：压缩速度（向下）和反弹速度（向上）
rdface.ApplyRadialVelocity(1, 1, [0, 0, 0], [0, 0, -1], 0.01, 1, 1);
rdface.ApplyRadialVelocity(2, 1, [0, 0, 0], [0, 0, 1], -0.01, 2, 2);

// 监测位移、应力及监测数据结果
dyna.Monitor("block", "soyy", 0, 1.5, 0.0);
dyna.Monitor("block", "soyy", 0, 1.0, 0.0);
dyna.Monitor("block", "soyy", 0, 0.5, 0.0);
dyna.Monitor("block", "soyy", 0, 0.0, 0.0);
dyna.Monitor("block", "soyy", 0, -0.5, 0.0);

dyna.Monitor("block", "syy", 0, 1.5, 0.0);
dyna.Monitor("block", "syy", 0, 1.0, 0.0);
dyna.Monitor("block", "syy", 0, 0.5, 0.0);
dyna.Monitor("block", "syy", 0, 0.0, 0.0);
dyna.Monitor("block", "syy", 0, -0.5, 0.0);

// 运行用户自定义命令流执行计算并输出结果
dyna.Solve(140000);
