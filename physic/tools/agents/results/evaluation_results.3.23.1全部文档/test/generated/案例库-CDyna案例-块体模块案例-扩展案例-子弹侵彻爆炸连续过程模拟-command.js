setCurDir(getSrcDir());

// 初始化环境
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// ==================== 几何创建 ====================
var bulletLength = 0.1;
var bulletDiameter = 0.02;
var targetHeight = 0.5;
var targetRadius = 0.3;
var explosiveRadius = 0.15;

// 创建子弹（圆柱体）
igeo.genCylS(0, 0, 0, bulletLength, bulletDiameter / 2, 0, 1);

// 创建靶板（圆柱体）
igeo.genCylS(bulletLength + 0.05, 0, 0, targetHeight, targetRadius, 0, 2);

// 创建炸药区域（球体边界）
igeo.genSphere(bulletLength + targetHeight + 0.1, 0, 0, explosiveRadius, 3);

// ==================== 网格划分 ====================
imeshing.genMeshByGmsh(2);

// ==================== 求解器设置 ====================
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 1e-4");
dyna.Set("Output_Interval 100");
dyna.Set("Time_Step 1e-8");
dyna.Set("Elem_Kill_Option 1 0.1 0.1 1 1");

// ==================== 导入网格并设置材料 ====================
blkdyn.GetMesh(imeshing);

// 子弹材料（钢，JH2模型）
var JH2Mat = [8e10, 0.3, -1.5e11, 2.0e11, 5e9, 1e10, 1.01, 0.83, 0.68, 0.76, 0.005, 3.5e7, 0.01, 0.9, 1.0, 7.0, 1.0];
blkdyn.SetModel("JH2");
blkdyn.SetMat(7800, JH2Mat);
blkdyn.BindJH2Mat(1, 1, 1);

// 靶板材料（混凝土，Mohr-Coulomb）
blkdyn.SetModel("MC");
blkdyn.SetMat(2500, 3e10, 0.25, 20e6, 20e6, 45, 10, 1);

// ==================== 炸药与粒子生成 ====================
// 设置JWL炸药参数（TNT）
var pos = new Array(1);
pos[0] = [bulletLength + targetHeight + 0.1, 0, 0];
blkdyn.SetJWLSource(1, 1630, 7.0e9, 371.2e9, 3.2e9, 4.2, 0.95, 0.30, 21e9, 6930, pos, 0.0, 15e-3);
blkdyn.BindJWLSource(1, 1, 100);

// 生成炸药粒子（半径0.05m）
var parmsh = pargen.gen(0.05);

// ==================== 接触设置 ====================
blkdyn.CrtBoundIFaceByGroup(1);
blkdyn.CrtBoundIFaceByGroup(2);
blkdyn.UpdateIFaceMesh();

// ==================== 初始条件 ====================
// 子弹初始速度（沿Y轴方向）
var bulletVel = new Array(0.0, 500.0, 0.0);
blkdyn.InitConditionByGroup("velocity", bulletVel, [0, 0, 0, 0, 0, 0, 0, 0, 0], 1, 1);

// ==================== 监测命令设置 ====================
// 起爆时间
var fBeginTime = 0.0;

// ==================== 求解循环 ====================
// 运行5ms仿真
dyna.DynaCycle(5e-3);

// ==================== 输出结果 ====================
// 计算子弹与靶板中心距离
dyna.RunUDFCmd("CalDist " + (bulletLength + targetHeight) + " 0.0 0.0 " + (bulletLength + targetHeight + 0.1) + " 0.0 0.0");

// 输出总体积变化
dyna.RunUDFCmd("PrintTotalVolume");

// ==================== 导出结果 ====================
doc.ExportResult();
