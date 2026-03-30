setCurDir(getSrcDir());

// 清除模块数据
dyna.Clear();
doc.clearResult();

// 打开固体计算开关
dyna.Set("Mechanic_Cal 1");

// 包含裂隙渗流计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

// 打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

// 设置3个方向的重力加速度
dyna.Set("Gravity 0 -9.8 0");

// 设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 500");

// 打开接触更新开关
dyna.Set("If_Renew_Contact 1");

// 创建煤层模型，长400m，高200m，长度方向50个网格，高度方向25个网格，组号为1
blkdyn.GenBrick2D(400, 200, 50, 25, 1);

// 将设定范围内的单元变成组2，便于开挖（煤层区域）
blkdyn.SetGroupByCoord(2, 80, 320, 24, 40, -1, 1);

// 接触面离散，全部单元离散
blkdyn.CrtIFace();

// 更新接触拓扑
blkdyn.UpdateIFaceMesh();

// 将单元模型设置为线弹性模型
blkdyn.SetModel("linear");

// 设置围岩材料参数（组1）：密度、弹性模量、泊松比、剪切模量、杨氏模量、热膨胀系数
blkdyn.SetMat(2500, 1e10, 0.25, 1e6, 0.8e6, 40.0, 10.0);

// 设置煤层材料参数（组2）：密度、弹性模量、泊松比、剪切模量、杨氏模量、热膨胀系数
blkdyn.SetMat(2300, 8e9, 0.3, 3e5, 4.6e5, 35.0, 12.0);

// 设置裂隙渗流参数，依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
fracsp.SetPropByGroup(1000.0, 1e7, 1e-9, 1e-6, 1, 1);

// 设置煤层区域渗流参数（密度、体积模量、渗透系数、裂隙初始开度）
fracsp.SetPropByCylinder(1000.0, 1e7, 1e-8, 1e-5, 80, 320, -1, 80, 320, 1.0, 0, 60);

// 设置孔隙渗流模式为瞬态可压缩液体渗流
dyna.Set("Seepage_Mode 1");

// 设置液体渗流定律为牛顿流体
dyna.Set("Liquid_Seepage_Law 1");

// 配置是否更新单元的孔隙率（0-不更新，1-更新）
dyna.Set("If_Renew_Porosity 1");

// 设置最小孔隙开度
fracsp.SetPropByGroup(1e-6, 1, 1);

// 模型底部施加全约束
blkdyn.FixV("y", 0.0, "y", -0.01, 0.01);

// 模型左右两侧施加法向约束
blkdyn.FixV("x", 0.0, "x", -0.01, 0.01);
blkdyn.FixV("x", 0.0, "x", 399.99, 401);

// 设置初始压力条件（组1围岩区域）
fracsp.InitConditionByGroup(1, [0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], 1, 1);

// 设置初始饱和度条件（组2煤层区域）
fracsp.InitConditionByGroup(2, [0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], 1, 1);

// 设置监测点获取节点压力值及饱和度信息
dyna.Monitor("block", "pore_pressure", 10, 10, 0);
dyna.Monitor("block", "saturation", 25, 10, 0);
dyna.Monitor("block", "pore_pressure", 14.2, 16.3, 0);

// 设置吕荣参数用于统计分析
fracsp.SetLvRongProp(1e-6, 1);

// 求解至稳定（初始力学平衡）
dyna.Solve();

// 设置单元模型为Mohr-Coulomb模型以模拟破裂
blkdyn.SetModel("MC");

// 设置接触模型为脆性断裂模型
dyna.Set("Interface_Soften_Value 1e-3 1e-3");
blkdyn.SetIModel("brittle");

// 重新开启渗流计算并耦合固体破裂
dyna.Set("PoreSeepage_Cal 1");
dyna.Set("If_Biot_Cal 1");

// 设置时间步长
dyna.TimeStepCorrect(1.0);

// 模拟开采边界（移除煤层区域约束）
blkdyn.FixVByCoord("x", 0.0, 80.0, 90.0, -0.1, 0.1, 0, 0);
blkdyn.FixVByCoord("y", 0.0, 24.0, 30.0, -0.1, 0.1, 0, 0);

// 在仿真循环中调用渗流计算函数更新节点状态
var step = 0;
while (step < 500) {
    // 计算节点压力及饱和度（每一步执行）
    fracsp.CalNodePressure();

    // 动态单元流速、流量（每一步执行）
    fracsp.CalElemDischarge();

    // 计算与固体破裂的耦合（每一步执行）
    fracsp.CalIntSolid();

    // 计算渗流动态边界（每一步执行）
    fracsp.CalDynaBound();

    step++;
}

// 获取节点压力值用于结果输出
var nodePressure = fracsp.GetNodeValue(10, 10, 0, "pore_pressure");
var nodeSaturation = fracsp.GetNodeValue(25, 10, 0, "saturation");

// 获取单元流速与流量数据
var elemDischarge = fracsp.GetElemValue(1, "discharge");

// 导出监测结果文件供分析使用
doc.ExportResult("seepage_mineexca_result.txt", ["pore_pressure", "saturation", "discharge"]);
