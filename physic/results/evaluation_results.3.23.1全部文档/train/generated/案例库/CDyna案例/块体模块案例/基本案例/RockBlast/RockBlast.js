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

// 设置接触容差
dyna.Set("Contact_Detect_Tol 1e-5");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 打开瑞利阻尼计算开关
dyna.Set("If_Cal_Rayleigh 0");

// 设置接触搜索方法
dyna.Set("Contact_Search_Method 2");

// 从当前文件夹导入Gmsh格式的网格
blkdyn.ImportGrid("gid", "ore.msh");

// 对两侧单元均为组2的公共面进行切割，设置为接触面
blkdyn.CrtIFace(2, 2);

// 创建边界接触面
blkdyn.CrtBoundIFaceByCoord(-1e5, 1e5, 0.0479, 0.0501, -1e5, 1e5);

// 设置接触后，更新网格信息
blkdyn.UpdateIFaceMesh();

// 指定组1的单元本构为线弹性本构
blkdyn.SetModel("linear");

// 指定材料参数
blkdyn.SetMatByGroupRange(2500, 5e10, 0.25, 15e6, 10e6, 40.0, 10.0, 2, 2);
blkdyn.SetMatByGroupRange(7800, 2.1e11, 0.25, 15e6, 10e6, 40.0, 10.0, 1, 1);

// 将接触面模型设定为断裂能模型
blkdyn.SetIModel("FracE");

// 指定所有接触面的基础材料参数
blkdyn.SetIMat(1e13, 1e13, 40.0, 15e6, 10e6);

// 监测接触面的破坏度及破裂度
dyna.Monitor("gvalue", "gv_spring_broke");

// 指定组1内部交界面的断裂能，拉伸断裂能10Pa.m，剪切断裂能10Pa.m
blkdyn.SetIFracEnergyByGroupInterface(10, 10, 1, 1);

// 开始求解
dyna.Solve(8000);
