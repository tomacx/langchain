setCurDir(getSrcDir());

// 清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

// 设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置接触容差
dyna.Set("Contact_Detect_Tol 5e-3");

// 设置底部刚性面
var fCoord = new Array();
fCoord[0] = [-4.0, -2.0, 0.0];
fCoord[1] = [4.0, -2.0, 0.0];
rdface.Create(1, 1, 2, fCoord);

// 导入gid格式的颗粒
pdyna.Import("gid", "D2mCircel.msh");

// 设置颗粒接触模型为考虑应变软化的Mohr-Coulomb模型
pdyna.SetModel("SSMC");

// 设置颗粒的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e8, 0.25, 1e6, 5e6, 30, 0.0, 0.1);

// 设置动态计算时步为1e-4秒
dyna.Set("Time_Step 5e-5");

// 设置接触容差为0（找到初始接触后，将后续接触容差设为0）
dyna.Set("Contact_Detect_Tol 0.0");

// 计算3万步
dyna.Solve(10000);

// 导出网格数据到指定文件
pdyna.ExportMesh("gid", "output_mesh.msh");
