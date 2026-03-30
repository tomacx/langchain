setCurDir(getSrcDir());

// 全局仿真参数配置
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Contact_Detect_Tol 0.0");
dyna.Set("GiD_Out 1");
dyna.Set("Particle_Out_Kill 1 0 0.3 0 0.8 0 0.3 0");

// 创建底部刚性面（容器边界）
var fCoord = [-1.0, 0.0, 0.0, 2.0, 0.0, 0.0];
rdface.Create(1, 1, 2, fCoord);

var fCoord2 = [-1.0, 0.0, 0.0, -1.0, 2.0, 0.0];
var fCoord3 = [2.0, 0.0, 0.0, 2.0, 2.0, 0.0];
rdface.Create(1, 1, 2, fCoord2);
rdface.Create(1, 1, 2, fCoord3);

// 导入PDyna格式的STL文件创建多面体颗粒
pdyna.CrtPolyhedronPartFromFile("SiglePar.stl", "pdyna-par.dat", "uniform", 1, 1.0, 1, 111, 1, 2, 0.003);

// 设置颗粒材料参数（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部平动阻尼、局部转动阻尼、粘性阻尼系数）
pdyna.SetPartMat(2500, 1e6, 0.25, 0.0, 0.0, 10, 0.01, 0.05, 0.06);

// 设置颗粒接触模型为Mohr-Coulomb模型
pdyna.SetModel("brittleMC");

// 设置动态计算时步
dyna.TimeStepCorrect(0.2);

// 求解计算
dyna.Solve(100000);
