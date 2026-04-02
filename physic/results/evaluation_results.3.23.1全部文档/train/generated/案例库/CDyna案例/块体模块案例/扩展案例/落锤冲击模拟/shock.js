// 设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

// 设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 500");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 设置三个方向的全局重力加速度为0
dyna.Set("Gravity 0.0 -9.8 0.0");

// 打开单元大变形计算开关
dyna.Set("Large_Displace 1");

// 打开单元接触更新开关
dyna.Set("If_Renew_Contact 1");

// 设置接触容差为1cm
dyna.Set("Contact_Detect_Tol 1e-2");

// 设置计算时步为5e-5
dyna.Set("Time_Step 2e-5");

// 导入网格数据
blkdyn.ImportGrid("gid", "example.msh");

// 指定实体单元的本构模型为线弹性模型
blkdyn.SetModel("linear");

// 设置材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼系数
blkdyn.SetMat(2500, 1e8, 0.2, 3e7, 6e7, 36, 0.0);

// 设置接触面的本构模型为脆性断裂的Mohr-Coulomb模型
blkdyn.SetIModel("SSMC");

// 指定所有接触面上的基础材料参数，依次为单位面积法向刚度、单位面积切向刚度、内摩擦角、粘聚力、抗拉强度
blkdyn.SetIMat(1e13, 1e13, 40.0, 6e7, 3e7);

// 创建接触面，指定组2的单元为接触面
blkdyn.CrtIFace(2);

// 更新网格信息以反映新的接触面设置
blkdyn.UpdateIFaceMesh();

// 设置局部阻尼系数
blkdyn.SetLocalDamp(0.1);

// 初始化条件，例如速度或位移
var fvalue = new Array(0.0, -10, 0.0);
blkdyn.InitCondByGroup("velocity", fvalue, 2);

// 应用边界条件，例如静止边界
blkdyn.ApplyQuietBoundByCoord(-0.2, 0.2, -1000, 1000, -1, 1);

// 求解指定步数的计算过程
dyna.Solve(20000);

// 打印信息，表示求解完成
print("Solution is ok!");
