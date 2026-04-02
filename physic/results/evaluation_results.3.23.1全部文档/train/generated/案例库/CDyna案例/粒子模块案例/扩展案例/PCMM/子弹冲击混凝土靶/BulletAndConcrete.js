// 设置当前工作路径为脚本文件所在路径
setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置三个方向的重力加速度均为0
dyna.Set("Gravity 0.0 0.0 0.0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置接触检测容差为0
dyna.Set("Contact_Detect_Tol 0.0");

// 设置结果输出间隔为500步
dyna.Set("Output_Interval 500");

// 设置监测信息输出时步为10步
dyna.Set("Moniter_Iter 10");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 设置PCMM颗粒的接触容差
dyna.Set("PCMM_Elem_Tol 2e-4");

// 设置颗粒的计算模式为2-PCMM颗粒模式
dyna.Set("Particle_Cal_Type 1");

// 设置MPM计算模式为2
dyna.Set("MPM_Cal_Mode 2");

// 导入网格文件
blkdyn.ImportGrid("gmsh", "CDEM.msh");

// 设置材料模型为线性弹性
blkdyn.SetModel("linear");
// 设置炸药组的材料模型为JWL
blkdyn.SetModel("JWL", 2);

// 指定组1的材料参数，混凝土等
blkdyn.SetMat(2000, 1.5e8, 0.25, 5e6, 5e6, 30, 5);
// 指定组2的炸药材料参数
blkdyn.SetMat(1150, 1e8, 0.25, 3e6, 1e6, 15, 5, 2);

// 设置全局JWL炸药参数，为TNT，材料序号1
var apos = [60.0, 60.0, 0.0];
blkdyn.SetJWLSource(1, 1630, 3e9, 10e9, 1e9, 4.2, 0.95, 0.3, 5e9, 6930.0, apos, 0.0, 10.0);
blkdyn.BindJWLSource(1, 2, 2);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.001);

// 施加无反射边界条件
blkdyn.SetQuietBoundByCoord(-0.1, 0.1, -1e5, 1e5, -1e5, 1e5);
blkdyn.SetQuietBoundByCoord(119.1, 120.1, -1e5, 1e5, -1e5, 1e5);
blkdyn.SetQuietBoundByCoord(-1e5, 1e5, -0.1, 0.1, -1e5, 1e5);
blkdyn.SetQuietBoundByCoord(-1e5, 1e5, 119.1, 120.1, -1e5, 1e5);

// 求解
dyna.Solve(10000);

print("Solution is ok!");
