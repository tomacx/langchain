setCurDir(getSrcDir());

// 清除之前的计算结果与文档数据
dyna.Clear();
doc.clearResult();

// 开启力学计算开关及杆件计算开关
dyna.Set("Mechanic_Cal 1");
dyna.Set("If_Cal_Bar 1");

// 设置不平衡率为1e-5
dyna.Set("UnBalance_Ratio 1e-5");

// 设置重力加速度为0（冲击工况）
dyna.Set("Gravity 0 0.0 0");

// 关闭大变形计算开关
dyna.Set("Large_Displace 1");

// 打开接触更新开关
dyna.Set("If_Renew_Contact 1");

// 设置结果输出时步为500步
dyna.Set("Output_Interval 500");

// 监测信息的输出时步为100步
dyna.Set("Moniter_Iter 100");

// 关闭虚拟质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 设置虚拟时步为0.5
dyna.Set("Virtural_Step 0.5");

// 设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

// 导入钢筋混凝土楼板网格文件
blkdyn.ImportGrid("ansys", "concrete_slab_mesh.dat");

// 创建接触面并更新网格拓扑信息
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置实体单元为线弹性模型
blkdyn.SetModel("linear");

// 设置混凝土材料参数：密度、弹性模量、泊松比、屈服强度、硬化模量、损伤参数等
blkdyn.SetMat(2400, 3.0e10, 0.2, 3.0e6, 1.0e6, 25.0, 10.0, 1);

// 设置钢筋材料参数：密度、弹性模量、泊松比、屈服强度等
blkdyn.SetMat(7850, 2.0e11, 0.3, 400.0e6, 0.0, 0.0, 0.0, 2);

// 设定所有接触面的本构为脆性断裂的Mohr-Coulomb本构
blkdyn.SetIModel("SSMC");

// 设定接触面上的材料刚度参数
blkdyn.SetIStiffByElem(1e8);

// 设定接触面强度参数
blkdyn.SetIStrengthByElem();

// 设置局部阻尼为0.05
blkdyn.SetLocalDamp(0.05);

// 设置边界约束：固定楼板四边支撑点
blkdyn.FixV("xy", 0.0, "x", -0.01, 0.01);
blkdyn.FixV("xy", 0.0, "x", 3.99, 4.01);
blkdyn.FixV("xy", 0.0, "y", -0.01, 0.01);
blkdyn.FixV("xy", 0.0, "y", 2.99, 3.01);

// 设置冲击载荷：在楼板表面施加速度冲击
skwave.DefMesh(3, [3, 3, 2], [50, 60, 50], [-0.2, -0.5, -1]);
skwave.InheritSolid();
skwave.SetSolid(1, -5, 5, -5, 0.2, -5, 5);

// 初始化冲击球：速度为100 m/s，作用于楼板中心区域
skwave.InitBySphere(1.0e5, 1.02, [0, 0, 0], [0, 0, 0], 100.0);

// 设置时间步长
dyna.Set("Time_Step 2e-6");

// 配置结果输出：监测破裂扩展、位移云图及应力集中区域
dyna.Monitor("block", "ydis", 0, 4.0, 0);
dyna.Monitor("block", "syy", 0, 4.0, 0);
dyna.Monitor("block", "sxx", 0, 4.0, 0);

// 调用核心求解器进行计算
dyna.DynaCycle(0.1);

// 释放动态链接库资源
dyna.FreeUDF();
