//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

//清除GDEM-Env中的结果数据
doc.clearResult();

//设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//设置重力加速度
dyna.Set("Gravity 0.0 0.0 -9.8");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//颗粒接触的更新时步为10
dyna.Set("Renew_Interval 10");

//设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

//打开杆件计算开关
dyna.Set("If_Cal_Bar 1");

//设置杆件与颗粒的耦合方式为接触耦合
dyna.Set("Bar_Couple_Type 2");

//导入gid格式的杆件，确定杆件类型为pile
bar.Import("gid","cable","net.msh");
//创建杆件全局参数
var BarProp1 = [0.01, 7800.0, 1e10, 0.25, 235e6, 235e6, 1e6, 35, 1e9, 0.1, 0.0];

//施加杆件性质
bar.SetPropByID(BarProp1, 1, 10000000, 1, 15);

//约束杆件X方向最小、最大边上的全部速度。
var types = new Array(true, true, true);//三个方向是否约束
var values = new Array(0.0, 0.0, 0.0);//三个方向的平动速度分量值
bar. FixVelByCoord(types, values, -0.001,0.001, -1e5, 1e5, -1e5, 1e5);
bar. FixVelByCoord(types, values, 9.999,11, -1e5, 1e5, -1e5, 1e5);

bar.ApplyGravity(0,0,0);

//创建随机分布的颗粒
var x = new Array(3, 7);
var y = new Array(3, 7);
var z = new Array(0.5, 5);
pdyna.CreateByCoord(3000, 1, 2, 0.3, 0.3, 0.1, x,y,z);

//设定颗粒模型为脆断模型
pdyna.SetModel("brittleMC");

//设定颗粒接触材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 3e7, 0.25, 1e4, 3e4, 25, 0.0, 0.05);


//设定动态计算时步
dyna.Set("Time_Step 8e-5");

//求解10万步
dyna.Solve(100000);