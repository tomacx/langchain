setCurDir(getSrcDir());

// 初始化CDyna仿真环境
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 0.0 0.0");
dyna.Set("Large_Displace 0");
dyna.Set("Output_Interval 5000");
dyna.Set("Moniter_Iter 10");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.6");
dyna.Set("SaveFile_Out 1");
dyna.Set("Block_Soften_Value 0.001 0.003");

// 创建试件几何：长0.1m，高0.2m的二维矩形单元
blkdyn.GenBrick2D(0.1, 0.2, 50, 100, 1);

// 设置单元本构模型为塑性损伤模型
blkdyn.SetModel("SoftenMC");

// 设置试件材料参数：密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角、组号
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e6, 3e6, 30.0, 10.0, 1);

// 创建上下压板刚体部件（Y方向）
var topPlate = [0.0, 0.2, 0.0];
var bottomPlate = [0.0, -0.005, 0.0];
rdface.Create(1, 1, 2, [[topPlate[0], topPlate[1], topPlate[2]], [topPlate[0]+0.1, topPlate[1], topPlate[2]]]);
rdface.Create(1, 2, 2, [[bottomPlate[0], bottomPlate[1], bottomPlate[2]], [bottomPlate[0]+0.1, bottomPlate[1], bottomPlate[2]]]);

// 配置压板刚体部件属性：密度2700kg/m³，背景网格细分数量50
rdface.CalPartPropAuto(2700, 50, "top_plate");
rdface.CalPartPropAuto(2700, 50, "bottom_plate");

// 建立试件与压板之间的接触定义（摩擦系数0.3）
blkdyn.Contact("block", "plate", 0.3);

// 计算每个单元的刚度矩阵（必须在核心求解前执行）
blkdyn.CalElemStiffMatrix();

// Y方向底部法向约束
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// Y方向顶部施加准静态竖直向下的速度载荷（-1e-9 m/s）
blkdyn.FixV("y", -1e-9, "y", 0.199, 0.201);

// 设置局部阻尼为0.8
blkdyn.SetLocalDamp(0.8);

// 监测典型测点的Y方向应力和应变
dyna.Monitor("block", "syy", 0.05, 0.2, 0);
dyna.Monitor("block", "syy", 0.05, 0.1, 0);
dyna.Monitor("block", "soyy", 0.05, 0.2, 0);
dyna.Monitor("block", "soyy", 0.05, 0.1, 0);

// 计算并输出接触面上的流量传递（如适用）
poresp.CalContactFlowTransfer();

// 执行核心数值求解，计算120000步
dyna.Solve(120000);

// 导出监测数据到Result文件夹
dyna.ExportSortedDataByGroup("element", true, 5000, 5000, 24, 1, 1);
