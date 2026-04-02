// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置三个方向的重力加速度
dyna.Set("Gravity 0 -9.8 0");

// 关闭大变形计算开关
dyna.Set("Large_Displace 1");

// 设置结果输出时步间隔为500步
dyna.Set("Output_Interval 500");

// 打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 设置虚质量时间步长为0.5
dyna.Set("Virtural_Step 0.5");

// 设置系统不平衡率阈值为1e-4
dyna.Set("Unbalance_Ratio 1e-4");

// 关闭接触面更新计算开关
dyna.Set("If_Renew_Contact 1");

// 设置接触检测容差为0
dyna.Set("Contact_Detect_Tolerance 0.0");

// 包含裂隙渗流计算模块，开辟相关内存
dyna.Set("Config_FracSeepage 1");

// 关闭裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 0");

// 关闭裂隙渗流与固体耦合计算开关
dyna.Set("FS_Solid_Interaction 0");

// 导入网格文件
blkdyn.ImportGrid("gid", "RockSlope.msh");

// 在组号1和2之间切割形成接触面
blkdyn.CrtIFace(1, 2);

// 更新接触面网格
blkdyn.UpdateIFaceMesh();

// 设置所有单元的本构模型为线弹性模型
blkdyn.SetModel("linear");

// 设置材料参数，依次为密度、弹性模量、泊松比、拉伸强度、压缩强度、组号下限及上限
blkdyn.SetMat(2500, 5e10, 0.25, 3e6, 1e6, 30.0, 15.0, 1, 100);

// 设置所有接触面的本构模型为线弹性模型
blkdyn.SetIModel("linear");

// 设置接触面材料参数，依次为法向刚度、切向刚度、摩擦角、拉伸强度、压缩强度
blkdyn.SetIMat(5e11, 5e11, 35, 3e6, 1e6);
blkdyn.SetIMat(5e11, 5e11, 20, 2e5, 2e5, 1, 2);

// 设置所有节点的局部阻尼系数为0.8
blkdyn.SetLocalDamp(0.8);

// 固定模型四周法向速度为0
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 19.99, 101);
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// 从固体单元接触面创建裂隙单元
fracsp.CreateGridFromBlock(2);

// 设置裂隙渗流参数，依次为密度、体积模量、渗透系数、初始开度、组号下限及上限
fracsp.SetPropByGroup(1000.0, 1e7, 12e-7, 12e-5, 1, 11);
