setCurDir(getSrcDir());

// 初始化力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置重力加速度（二维模型，y方向为重力方向）
dyna.Set("Gravity 0.0 -9.8 0.0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 打开接触更新计算开关
dyna.Set("If_Renew_Contact 1");

// 设置计算结果输出间隔
dyna.Set("Output_Interval 500");

// 设置监测信息输出时步
dyna.Set("Moniter_Iter 10");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 打开杆件输入开关
dyna.Set("Bar_Out 1");

// 导入二维边坡网格（Gmsh格式）
blkdyn.ImportGrid("gid", "2dslope.msh");

// 所有单元边界创建接触面
blkdyn.CrtIFace();

// 接触面生成后，更新网格
blkdyn.UpdateIFaceMesh();

// 指定组1的单元本构为线弹性本构（初始状态）
blkdyn.SetModel("linear", 1);

// 设置边坡土体材料参数：密度、杨氏模量、泊松比、剪切模量、体积模量、屈服应力、屈服应变
blkdyn.SetMat(2500, 5e7, 0.3, 15e6, 10e6, 40.0, 10.0);

// 设置接触面为线弹性模型
blkdyn.SetIModel("linear");

// 设置接触面的刚度从单元中获得
blkdyn.SetIStiffByElem(1.0);

// 设置接触面的强度从单元中获得
blkdyn.SetIStrengthByElem();

// 固定左右两侧及底部的法向速度（边界条件）
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 19.99, 20.01);
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// 设置无反射边界（粘性边界）
blkdyn.SetQuietBoundByCoord(-0.001, 0.001, -100, 100, -100, 100);

// 设置JWL爆源参数（TNT炸药）
// 参数：爆源ID, 初始压力, 密度, 声速, R1系数, R2系数, R3系数, R4系数, R5系数, R6系数, 起爆点坐标, 衰减时间
blkdyn.SetJWLSource(1, 1630, 7.0e9, 371.2e9, 3.2e9, 4.2, 0.95, 0.30, 21e9, 6930, [0, 0, 0], 0.0, 15e-3);

// 设置JWL爆源的气体逸散参数
// 特征时间, 特征指数, 爆源ID下限, 爆源ID上限
blkdyn.SetJWLGasLeakMat(5e-4, 1.2, 1, 10);

// 绑定JWL爆源到材料
blkdyn.BindJWLSource(1, 1);

// 求解初始状态
dyna.Solve();

// 存储初始状态save文件
dyna.Save("initial.sav");

// 解除模型左右两侧及底部法向速度约束（准备爆破）
blkdyn.FreeV("x", "x", -0.001, 0.001);
blkdyn.FreeV("x", "x", 19.99, 20.01);
blkdyn.FreeV("y", "y", -0.001, 0.001);

// 设置边坡土体为Mohr-Coulomb理想弹塑性模型
blkdyn.SetModel("MC", 1);

// 设置接触面为脆性断裂模型
blkdyn.SetIModel("brittleMC");

// 求解至稳定状态（爆破分析）
dyna.Solve();

// 导出结果文件
dyna.ExportResult();
