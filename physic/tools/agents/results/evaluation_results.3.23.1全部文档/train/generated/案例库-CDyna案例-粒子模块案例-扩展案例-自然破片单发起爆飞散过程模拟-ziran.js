setCurDir(getSrcDir());

// 公共接口设置
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("If_Renew_Contact 0");
dyna.Set("Renew_Interval 100");
dyna.Set("Contact_Detect_Tol 2.0e-3");
dyna.Set("Block_Soften_Value 0.2 0.2");
dyna.Set("If_Cal_Particle 0");
dyna.Set("Output_Interval 500");

// 导入网格数据（示例：从文件导入）
blkdyn.ImportGrid("ansys", "natural_shard.dat");

// 块体信息栏设置
blkdyn.SetModel("JWL");

// 设置炸药参数 (density, young, poisson, cohesion, tension, friction, dilation)
blkdyn.SetMat(1630, 7e9, 0.25, 3e6, 1e6, 35, 15);

// 设置破片材料参数（钢）
blkdyn.SetMat(7800, 2e11, 0.3, 10e6, 10e6, 0, 0);

// 设置阻尼
blkdyn.SetLocalDamp(0.0);

// 爆炸载荷设定 - JWL爆源参数
// 序号、密度、爆速、爆热、初始段绝热指数、第二段绝热指数、波阵面压力、点火点位置、点火时间、持续时间
var pos = new Array(1);
pos[0] = [0.5, 0.0, 0.0];
blkdyn.SetJWLSource(1, 1630, 7.0e9, 371.2e9, 3.2e9, 4.2, 0.95, 0.30, 21e9, 6930, pos, 0.0, 100);

// 绑定JWL爆源到单元
blkdyn.BindJWLSource(1, 1, 100);

// 设置JWL爆源气体逸散参数 (特征时间、特征指数、爆源ID下限、爆源ID上限)
blkdyn.SetJWLGasLeakMat(5e-4, 1.2, 1, 100);

// 创建接触面
blkdyn.CrtIFace(1, 2);
blkdyn.UpdateIFaceMesh();

// 设置接触模型为脆性Mohr-Coulomb
blkdyn.SetIModel("brittleMC");

// 设置接触参数
blkdyn.SetIMat(5e11, 5e11, 0.01, 0, 0);

// 施加重力
blkdyn.ApplyGravity();

// 时间步长修正
dyna.TimeStepCorrect(0.01);

// 执行计算 (5ms)
dyna.DynaCycle(5e-3);
