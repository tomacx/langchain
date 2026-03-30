setCurDir(getSrcDir());

// 清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

// 清除GDEM-Env中的结果数据
doc.clearResult();

// 设置输出的间隔为500步
dyna.Set("Output_Interval 500");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 设置三个方向的全局重力加速度为-9.8 m/s^2 (y方向)
dyna.Set("Gravity 0.0 -9.8 0.0");

// 打开单元大变形计算开关
dyna.Set("Large_Displace 1");

// 打开单元接触更新开关
dyna.Set("If_Renew_Contact 1");

// 设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

// 设置计算时步为4e-5
dyna.Set("Virtural_Step 0.3");

// 创建矩形土体区域 (2m x 1m x 0.05m)
igeo.genRectS(0, 0, 0, 2, 1, 0, 0.025, 1);

// 生成有限元网格
imeshing.genMeshByGmsh(2, "soil-fem");

// 获取有限元网格
blkdyn.GetMesh(imeshing);

// 创建颗粒模型 (从块体转换)
pdyna.CreateFromBlock(2, 1, 11);

// 导出颗粒数据文件
pdyna.Export("soil-dem.dat");

// 导入有限元网格
blkdyn.ImportGrid("gmsh", "soil-fem.msh");

// 设置单元模型为线弹性模型
blkdyn.SetModel("SoftenMC");

// 设置有限元材料参数:密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角
blkdyn.SetMat(2500, 1e8, 0.25, 3e5, 3e5, 25, 15);

// 设置单元的局部阻尼
blkdyn.SetLocalDamp(0.8);

// 固定底部边界 (y方向)
blkdyn.FixV("xyz", 0, "y", -0.05, 0.05);

// 固定侧面边界 (x方向)
blkdyn.FixV("xyz", 0, "x", 1.95, 2.05);

// 导入颗粒模型数据
pdyna.Import("pdyna", "soil-dem.dat");

// 设置颗粒模型为脆性断裂模型
pdyna.SetModel("SSMC");

// 设置颗粒材料参数:密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数
pdyna.SetMat(2500, 1e8, 0.25, 3e5, 3e5, 25, 0.8, 0.0);

// 固定颗粒底部边界 (y方向)
pdyna.FixV("xyz", 0, "y", -0.05, 0.05);

// 固定颗粒侧面边界 (x方向)
pdyna.FixV("xyz", 0, "x", 1.95, 2.05);

// 创建顶部刚性切割工具面
var fCoord = new Array();
fCoord[0] = new Array(0, 0.6, 0.0);
fCoord[1] = new Array(-0.8, 0.5, 0.0);
rdface.Create(1, 2, 2, fCoord);

var fCoord = new Array();
fCoord[0] = new Array(0, 0.6, 0.0);
fCoord[1] = new Array(-0.8, 1.2, 0.0);
rdface.Create(1, 2, 2, fCoord);

// 设置刚性面模型属性
rdface.SetModelByGroup(0, 1, 11);

// 启用FEM与DEM耦合转化计算
dyna.Set("If_Cal_FEM_DEM_Evolvement 1");

// 启用渗流与颗粒拖曳力耦合 (模式1:渗流给颗粒施加拖曳力)
dyna.Set("Par_PoreSp_Couple_Option 1");

// 设置单元分割数nDiv=10以平衡精度与计算时间
blkdyn.SetMatByStratum("arrange.txt", 1, 11, 10);

// 在求解器迭代循环中将颗粒映射到背景格子进行接触检测
var solverLoop = dyna.Solve(5000);
while (solverLoop) {
    pdyna.CellMapping();
}

// 创建切割工具运动轨迹 - 向下移动切割
var fvalue = new Array(0.0, -0.1, 0.0);
rdface.InitCondByGroup("displace", fvalue, 1, 5);

// 打印求解完成信息
print("SoilCuttingSimulation completed successfully!");
