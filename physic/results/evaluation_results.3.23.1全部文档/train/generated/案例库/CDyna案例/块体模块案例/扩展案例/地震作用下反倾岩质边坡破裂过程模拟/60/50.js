// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置三个方向的重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

// 关闭大变形计算开关
dyna.Set("Large_Displace 0");

// 设置计算结果的输出间隔为1000步
dyna.Set("Output_Interval 1000");

// 打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 设置虚质量时步为0.5
dyna.Set("Virtural_Step 0.5");

// 设置满足稳定条件的系统不平衡率
dyna.Set("UnBalance_Ratio 1e-4");

// 关闭接触更新计算开关
dyna.Set("If_Renew_Contact 0");

// 设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

// 包含裂隙渗流计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

// 关闭裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 0");

// 关闭裂隙渗流与固体耦合开关（孔隙渗流无此开关）
dyna.Set("FS_Solid_Interaction 0");

// 导入计算网格
var msh1 = imesh.importGid("RockSlope.msh");
blkdyn.GetMesh(msh1);

// 组号1,2之前切割形成接触面
blkdyn.CrtIFace(1, 2);

// 更新接触面网格
blkdyn.UpdateIFaceMesh();

// 设定所有单元的本构为线弹性本构
blkdyn.SetModel("linear");

// 设定组号为1-100之间的材料参数
blkdyn.SetMat(2500, 5e10, 0.25, 3e6, 1e6, 30.0, 15.0, 1, 100);

// 设定所有接触面的本构为线弹性模型
blkdyn.SetIModel("linear");

// 设置接触面材料参数
blkdyn.SetIMat(5e11, 5e11, 35, 3e6, 1e6);
blkdyn.SetIMat(5e11, 5e11, 20, 2e5, 2e5, 1, 2);

// 设定全部节点的局部阻尼系数为0.8
blkdyn.SetLocalDamp(0.8);

// 固定模型四周的法向速度，为0.0
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 19.99, 20.01);
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// 开始求解
dyna.Solve();
