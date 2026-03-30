setCurDir(getSrcDir());

dyna.Clear();

// 设置重力加速度
dyna.Set("Gravity 9.8 -9.8 0.0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 更新接触面
dyna.Set("If_Renew_Contact 1");

// 设置云图输出间隔为500
dyna.Set("Output_Interval 500");

// 设置监测信息提取间隔为10时步
dyna.Set("Moniter_Iter 10");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 导入网格文件
blkdyn.ImportGrid("gid", "slidbody.msh");

// 创建接触面
blkdyn.CrtIFaceByCoord(-1e5, 1e5, 0.099, 0.101, -1e5, 1e5);

// 更新接触面网格
blkdyn.UpdateIFaceMesh();

// 设置模型类型为线弹性
blkdyn.SetModel("linear");

// 设置材料参数：密度、弹性模量、泊松比、剪切模量、体积模量、阻尼系数
blkdyn.SetMat(2500, 3e8, 0.22, 8e6, 5e6, 35, 10);

// 设置本构模型为脆性Mohr-Coulomb
blkdyn.SetIModel("brittleMC");

// 设置界面材料参数：拉伸强度、剪切强度、粘聚力、摩擦角、内聚力
blkdyn.SetIMat(1e9, 1e9, 20.0, 0, 0);

// 设置局部阻尼系数
blkdyn.SetLocalDamp(0.01);

// 固定边界条件：X方向固定，Y方向限制位移范围
blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);

// 设置时间步长修正因子
dyna.TimeStepCorrect(0.5);

// 设置监测点：块体位移和应力
dyna.Monitor("block", "xdis", 0.15, 0.15, 0);
dyna.Monitor("block", "sxx", 0.15, 0.15, 0);

// 执行求解循环
dyna.DynaCycle(10);

print("**********************求解完毕**********************");
