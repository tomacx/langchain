setCurDir(getSrcDir());

// 初始化环境
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置重力加速度为0
dyna.Set("Gravity 0.0 0.0 0.0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置输出间隔为100步
dyna.Set("Output_Interval 100");

// 设置监测信息输出时步为10步
dyna.Set("Monitor_Iter 10");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 打开接触更新开关
dyna.Set("If_Renew_Contact 1");

// 设置接触容差
dyna.Set("Contact_Detect_Tol 0.001");

// 创建简单立方体几何（炸药装药）
igeo.GeneratePoint([0, 0, 0]);
igeo.GeneratePoint([1, 0, 0]);
igeo.GeneratePoint([0, 1, 0]);
igeo.GeneratePoint([0, 0, 1]);

// 创建四面体单元
igeo.CreateTetrahedron(1, [0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]);

// 生成网格
imeshing.GenerateMesh("tet", 1);

// 创建界面
blkdyn.CrtIFace(1);
blkdyn.CrtIFace(-1, -1);
blkdyn.UpdateIFaceMesh();

// 设置模型类型
blkdyn.SetModel("linear");
blkdyn.SetModel("LeeTarver", 2);

// 岩体参数（材料ID=2009）
blkdyn.SetMat(2009, 8e9, 0.307, 10e7, 6e7, 35, 15);

// 炸药参数（材料ID=1680）
blkdyn.SetMat(1680, 8e9, 0.307, 3e6, 1e6, 35, 15, 1);

// 设置Lee-Tarver时间点火源参数
// 序号、初始比内能、fA、fB、fC、fD、fE、fG、爆速、点火坐标、点火时间、持续时间
blkdyn.SetLeeTarverSource(1, 7.43e11, 0.05, 0.667, 0.667, 0.111, 0.333, 1.0,
                          20.0, 1.0, 2.0, 3.1, 400, 0.3, 0.50, 0.0, 2);

// 绑定Lee-Tarver源到单元
blkdyn.BindLeeTarverSource(1, 2, 2);

// 设置监测变量：密度、压力、温度
for(var i = 1; i <= 5; i++) {
    dyna.Monitor("blkdyn", "bd_dens", i * 100, 1680, 1);
    dyna.Monitor("blkdyn", "bd_pp", i * 100, 1680, 1);
    dyna.Monitor("blkdyn", "bd_temp", i * 100, 1680, 1);
}

// 设置监测变量：应力分量
for(var i = 1; i <= 5; i++) {
    dyna.Monitor("blkdyn", "bd_sxx", i * 100, 1680, 1);
    dyna.Monitor("blkdyn", "bd_syy", i * 100, 1680, 1);
    dyna.Monitor("blkdyn", "bd_szz", i * 100, 1680, 1);
}

// 设置监测变量：应变分量
for(var i = 1; i <= 5; i++) {
    dyna.Monitor("blkdyn", "bd_exx", i * 100, 1680, 1);
    dyna.Monitor("blkdyn", "bd_eyy", i * 100, 1680, 1);
    dyna.Monitor("blkdyn", "bd_ezz", i * 100, 1680, 1);
}

// 设置结果输出策略
dyna.Set("Result_File 1");
dyna.Set("Restart_File 1");

// 执行计算循环
dyna.DynaCycle(20);

print("冲击起爆-时间点火仿真完成");
