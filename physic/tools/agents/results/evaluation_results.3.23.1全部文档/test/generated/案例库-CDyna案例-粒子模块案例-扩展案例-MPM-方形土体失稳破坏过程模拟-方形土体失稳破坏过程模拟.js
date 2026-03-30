setCurDir(getSrcDir());

// ==================== 1. 初始化求解器环境 ====================
dyna.Clear();
doc.ClearResult();

// ==================== 2. 设置求解控制参数 ====================
dyna.Set("Output_Interval 1000");
dyna.Set("Gravity  0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Time_Step 5e-5");
dyna.Set("UnBalance_Ratio 1e-3");
dyna.Set("Particle_Cal_Type 4");
dyna.Set("If_Contact_Use_GlobMat 1 2 1e8 1e8 0.0 0.0 0.0");

// ==================== 3. 创建方形土体颗粒 ====================
// 土体尺寸：长x宽x高 = 4m x 4m x 2m
pdyna.RegularCreateByCoord(1, 1, 0.05, -2, 2, -2, 2, 0, 0);

// ==================== 4. 设置土体材料参数 ====================
// 密度: 1800 kg/m³, 弹性模量: 1e7 Pa, 泊松比: 0.35
// 抗拉强度: 1e-3 MPa, 粘聚力: 1e-3 MPa, 内摩擦角: 0.01 rad
// 局部阻尼: 0.01, 粘性阻尼: 0
pdyna.SetMat(1800, 1e7, 0.35, 1e-3, 1e-3, 0.01, 0.01, 0);

// ==================== 5. 创建MPM背景网格 ====================
// 网格类型:2(六面体), 单元尺寸:0.06m, 起始坐标:[-2,-2,0], 单元数量:[80,80,40]
mpm.SetBackGrid(2, 0.06, [-2, -2, 0], [80, 80, 40]);

// ==================== 6. 设置MPM本构模型 ====================
// DP: Drucker-Prager弹塑性模型
mpm.SetModelByGroup("DP", 1, 2);

// ==================== 7. 创建刚性边界面 ====================
// 底部固定面 (z = -2)
var bottomCoord = new Array();
bottomCoord[0] = new Array(-2, -2, -2);
bottomCoord[1] = new Array(2, -2, -2);
bottomCoord[2] = new Array(2, 2, -2);
bottomCoord[3] = new Array(-2, 2, -2);
rdface.Create(1, 1, 2, bottomCoord);

// 左侧固定面 (x = -2)
var leftCoord = new Array();
leftCoord[0] = new Array(-2, -2, -2);
leftCoord[1] = new Array(-2, 2, -2);
leftCoord[2] = new Array(-2, 2, 2);
leftCoord[3] = new Array(-2, -2, 2);
rdface.Create(1, 1, 2, leftCoord);

// 右侧固定面 (x = 2)
var rightCoord = new Array();
rightCoord[0] = new Array(2, -2, -2);
rightCoord[1] = new Array(2, 2, -2);
rightCoord[2] = new Array(2, 2, 2);
rightCoord[3] = new Array(2, -2, 2);
rdface.Create(1, 1, 2, rightCoord);

// 前侧固定面 (y = 2)
var frontCoord = new Array();
frontCoord[0] = new Array(-2, 2, -2);
frontCoord[1] = new Array(2, 2, -2);
frontCoord[2] = new Array(2, 2, 2);
frontCoord[3] = new Array(-2, 2, 2);
rdface.Create(1, 1, 2, frontCoord);

// 后侧固定面 (y = -2)
var backCoord = new Array();
backCoord[0] = new Array(-2, -2, -2);
backCoord[1] = new Array(2, -2, -2);
backCoord[2] = new Array(2, -2, 2);
backCoord[3] = new Array(-2, -2, 2);
rdface.Create(1, 1, 2, backCoord);

// ==================== 8. 设置边界条件 ====================
// 底部刚性面固定 (z方向)
pdyna.FixV("xyz", 0, "z", -2, -0.001);
// 左侧刚性面固定 (x方向)
pdyna.FixV("xyz", 0, "x", -2, -0.001);
// 右侧刚性面固定 (x方向)
pdyna.FixV("xyz", 0, "x", 2, -0.001);
// 前侧刚性面固定 (y方向)
pdyna.FixV("xyz", 0, "y", 2, -0.001);
// 后侧刚性面固定 (y方向)
pdyna.FixV("xyz", 0, "y", -2, -0.001);

// ==================== 9. 设置块体模型参数 ====================
blkdyn.SetModel("linear");
blkdyn.SetMat(2000, 1e8, 0.3, 1e6, 1e6, 35, 15);
blkdyn.SetLocalDamp(0.01);

// ==================== 10. 设置初始速度场触发失稳 ====================
// 给土体顶部施加微小扰动速度，触发失稳
pdyna.InitCondByGroup("velocity", [0, 0, 0.5], 1, 2);

// ==================== 11. 设置监测点 ====================
// 监测土体中心区域节点的位移与损伤
dyna.Monitor("block", "xdis", 0, 0, 0);
dyna.Monitor("block", "ydis", 0, 0, 0);
dyna.Monitor("block", "zdis", 0, 0, 0);
// 监测块体破坏度
dyna.Monitor("gvalue", "gv_block_broken_ratio");
// 监测块体损伤因子
dyna.Monitor("gvalue", "gv_block_damage");

// ==================== 12. 设置求解控制 ====================
// 总时长: 5秒 (时步5e-5, 共10万步)
dyna.DynaCycle(100000);
