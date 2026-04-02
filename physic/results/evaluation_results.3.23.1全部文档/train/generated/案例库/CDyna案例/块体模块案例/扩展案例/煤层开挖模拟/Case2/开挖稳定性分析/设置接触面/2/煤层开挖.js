// 设置当前工作路径为脚本所在目录
setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置重力加速度
dyna.Set("Gravity 0 -9.8 0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置接触更新
dyna.Set("If_Renew_Contact 1");

// 设置输出间隔和监测时步
dyna.Set("Output_Interval 200");
dyna.Set("Moniter_Iter 10");

// 导入网格文件（假设为Gmsh格式）
blkdyn.ImportGrid("gid", "example.msh");

// 创建接触面
blkdyn.CrtIFaceByCoord(-1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 更新网格信息
blkdyn.UpdateIFaceMesh();

// 设置材料参数
blkdyn.SetMat(2500, 5e10, 0.25, 15e6, 10e6, 40.0, 10.0);

// 指定单元本构模型为线弹性
blkdyn.SetModel("linear");

// 设置接触面模型为断裂能模型
blkdyn.SetIModel("FracE");
blkdyn.SetIMat(1e13, 1e13, 40.0, 15e6, 10e6);

// 监测接触面的破坏度及破裂度
dyna.Monitor("gvalue", "gv_spring_broke");
