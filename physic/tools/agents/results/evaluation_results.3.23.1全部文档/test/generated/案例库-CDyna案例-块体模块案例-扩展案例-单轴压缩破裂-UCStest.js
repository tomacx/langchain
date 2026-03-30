setCurDir(getSrcDir());

// 初始化仿真环境
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 加载 CustomModel 二次开发库
dyna.LoadUDF("CustomModel");

// 生成圆柱体试件几何模型 (直径0.1m, 高度0.2m)
var id1 = igeo.genCircle(0, 0, 0, 0.05); // 外圆
var id2 = igeo.genCircle(0, 0, 0, 0.049, 0.001); // 内圆 (用于创建环形截面)

// 生成圆柱体表面
var id = igeo.genSurface([id1, id2], 1);

// 网格划分
imeshing.genMeshByGmsh(2);

// 设置求解器通用参数
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 0.0 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.4");
dyna.Set("UnBalance_Ratio 1e-4");
dyna.Set("If_Find_Contact_OBT 1");

// 创建接触面并更新网格
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置本构模型为 Custom 类型
blkdyn.SetModel("Custom");

// 设置材料参数 (密度, 弹性模量, 泊松比, 粘聚力, 抗拉强度, 内摩擦角, 剪胀角, 组号)
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e6, 3e6, 30.0, 10.0, 1);

// 设置接触面材料参数 (法向刚度, 切向刚度, 粘聚力, 抗拉强度, 内摩擦角, 组号)
blkdyn.SetIMat(9e9, 9e9, 30, 3e6, 3e6, 1);

// 启用节理脆性断裂选项
dyna.Set("UbJoint_Mode_Option 1");

// 设置接触面刚度为单元特征刚度的倍数
blkdyn.SetIStiffByElem(1.0);

// 设置局部阻尼系数
blkdyn.SetLocalDamp(0.8);

// Y方向底部法向约束 (固定)
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// Y方向顶部施加准静态竖直向下的位移载荷
blkdyn.FixV("y", -8e-8, "y", 0.199, 0.201);

// 设置单元软化参数 (体积膨胀断裂应变, 等效剪切断裂应变)
dyna.Set("Block_Soften_Value 0.005 0.01");

// 监测典型测点的应力和位移
dyna.Monitor("block", "syy", 0.05, 0.2, 0);
dyna.Monitor("block", "syy", 0.05, 0.1, 0);
dyna.Monitor("block", "uy", 0.05, 0.2, 0);

// 设置求解步数
dyna.Solve(120000);

// 输出破裂块度信息
blkdyn.ExportGradationCurveByGroup(1, 1);

// 导出结果文件
doc.ExportResult();
