//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开固体计算开关
dyna.Set("Mechanic_Cal 1");

//设置系统不平衡率为1e-5
dyna.Set("UnBalance_Ratio 1e-5");

//设置3个方向的重力加速度
dyna.Set("Gravity 0 -9.8 0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

//设置子空间的更新时步为100步
dyna.Set("Renew_Interval 100");

//设置接触容差为1mm
dyna.Set("Contact_Detect_Tol 1e-3");

//开启接触更新计算
dyna.Set("If_Renew_Contact 1");

//关闭save文件的自动保存功能
dyna.Set("SaveFile_Out 0");

//导入ansys格式的网格文件
blkdyn.ImportGrid("ansys", "Landslide.dat");

//在组1与组2的交界面上创建接触面
blkdyn.CrtIFace(1, 2);

//在组2与组2的交界面上创建接触面
blkdyn.CrtIFace(2, 2);

//对组1的自由面创建接触面
blkdyn.CrtBoundIFaceByGroup(1);

//更新接触面网格
blkdyn.UpdateIFaceMesh();

//将单元模型设置为线弹性模型
blkdyn.SetModel("linear");

//设置组1及组2的材料参数
blkdyn.SetMatByGroup(2500, 1e9, 0.25, 10e6, 8e6, 40.0, 10.0, 1);
blkdyn.SetMatByGroup(2500, 1e9, 0.25, 10e6, 8e6, 40.0, 10.0, 2);

//设置接触面的模型为线弹性模型
blkdyn.SetIModel("linear");

//将所有接触面的材料参数均设置为一种值
blkdyn.SetIMat(5e9, 5e9, 10, 1e4, 1e4);

//模型底部施加全约束
blkdyn.FixVByCoord("xy", 0.0, -1e10, 1e10, -0.001,0.001, -1e10, 1e10);

//模型左右两侧施加法向约束
blkdyn.FixVByCoord("x", 0.0, -0.001, 0.001, -1e10, 1e10, -1e10, 1e10);
blkdyn.FixVByCoord("x", 0.0, 14.99, 15.01, -1e10, 1e10, -1e10, 1e10);

//求解至稳定
dyna.Solve();

//将接触面模型切换至脆性断裂的Mohr-Coulomb模型
blkdyn.SetIModel("brittleMC");

//将局部阻尼设置为0
blkdyn.SetLocalDamp(0.0);

//打开瑞利阻尼计算开关
dyna.Set("If_Cal_Rayleigh 1");

//将瑞利阻尼中的刚度阻尼系数设置为1e-4，质量阻尼设置为0
blkdyn.SetRayleighDamp(1e-4, 0.0);

//计算2万步
dyna.Solve(20000);

//打印提示信息
print("Solution Finished");