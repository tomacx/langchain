// 示例脚本用于打印全局材料参数

setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置三个方向的重力加速度均为0
dyna.Set("Gravity 0.0 0.0 0.0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 500");

// 设置监测信息输出时步为10步
dyna.Set("Monitor_Iter 10");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 打开接触更新开关
dyna.Set("If_Renew_Contact 1");

// 设置接触容差为0.001
dyna.Set("Contact_Detect_Tol 0.001");

// 导入网格文件
blkdyn.ImportGrid("gmsh", "GDEM.msh");

// 创建接触面
blkdyn.CrtIFace(1);
blkdyn.CrtIFace(-1, -1);

// 更新接触面网格信息
blkdyn.UpdateIFaceMesh();

// 设置单元本构模型
blkdyn.SetModel("linear");
blkdyn.SetModel("LeeTarver", 2);

// 设置材料参数
blkdyn.SetMat(2009, 8e9, 0.307, 10e7, 6e7, 35, 15);
blkdyn.SetMat(1680, 8e9, 0.307, 3e6, 1e6, 35, 15, 2);

// 打印全局材料参数
dyna.Print("JWL");
