setCurDir(getSrcDir());

// 初始化仿真环境
dyna.Clear();
doc.clearResult();

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 打开杆件计算开关
dyna.Set("If_Cal_Bar 1");

// 设置不平衡率为1e-5
dyna.Set("UnBalance_Ratio 1e-5");

// 设置3个方向的重力加速度均为0.0
dyna.Set("Gravity 0 0.0 0");

// 关闭大变形计算开关（压缩试验通常不需要）
dyna.Set("Large_Displace 0");

// 打开接触面更新开关
dyna.Set("If_Renew_Contact 1");

// 设置结果输出时步为500步
dyna.Set("Output_Interval 500");

// 监测信息的输出时步为100步
dyna.Set("Moniter_Iter 100");

// 关闭虚拟质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 设置接触容差为0.001m
dyna.Set("Contact_Detect_Tol 0.001");

// 创建混凝土块（200mm x 200mm x 200mm）
var id_concrete = igeo.genBrickV(0, 0, 0, 0.2, 0.2, 0.2, 1);

// 创建钢筋（圆柱形，直径20mm，长度180mm，居中布置）
var id_bar = igeo.genCylinderV(-0.1, 0.1, 0.1, 0, 0.1, 0.1, 0, 0.1, 0.02, 0.02, 2);

// 将钢筋与混凝土块粘接
igeo.glue("volume", id_concrete, id_bar);

// 网格划分
imeshing.genMeshByGmsh(3);

// 获取网格并创建接触面
blkdyn.GetMesh(imeshing);
blkdyn.CrtIFace(1);
blkdyn.UpdateIFaceMesh();

// 设置混凝土块材料参数（密度、弹性模量、泊松比、抗拉强度、抗压强度、内摩擦角、粘聚力、模型类型）
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 1e6, 40e6, 30.0, 1e6, 1);

// 设置钢筋材料参数（通过坐标范围设置）
var BarProp = [1e-2, 7800.0, 2e11, 0.25, 235e6, 235e6, 1e6, 35, 1e9, 0.4, 0.0];
bar.SetPropByCoord(BarProp, -0.1, 0.1, -0.1, 0.1, -0.1, 0.1);

// 设定所有接触面的本构为脆性断裂的Mohr-Coulomb本构
blkdyn.SetIModel("brittleMC");

// 设定接触面上的材料参数（单位面积法向刚度、单位面积切向刚度、内摩擦角、粘聚力、抗拉强度）
blkdyn.SetIStiffByElem(1e9);
blkdyn.SetIStrengthByElem();

// 设置局部阻尼为0.2
blkdyn.SetLocalDamp(0.2);

// 底部固定（y方向）
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// 顶部施加压缩位移载荷（-0.005m = -5mm）
blkdyn.FixV("y", -2e-9, "y", 0.1495, 0.16);

// 设置监测点：顶部中心点应力监测
dyna.Monitor("block", "syy", 0.1, 0.2, 0.1);
dyna.Monitor("block", "sxx", 0.1, 0.2, 0.1);
dyna.Monitor("block", "szz", 0.1, 0.2, 0.1);

// 设置监测点：钢筋应力监测
dyna.Monitor("bar", "s_normal_force", 0.1, 0.1, 0.1);

// 设置UDM变量用于追踪裂缝状态
blkdyn.SetUDM(0, 0); // UDM_P[0] = T (初始为0)

// 求解：设置计算时步和迭代次数
dyna.Set("Time_Step 1e-5");
dyna.Solve(20000);

// 释放动态链接库（可选）
// dyna.FreeUDF();
