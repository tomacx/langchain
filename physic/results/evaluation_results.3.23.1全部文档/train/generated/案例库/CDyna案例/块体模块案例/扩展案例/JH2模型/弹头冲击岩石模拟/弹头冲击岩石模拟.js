// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置三个方向的重力加速度均为0
dyna.Set("Gravity 0.0 -9.8 0.0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置计算结果的输出间隔为200步
dyna.Set("Output_Interval 200");

// 设置监测信息输出时步为10步
dyna.Set("Moniter_Iter 10");

// 设置接触检测容差
dyna.Set("Contact_Detect_Tol 1e-5");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 打开重新生成接触面开关
dyna.Set("If_Renew_Contact 1");

// 设置瑞利阻尼计算开关为关闭状态
dyna.Set("If_Cal_Rayleigh 0");

// 设置接触搜索方法
dyna.Set("Contact_Search_Method 2");

// 导入Gmsh格式的网格文件
blkdyn.ImportGrid("gid", "ore.msh");

// 创建组2单元之间的公共面并设置为接触面
blkdyn.CrtIFace(2, 2);

// 根据坐标创建边界接触面
blkdyn.CrtBoundIFaceByCoord(-1e5, 1e5, 0.0479, 0.0501, -1e5, 1e5);

// 更新网格信息以反映新的接触面
blkdyn.UpdateIFaceMesh();

// 设置组1单元的本构模型为线弹性模型
blkdyn.SetModel("linear");

// 指定组2-3的材料参数
blkdyn.SetMatByGroupRange(2500, 5e10, 0.25, 15e6, 10e6, 40.0, 10.0, 2, 3);

// 指定组1的材料参数
blkdyn.SetMatByGroupRange(7800, 2.1e11, 0.25, 15e6, 10e6, 40.0, 10.0, 1, 1);

// 设置接触面模型为断裂能模型
blkdyn.SetIModel("FracE");

// 根据坐标设置特定区域的接触面模型为脆性材料模型
blkdyn.SetIModelByCoord("brittleMC", -1e5, 1e5, 0.0499, 0.0501, -1e5, 1e5);

// 设置所有接触面的基础材料参数
blkdyn.SetIMat(1e13, 1e13, 40.0, 15e6, 10e6);

// 根据坐标设置特定区域的接触面材料参数
blkdyn.SetIMatByCoord(1e13, 1e13, 5.0, 0.0, 0.0, -1e5, 1e5, 0.0499, 0.0501, -1e5, 1e5);

// 设置组1内部交界面的断裂能
blkdyn.SetIFracEnergyByGroupInterface(10, 10, 1, 1);

// 监测接触面的破坏度及破裂度
dyna.Monitor("gvalue", "gv_spring_broke");
