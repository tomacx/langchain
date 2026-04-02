setCurDir(getSrcDir());

// 设置重力方向为向下
dyna.Set("Gravity 0 0 -9.8");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 设置输出间隔为500步
dyna.Set("Output_Interval 500");

// 设置接触检测容差
dyna.Set("Contact_Detect_Tol 1e-3");

// 导入刚性面边界数据
rdface.Import("ansys", "Bound.dat");

// 开启计算弹性能量接触
dyna.Set("If_Cal_EE_Contact 1");

// 创建几何模型
igeo.genBrickV(450, 450, 310, 550, 550, 400, 10, 1);

// 使用gmsh进行网格划分
imeshing.genMeshByGmsh(3);

// 获取网格数据
blkdyn.GetMesh(imeshing);

// 创建接触面并更新网格
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置材料模型为线弹性模型
blkdyn.SetModel("linear");

// 设置材料参数：密度、杨氏模量、泊松比、拉伸强度、压缩强度、摩擦角、局部阻尼
blkdyn.SetMat(2500, 5e8, 0.3, 0, 0, 15, 0);

// 设置接触面模型为脆性MC模型
blkdyn.SetIModel("brittleMC");

// 设置接触面材料参数：法向刚度、切向刚度、摩擦角、局部阻尼、粘结强度
blkdyn.SetIMat(5e9, 5e9, 15, 0, 0);

// 设置局部阻尼系数
blkdyn.SetLocalDamp(0.02);

// 调整时间步长以确保计算稳定
dyna.TimeStepCorrect(0.6);

// 求解4万步
dyna.Solve(40000);
