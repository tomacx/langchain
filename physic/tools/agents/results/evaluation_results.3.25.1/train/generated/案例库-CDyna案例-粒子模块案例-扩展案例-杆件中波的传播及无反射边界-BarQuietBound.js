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
dyna.Set("Time_Step 1e-6");

//从GiD导入颗粒
pdyna.Import("gid","20m1m-bar.msh");

//设置颗粒模型为脆性断裂模型
pdyna.SetModel("linear");

//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 3e10, 0.2, 3e7, 6e7, 36, 0.0, 0.01);

//设定三个方向载荷系数
var coeff=new Array(10,0.0,0.0)
//x方向下限及上限
var x= new Array(-0.2,0.2);
//y方向下限及上限
var y= new Array(-10.0,10.0);
//z方向下限及上限
var z= new Array(-10.0,10.0);
//设定动态速度边界
pdyna.ApplyDynaCondSinByCoord ("velocity", coeff, 0.0, 1, 2e-3, 0.0, 0.0, 1e-3, x, y, z);

//设置无反射边界
pdyna.ApplyQuietBoundByCoord(19.8,21,-1000,1000,-1,1);

//监测结果
dyna.Monitor("particle","pa_xvel",0,0.5,0);
dyna.Monitor("particle","pa_xvel",5,0.5,0);
dyna.Monitor("particle","pa_xvel",10,0.5,0);
dyna.Monitor("particle","pa_xvel",15,0.5,0);
dyna.Monitor("particle","pa_xvel",20,0.5,0);

dyna.Monitor("particle","pa_sxx",0,0.5,0);
dyna.Monitor("particle","pa_sxx",5,0.5,0);
dyna.Monitor("particle","pa_sxx",10,0.5,0);
dyna.Monitor("particle","pa_sxx",15,0.5,0);
dyna.Monitor("particle","pa_sxx",20,0.5,0);

//运行用户自定义命令流
dyna.RunUDFCmd("CalDist 0.0 0.0 0.0 10.0 10.0 0.0");

//卸载已经加载的动态链接库
dyna.FreeUDF();
