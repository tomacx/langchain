setCurDir(getSrcDir());

// 初始化CDyna仿真环境
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 0.0 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("Moniter_Iter 10");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.4");
dyna.Set("SaveFile_Out 1");

// 设置块体软化参数
dyna.Set("Block_Soften_Value 0.005 0.01");
dyna.Set("Elem_Kill_Option 1 0.01 0.005 1 1");

// 打开允许块体变为颗粒的开关，设置为1表示1个单元转化为1个颗粒
dyna.Set("If_Allow_Block_To_Particles 1 1");

// 创建初始几何模型 - 使用CrtPolyhedronPart创建多面体颗粒
var points = [
    [0, 0, 0],
    [0.5, 0, 0],
    [0.5, 0.5, 0],
    [0, 0.5, 0],
    [0.25, 0.25, 0.25]
];

// 创建多面体颗粒（简化为立方体单元）
pdyna.CrtPolyhedronPart(1, points);

// 设置所有单元为线弹性模型
blkdyn.SetModel("SoftenMC");

// 设置材料参数：密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角、组号
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e6, 3e6, 30.0, 10.0, 1);

// 配置单元转颗粒参数 - 使用材料属性计算刚度
blkdyn.Set("If_B_To_P_Use_Input_Stiff 0");

// 设置接触模型参数 - 法向与切向刚度
blkdyn.Set("Contact_Normal_Stiff 5e10");
blkdyn.Set("Contact_Tangent_Stiff 5e10");

// Y方向底部法向约束（固定）
blkdyn.FixV("y", 8e-8, "y", -0.001, 0.001);

// Y方向顶部施加准静态竖直向下的速度载荷
blkdyn.FixV("y", -8e-8, "y", 0.199, 0.201);

// 设置全部节点的局部阻尼为0.8
blkdyn.SetLocalDamp(0.8);

// 监测典型测点的y方向应力
dyna.Monitor("block", "syy", 0.05, 0.2, 0);
dyna.Monitor("block", "syy", 0.05, 0.1, 0);

// 监测颗粒位置
dyna.Monitor("particle", "xdis", 0.0, 0.5, 0);
dyna.Monitor("particle", "ydis", 0.0, 0.5, 0);

// 更新接触模型
blkdyn.UpdateContact();

// 执行求解
dyna.Solve(120000);
