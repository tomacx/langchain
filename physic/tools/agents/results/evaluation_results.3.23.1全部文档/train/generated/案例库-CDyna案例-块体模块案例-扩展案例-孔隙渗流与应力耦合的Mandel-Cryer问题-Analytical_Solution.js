setCurDir(getSrcDir());

// 初始化环境 - 关闭力学计算（先只处理渗流）
dyna.Set("Mechanic_Cal 0");
dyna.Set("Gravity 0.0 0.0 0.0");
dyna.Set("Output_Interval 100");
dyna.Set("Time_Step 25e-3");

// 包含孔隙渗流计算模块
dyna.Set("Config_PoreSeepage 1");
dyna.Set("PoreSeepage_Cal 1");

// 创建立方体网格几何 (1m x 1m x 1m)
igeo.GeneratePoint([0, 0, 0]);
igeo.GeneratePoint([1, 0, 0]);
igeo.GeneratePoint([0, 1, 0]);
igeo.GeneratePoint([0, 0, 1]);
igeo.GeneratePoint([1, 1, 0]);
igeo.GeneratePoint([1, 0, 1]);
igeo.GeneratePoint([0, 1, 1]);
igeo.GeneratePoint([1, 1, 1]);

// 生成六面体单元网格
blkdyn.GenBrick2D(10, 1.0, 10, 1.0, 10, 1.0);

// 定义材料参数 (基于Mandel-Cryer分析解)
var E = 1e6;        // 弹性模量 Pa
var mu = 0.25;      // 泊松比
var G = E / 2.0 / (1.0 + mu);
var K = E / 3.0 / (1.0 - 2.0 * mu);
var Kw = 1e6;       // 水的压缩模量 Pa
var n = 0.1;        // 孔隙率
var pemk = 1.0e-8;  // 渗透系数 m^2/(Pa*s)
var alpha = 1.0;    // 比奥系数

// 计算Biot参数
var BiotM = Kw / n;
var S = 1.0 / BiotM + 3.0 * alpha * alpha / (3.0 * K + 4.0 * G);
var cc = pemk / S;

// 设置孔隙渗流材料属性 (密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数)
var arrayK = new Array(pemk, pemk, pemk);
poresp.SetPropByCoord(1000.0, Kw, 0.0, n, arrayK, alpha, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 设置力学材料属性
pdyna.Import("gid", "grid.msh");
pdyna.SetModel("brittleMC");
pdyna.SetMat(2500, E, mu, K, Kw, 35, 0.0, n);

// 设置耦合参数选项
dyna.Set("Par_PoreSp_Couple_Option 2 1.0 1e-3 1e-2 1e-2 1.0");

// 创建排水界面 (顶部和侧面)
var oSel = new SelElemBounds(vMesh["Dyna_BlkDyn"]);
oSel.box(-1e5, 1.099, -1e5, 1e5, 1.001, 1e5);
blkdyn.CrtIFaceBySel(oSel);

// 施加初始孔隙压力条件 (顶部)
poresp.ApplyConditionByCoord("pp", 100000.0, [0.0, 0.0, 0.0], -1e5, 1e5, -1e5, 1e5, 0.99, 1.01, true);

// 施加底部排水边界 (压力为0)
poresp.ApplyConditionByCoord("pp", 0.0, [0.0, 0.0, 0.0], -1e5, 1e5, -1e5, 1e5, -1e5, -0.99, true);

// 设置力学边界条件
pdyna.Set("Fixed_Bound 0");
pdyna.Set("Free_Bound 1");

// 监测关键变量
dyna.Monitor("poresp", "sc_pp", 5, 5, 0);
dyna.Monitor("poresp", "sc_displacement", 5, 5, 0);

// 执行求解
dyna.Solve(100000);

// 输出结果
print("Mandel-Cryer Coupled Analysis Completed");
print("Vertical displacement and pore pressure evolution monitored at specific nodes");
