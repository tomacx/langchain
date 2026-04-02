// 加载必要的库和初始化环境
var dyna = new DynaEnvironment();

// 清除之前的计算数据
dyna.Clear();

// 设置重力方向
dyna.Set("Gravity", [0, -9.8, 0]);

// 包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage", 1);

// 开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal", 0);

// 设置输出间隔时间
dyna.Set("Output_Interval", 1000);

// 获取网格数据并设置模型类型和材料属性
var imeshing = new MeshEnvironment();
imeshing.genMeshByGmsh(2);
blkdyn.GetMesh(imeshing);
blkdyn.SetModel("linear");
blkdyn.SetMat(2200, 1e9, 0.3, 5e4, 5e4, 25, 15);

// 定义X、Y、Z三个方向的渗透系数
var arrayK = [1e-10, 1e-10, 1e-10];

// 指定坐标控制范围内的孔隙渗流参数，包括流体密度、体积模量、饱和度、孔隙率、渗透系数和比奥系数
poresp.SetPropByCoord(1000.0, 1e6, 0.0, 0.3, arrayK, 0.5, -500, 500, -500, 500, -500, 500);

// 设置边界条件
blkdyn.FixV("x", 0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0, "x", 39.99, 41);
blkdyn.FixV("y", 0, "y", -0.001, 0.001);

// 设置监测点
dyna.Monitor("block", "xdis", 10, 10, 0);
dyna.Monitor("block", "xdis", 14.2, 16.3, 0);
dyna.Monitor("block", "xdis", 20, 25, 0);

// 进行计算
dyna.Solve();

// 设置模型类型为MC（Mohr-Coulomb）
blkdyn.SetModel("MC");

// 再次进行计算
dyna.Solve();

// 初始化条件
blkdyn.InitConditionByGroup("displace", [0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], 1, 1);

// 设置孔隙渗流开关为开启状态
dyna.Set("PoreSeepage_Cal", 1);

// 设置比奥效应计算开关为开启状态
dyna.Set("If_Biot_Cal", 1);

// 设置当前时间为0
dyna.Set("Time_Now", 0);

// 时间步长校正
dyna.TimeStepCorrect(0.9);

// 给定一个渗流场条件
poresp.InitConditionByCoord("pp", 1.96e5, [0, -9800, 0], -100, 40, -25, 25, -100, 100);

// 清除加载的库和环境
dyna.Clear();
