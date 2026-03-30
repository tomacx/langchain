setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 几何参数定义
var length = 0.2;
var height = 0.05;
var width = 0.1;

var bulletLength = 0.03;
var bulletDiameter = 0.015;

// 网格尺寸
var deltl = 0.005;
var size = 0.002;

// 创建靶块（组1）
igeo.genRectS(0, 0, 0, length, height, width, 1);

// 创建子弹（组2）- 圆柱体近似为长方体
igeo.genRectS(0.5 * length - bulletLength/2, height + deltl, 0,
               0.5 * length + bulletLength/2, height + deltl + bulletDiameter, width, 2);

// 网格划分
imeshing.genMeshByGmsh(2);

// 获取网格
blkdyn.GetMesh(imeshing);

// 创建接触面
blkdyn.CrtBoundIFaceByGroup(1);
blkdyn.CrtBoundIFaceByGroup(2);
blkdyn.UpdateIFaceMesh();

// 求解器全局设置
dyna.Set("Gravity 0 0 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 1e-4");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Output_Interval 100");
dyna.Set("If_Auto_Create_Contact 1 0");
dyna.Set("Elem_Kill_Option 1 0.1 0.1 1 1");

// 设置靶块JH2材料模型（组1）
blkdyn.SetModel("JH2", 1);
blkdyn.SetMat(2500, 8e10, 0.3, 20e6, 20e6, 45, 10, 2);

var JH2Mat = [8e10, 0.3, -1.5e11, 2.0e11, 5e9, 1e10, 1.01, 0.83, 0.68, 0.76,
              0.005, 3.5e7, 0.01, 0.9, 1.0, 7.0, 1.0];
blkdyn.SetJH2Mat(1, JH2Mat);
blkdyn.BindJH2Mat(1, 1, 1);

// 设置子弹线性弹性材料（组2）
blkdyn.SetModel("linear", 2);
blkdyn.SetMat(7800, 2.1e11, 0.3, 8e8, 8e8, 0, 0, 2);

// 设置脆性断裂模型参数
blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(1e11, 1e11, 0, 0, 0);
blkdyn.SetIStiffByElem(10.0);

// 初始化速度条件 - 子弹沿Z方向以200m/s速度运动
var values = new Array(0.0, -200, 0);
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
blkdyn.InitConditionByGroup("velocity", values, gradient, 2, 2);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.01);

// 时间步长修正
dyna.TimeStepCorrect(0.5);

// 求解
var steps = 5000;
dyna.Solve(steps);

// 输出结果
doc.ExportResult();
