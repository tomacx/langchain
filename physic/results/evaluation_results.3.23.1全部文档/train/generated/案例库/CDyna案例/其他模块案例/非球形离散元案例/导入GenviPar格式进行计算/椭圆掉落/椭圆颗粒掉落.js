//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//设置结果的输出间隔为500步
dyna.Set("Output_Interval 1000");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

//设置接触容差
dyna.Set("Contact_Detect_Tol 5e-3");

var fCoord = [1,2];
rdface.Create (1, 1, 2, fCoord);

pdyna.ImportPartGenviPar("ellipse.gvpx");

print("11");

//设置颗粒的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetPartMat(2500, 1e9, 0.25, 1e6, 5e6, 30, 0.01, 0.1, 0.1);

//设置颗粒接触模型为考虑应变软化的Mohr-Coulomb模型
pdyna.SetModel("brittleMC");

//设置动态计算时步为1e-4秒
dyna.Set("Time_Step 2e-4");

pdyna.ExportPartGenviPar("export.gvpx");

//计算3万步
dyna.Solve(10000);

pdyna.ExportPartGenviPar("export2.gvpx");
