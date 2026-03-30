setCurDir(getSrcDir());

// 配置仿真输出间隔为1000步
dyna.Set("Output_Interval 1000");

// 关闭虚拟质量效应
dyna.Set("If_Virtural_Mass 0");

// 设置重力加速度向量（z轴向下）
dyna.Set("Gravity 0.0 0.0 -9.8");

// 设置接触检测容差为0.0
dyna.Set("Contact_Detect_Tol 0.0");

// 关闭GiD输出
dyna.Set("GiD_Out 0");

// 禁用滚动摩擦计算（简化模型）
dyna.Set("If_Particle_Cal_Rolling 0");

// 导入底部刚性面用于碰撞检测
rdface.Import("gid", "20m-20m-bound.msh");

// 设置数据自动输出到主机为0（手动控制）
dyna.Set("Auto_Put_Data_To_Host 0");

// 创建第一个非球形颗粒（RGPS001.stl）
var fCenter = [0, 0, 5];
pdyna.CrtPolyhedronPartSTL("RGPS001.stl", 1, fCenter, 2.0, 1, 1, 1);

// 创建第二个非球形颗粒（RGPS002.stl）
var fCenter = [3, 0, 5];
pdyna.CrtPolyhedronPartSTL("RGPS002.stl", 2, fCenter, 2.0, 1, 1, 1);

// 创建第三个非球形颗粒（RGPS003.stl）
var fCenter = [-3, 0, 5];
pdyna.CrtPolyhedronPartSTL("RGPS003.stl", 3, fCenter, 2.0, 1, 1, 1);

// 创建第四个非球形颗粒（RGPS004.stl）
var fCenter = [0, 3, 5];
pdyna.CrtPolyhedronPartSTL("RGPS004.stl", 4, fCenter, 2.0, 1, 1, 1);

// 创建第五个非球形颗粒（RGPS005.stl）
var fCenter = [0, -3, 5];
pdyna.CrtPolyhedronPartSTL("RGPS005.stl", 5, fCenter, 2.0, 1, 1, 1);

// 启用数据自动输出到主机
dyna.Set("Auto_Put_Data_To_Host 1");

// 设置颗粒材料参数（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、平动阻尼、转动阻尼、粘性阻尼）
pdyna.SetPartMat(2500, 1e7, 0.25, 0.0, 0.0, 30, 0.02, 0.02, 0.06);

// 设置颗粒接触模型为考虑应变软化的Mohr-Coulomb模型
pdyna.SetModel("brittleMC");

// 设置动态计算时步为1e-4秒
dyna.Set("Time_Step 1e-4");

// 启用内部监测功能（损伤、破裂统计）
dyna.Set("Particle_Out_Kill 1 0 0.3 0 0.8 0 0.3 0");

// 执行主计算，运行50000步
dyna.Solve(50000);

// 释放动态链接库
dyna.FreeUDF();
