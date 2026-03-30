setCurDir(getSrcDir());

// 初始化环境
dyna.Clear();
dyna.Set("Output_Interval 500");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0.0 -9.8 0.0");

// 导入或生成块体网格
blkdyn.ImportGrid("gid", "TwoElemLink.msh");

// 设置块体模型为线弹性
blkdyn.SetModel("linear");

// 设置块体材料参数：密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角
blkdyn.SetMat(2500, 3e9, 0.25, 8e5, 8e5, 35, 15);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.01);

// 创建Link单元 - 在块体边界上创建增强杆件
var coord1 = new Array(0, 0, 0);
var coord2 = new Array(1, 0, 0);
link.CreateByCoord(coord1, coord2, 1);

var coord3 = new Array(0, 0.5, 0);
var coord4 = new Array(1, 0.5, 0);
link.CreateByCoord(coord3, coord4, 2);

// 设置Link单元计算开关
dyna.Set("If_Cal_Link 1");

// 设置边界条件 - 固定底部节点
blkdyn.FixV("z", 0.0, "z", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);

// 设置耦合面（可选，用于块体间连接）
trff.CrtFace(2, 100);
trff.SetModel("linear");
trff.SetMat(5e9, 5e9, 20, 0, 0, 1e8);

// 设置接触容差
dyna.Set("Contact_Detect_Tol 0.0");

// 设置时间步长
dyna.TimeStepCorrect(0.8);

// 执行求解
dyna.Solve();

// 导出块体单元数据
blkdyn.ExportElemDataByGroup("block_data.txt", 1);

// 导出Link单元数据
link.ExportElemDataByGroup("link_data.txt", 1, 2);
