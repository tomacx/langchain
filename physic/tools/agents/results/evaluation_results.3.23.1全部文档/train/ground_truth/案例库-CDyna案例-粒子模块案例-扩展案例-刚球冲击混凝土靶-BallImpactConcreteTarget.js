//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//设置输出的间隔为500步
dyna.Set("Output_Interval 500");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

//设置三个方向的全局重力加速度为0
dyna.Set("Gravity 0.0 0.0 0.0");

//打开单元大变形计算开关
dyna.Set("Large_Displace 1");

//打开单元接触更新开关
dyna.Set("If_Renew_Contact 1");

//设置接触容差为1cm
dyna.Set("Contact_Detect_Tol 2e-3");

//设置计算时步为5e-5
dyna.Set("Time_Step 2e-5");

//从GiD导入颗粒
pdyna.Import("gid","Impact3.msh");

//设置颗粒模型为脆性断裂模型
pdyna.SetModel("SSMC");

//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(7800, 2.1e11, 0.33, 500e6, 500e6, 0.0, 0.0, 0.05, 2);

pdyna.SetMat(2500, 3e10, 0.2, 10e6, 10e6, 40, 0.0, 0.05,1);

var fvalue = new Array(0.0, -500.0, 0.0);
pdyna.InitCondByGroup ("velocity", fvalue, 2,2);

pdyna.FixV("xyz", 0.0, "x", -1, 0.05);

pdyna.FixV("xyz", 0.0, "x", 1.95, 3);

pdyna.FixV("xyz", 0.0, "z", -1, 0.05);

pdyna.FixV("xyz", 0.0, "z", 1.95, 3);

dyna.TimeStepCorrect(0.8);

//求解1万步
dyna.Solve(10000);

//打印信息
print("Solution is ok!");
