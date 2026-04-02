// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置三个方向的重力加速度均为0
dyna.Set("Gravity 0.0 -9.8 0.0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 打开接触更新计算开关
dyna.Set("If_Renew_Contact 1");

// 设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 500");

// 设置监测信息输出时步为10步
dyna.Set("Moniter_Iter 10");

// 关闭杆件输入开关
dyna.Set("If_Cal_Bar 0");

// 打开杆件输出开关
dyna.Set("Bar_Out 1");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 从当前文件夹导入Gmsh格式的网格
blkdyn.ImportGrid("gid", "2dslope.msh");

// 所有单元边界创建接触面
blkdyn.CrtIFace();

// 接触面生成后，更新网格信息
blkdyn.UpdateIFaceMesh();

// 指定组1的单元本构为线弹性本构
blkdyn.SetModel("linear", 1);

// 指定组1-2的材料参数
blkdyn.SetMat(2500, 5e10, 0.25, 15e6, 10e6, 40.0, 10.0);

// 设置接触面为线弹性模量
blkdyn.SetIModel("linear");

// 设置接触面的刚度从单元中获得
blkdyn.SetIStiffByElem(1.0);

// 设置接触面的强度从单元中获得
blkdyn.SetIStrengthByElem();

// 固定左右两侧及底部的法向速度
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 19.99, 20.01);
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// 求解
dyna.Solve();

// 设置单元为Mohr-Coulomb理想弹塑性模型
blkdyn.SetModel("MC", 1);

// 设置接触面为脆性断裂模型
blkdyn.SetIModel("brittleMC");

// 求解至稳定
dyna.Solve();

// 存储save文件
dyna.Save("initial.sav");

// 解除模型左右两侧及底部法向速度约束
blkdyn.FreeV("x", "x", -0.001, 0.001);
blkdyn.FreeV("x", "x", 19.99, 20.01);
blkdyn.FreeV("y", "y", -0.001, 0.001);

// 模型的左右两侧及底部设定为无反射边界（粘性边界）
blkdyn.SetQuietBoundByCoord(-0.001, 0.001, -100, 100, -100, 100);
