setCurDir(getSrcDir());

// 设置网格尺寸
var size = 0.3;

// 创建边坡多边形面域
var feng = new Array();
feng[0] = [0, 0, 0, size];
feng[1] = [10, 0, 0, size];
feng[2] = [10, 6, 0, size];
feng[3] = [7, 6, 0, size];
feng[4] = [3, 3, 0, size];
feng[5] = [0, 3, 0, size];
igeo.genPloygenS(feng, 1);

// 划分二维网格
imeshing.genMeshByGmsh(2);

// 从平台读取网格
blkdyn.GetMesh(imeshing);

// 设置块体模型为线性弹性模型
blkdyn.SetModel("linear");

// 设置块体材料参数：密度、弹性模量、泊松比、抗拉强度、抗压强度、内摩擦角、粘聚力
blkdyn.SetMat(2500, 3e8, 0.25, 3e3, 3e3, 15, 10);

// 固定边坡底部及两侧节点位移
blkdyn.FixV("x", 0, "x", -0.01, 0.001);
blkdyn.FixV("x", 0, "x", 9.99, 10.01);
blkdyn.FixV("y", 0, "y", -0.001, 0.001);

// 创建第1根锚索
var fArrayCoord1 = [4, 3.75, 0];
var fArrayCoord2 = [1, -0.694444444, 0];
bar.CreateByDir("cable", fArrayCoord1, fArrayCoord2, 3, 20);

// 创建第2根锚索
var fArrayCoord1 = [5, 4.5, 0];
var fArrayCoord2 = [1, -0.694444444, 0];
bar.CreateByDir("cable", fArrayCoord1, fArrayCoord2, 3, 20);

// 创建第3根锚索
var fArrayCoord1 = [6, 5.25, 0];
var fArrayCoord2 = [1, -0.694444444, 0];
bar.CreateByDir("cable", fArrayCoord1, fArrayCoord2, 3, 20);

// 设置所有锚索的力学模型为可破坏模型
bar.SetModelByID("failure", 1, 100);

// 定义自由段锚索材料参数
var BarPropFree = [1e-2, 7800.0, 1e10, 0.25, 235e6, 235e6, 0.0, 0.0, 1e9, 0.8, 0.0];

// 定义锚固段锚索材料参数
var BarPropBond = [1e-2, 7800.0, 1e10, 0.25, 235e6, 235e6, 1e6, 35, 1e9, 0.8, 0.0];

// 指定每根锚索的自由段材料（节点1-10）
bar.SetPropByID(BarPropFree, 1, 10, 1, 15);

// 指定每根锚索的锚固段材料（节点16-20）
bar.SetPropByID(BarPropBond, 1, 10, 16, 20);

// 在每根锚索的第一个节点上施加预应力，为10kN
bar.ApplyPreTenForce(1e4, 1, 11, 1, 1);
bar.ApplyPreTenForce(1e4, 2, 11, 1, 1);
bar.ApplyPreTenForce(1e4, 3, 11, 1, 1);

// 打开杆件计算开关
dyna.Set("If_Cal_Bar 0");

// 设置大变形计算开关
dyna.Set("Large_Displace 1");

// 设置计算输出间隔为500步
dyna.Set("Output_Interval 500");

// 设置监测信息的输出时步为100步
dyna.Set("Monitor_Iter 100");

// 打开虚拟质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 设置虚拟时步为0.5
dyna.Set("Virtural_Step 0.5");

// 设置重力加速度（Y方向）
dyna.Set("Gravity 0 9.8 0");

// 设置局部阻尼为0.2
blkdyn.SetLocalDamp(0.2);

// 监测锚索轴力
dyna.Monitor("bar", "Force", 1, 1, 0);
dyna.Monitor("bar", "Force", 2, 1, 0);
dyna.Monitor("bar", "Force", 3, 1, 0);

// 设置结果输出文件路径
dyna.Set("Output_File_Name cdyna_result");

// 执行求解，计算14万步
dyna.Solve(140000);

// 绘制锚杆轴力云图
dyna.Plot("Bar", "Force");
