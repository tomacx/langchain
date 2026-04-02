// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 清除Mesh模块的几何数据
igeo.clear();

// 清除Mesh模块的网格数据
imeshing.clear();

// 清除BlockDyna模型的数据
dyna.Clear();

// 清除Genvi平台的数据
doc.clearResult();

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置重力加速度为0（x, y, z方向）
dyna.Set("Gravity 0.0 -9.8 0.0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置结果输出间隔为500步
dyna.Set("Output_Interval 500");

// 设置监测信息输出间隔为10步
dyna.Set("Monitor_Iter 10");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 打开接触更新开关
dyna.Set("If_Renew_Contact 1");

// 设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

// 从平台下载网格数据
blkdyn.GetMesh(imeshing);

// 对两侧单元均为组1的公共面进行切割，设置为接触面
blkdyn.CrtIFace();

// 更新接触面后的网格信息
blkdyn.UpdateIFaceMesh();

// 指定组1的单元本构模型为线弹性模型
blkdyn.SetModel("linear");

// 设置材料参数（密度, 弹性模量, 泊松比, 压缩强度, 拉伸强度, 内聚力, 粘结强度）
blkdyn.SetMat(2300, 1e10, 0.25, 5e6, 5e6, 35.0, 15.0);

// 将接触面模型设定为线弹性模型
blkdyn.SetIModel("linear");

// 设置虚拟接触面的刚度和强度从单元中自动获取
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();

// 监测接触面的破坏度及破裂度
dyna.Monitor("gvalue", "gv_spring_broke");
