setCurDir(getSrcDir());

// 初始化环境
dyna.Clear();

// 设置基础参数
dyna.Set("Gravity 0.0 0.0 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Output_Interval 500");
dyna.Set("Moniter_Iter 10");

// 关闭热传导计算模块
dyna.Set("Config_Heat 0");
dyna.Set("Heat_Cal 0");
dyna.Set("If_Contact_Transf_Heat 0");

// 创建含圆孔的试样几何模型
igeo.clear();
var geom = igeo.CreateBox([0, 0, 0], [100, 20, 20]);
igeo.AddHole(geom, [50, 10, 0], 10, 0, 0);

// 生成网格
imeshing.clear();
var mesh = imeshing.genBox("sample", geom, [10, 10, 10]);

// 导入网格到块体模块
blkdyn.ImportGrid("gid", mesh);

// 设置试样材料属性（密度、比热容，导热系数置零）
blkdyn.SetMat(2500, 3e8, 0.22, 8e6, 5e6, 35, 10);
blkdyn.SetIMat(1e9, 1e9, 20.0, 0, 0);

// 创建冲击体部件
var impactGeom = igeo.CreateBox([0, 0, 0], [50, 20, 20]);
var impactMesh = imeshing.genBox("impact", impactGeom, [10, 10, 10]);
blkdyn.ImportGrid("impactGid", impactMesh);

// 设置冲击体材料属性
blkdyn.SetMat(impactGid, 2500, 3e8, 0.22, 8e6, 5e6, 35, 10);
blkdyn.SetIMat(impactGid, 1e9, 1e9, 20.0, 0, 0);

// 设置冲击体初始速度边界条件
blkdyn.ApplyConditionByCoord("vel", impactGid, [0, 0, -500], 0, 0, 0, 0, 0, 0, false);

// 固定试样底部
blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);

// 设置时间步长
dyna.Set("Time_Step 1e-6");

// 在圆孔中心区域添加监测点
var centerNode = blkdyn.GetNodeID(50, 10, 0);
blkdyn.Monitor("center", "temp", centerNode, "Coord0", 0);
blkdyn.Monitor("center", "energy", centerNode, "Coord0", 0);

// 设置输出请求记录节点温度及内能变化
blkdyn.SetOutput("node_temp", "temp");
blkdyn.SetOutput("node_energy", "energy");

// 执行求解
dyna.DynaCycle(10000);

print("**********************求解完毕**********************");
