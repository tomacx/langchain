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
dyna.Set("Contact_Detect_Tol 1e-2");

//设置计算时步为5e-5
dyna.Set("Time_Step 2e-5");

//从GiD导入颗粒
pdyna.Import("gid","BallImpact2D.msh");

//设置颗粒模型为脆性断裂模型
pdyna.SetModel("SSMC");

//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e8, 0.2, 3e7, 6e7, 36, 0.0, 0.1,2);

pdyna.SetMat(2500, 1e6, 0.2, 3e4, 6e4, 25, 0.0, 0.1,1);

//定义三个方向基础值
var values = new Array(0.0,-1000, 0);
//定义变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
//将组号1到3范围内的节点速度初始化为设定值
pdyna.InitCondByGroup ("velocity", values, 2,2);

//求解2万步
dyna.Solve(20000);
