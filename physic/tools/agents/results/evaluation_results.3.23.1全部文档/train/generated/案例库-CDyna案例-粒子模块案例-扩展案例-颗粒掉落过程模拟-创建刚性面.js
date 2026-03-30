setCurDir(getSrcDir());

// 清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

// 清除平台结果数据
doc.clearResult();

// 设置输出间隔为500步
dyna.Set("Output_Interval 500");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 设置3个方向的全局重力加速度 (x, y, z)
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

// 创建第一组随机分布颗粒
var x = [-1.4, 1.4];
var y = [0, 1.8];
var z = [-1, 1];
pdyna.CreateByCoord(5000, 1, 2, 0.05, 0.05, 0.0, x, y, z);

// 设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

// 设置颗粒材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数
pdyna.SetMat(2500, 1e8, 0.2, 0.0, 0.0, 20, 0.0, 0.2);

// 创建底部刚性面 (矩形区域)
var acoord = new Array();
acoord[0] = [-1.5, -0.5, 0];
acoord[1] = [1.5, -0.5, 0];
rdface.Create(1, 1, 2, acoord);

// 创建后部刚性面
var acoord = new Array();
acoord[0] = [-1.5, 2, 0];
acoord[1] = [1.5, 2, 0];
rdface.Create(1, 1, 2, acoord);

// 创建左部刚性面
var acoord = new Array();
acoord[0] = [-1.5, -0.5, 0];
acoord[1] = [-1.5, 2, 0];
rdface.Create(1, 1, 2, acoord);

// 创建右部刚性面
var acoord = new Array();
acoord[0] = [1.5, -0.5, 0];
acoord[1] = [1.5, 2, 0];
rdface.Create(1, 1, 2, acoord);

// 设置时间步长修正因子
dyna.TimeStepCorrect(0.8);

// 配置颗粒与刚性面接触检测参数
pdyna.DetectPFContact();

// 计算求解 (10000步)
dyna.Solve(10000);

// 导出结果文件
imesh.genSurfMesh("1", "dispoint.txt", 100, 100, "tri");
imesh.exportAnsys("Bound.dat");
