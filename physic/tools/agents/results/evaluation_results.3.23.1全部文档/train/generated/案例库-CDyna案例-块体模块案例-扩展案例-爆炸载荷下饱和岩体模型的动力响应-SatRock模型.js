setCurDir(getSrcDir());

// 1. 初始化仿真环境，清空所有先前数据
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 2. 设置全局仿真参数
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0 0 0");
dyna.Set("Output_Interval 1000");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("If_Renew_Contact 1");

// 3. 导入预处理的网格文件
var msh1 = imesh.importGmsh("GDEM--quan.msh");
blkdyn.GetMesh(msh1);

// 4. 为不同区域分配材料模型
blkdyn.SetModel("JWL", 1);
blkdyn.SetModel("SatRock", 2);

// 5. 设置炸药和岩体的基础材料参数
blkdyn.SetMat(1680, 8e9, 0.307, 3e6, 1e6, 35, 15, 1); // JWL炸药模型
blkdyn.SetMat(2009, 8e9, 0.307, 3e6, 1e6, 35, 15, 1); // SatRock岩体模型

// 6. 配置SatRock模型的25个参数数组
var afPara = new Array(25);

// 表观剪切模量 (Pa)
afPara[0] = 3.13e9;

// 计算实体压力相关参数 (Beta_s系列，单位：Pa)
afPara[1] = 25.91e9; // Beta_s1 - 实体体模量
afPara[2] = 32.65e9; // Beta_s2
afPara[3] = 8.05e9;  // Beta_s3

// 计算水压力相关参数 (Beta_f系列，单位：Pa)
afPara[4] = 3.61e9;  // Beta_f1 - 水体模量
afPara[5] = 7.80e9;  // Beta_f2
afPara[6] = 7.83e9;  // Beta_f3

// 材料泊松比
afPara[7] = 0.307;

// 初始孔隙率
afPara[8] = 0.0;

// 水初始体积分数
afPara[9] = 0.34;

// 比奥系数
afPara[10] = 1.0;

// 用于计算孔隙率的体积变形耗散率与偏应变耗散率的比值 (0-1之间)
afPara[11] = 0.0;

// 与初始体积分数有关的拟合系数faf、ftf
afPara[12] = -0.20289; // faf
afPara[13] = 0.14657;  // ftf

// 初始屈服面拟合系数faq、fbq、fcq
afPara[14] = 0.711e9;  // faq
afPara[15] = 0.56e-9;  // fbq
afPara[16] = 0.685e9;  // fcq

// 破坏面的拟合系数fap、fbp、fcp
afPara[17] = 1.92e9;   // fap
afPara[18] = 0.335e-9; // fbp
afPara[19] = 1.89e9;   // fcp

// 应变硬化系数 (控制应变硬化速度)
afPara[20] = 1.0;

// 计算损伤因子相关的参数
afPara[21] = 1.0;      // n1 (单位：1/s)
afPara[22] = 1.0;      // n2 (指数)
afPara[23] = 0.5;      // Dc (临界损伤因子)
afPara[24] = 0.1;      // CriPlaStrain (临界塑性应变)

// 7. 调用SetSatRockMat方法设置SatRock材料参数
blkdyn.SetSatRockMat(2, afPara);

// 8. 设置爆炸载荷边界条件 - 冲击波模块
var shockWaveParams = [1, 115, 5000, 3.1e6, 3.0, 1.3333, 7e9, [5.0, 4.8, 0.0], 0.0, 15e-3];
blkdyn.SetLandauSource(1, shockWaveParams);
blkdyn.BindLandauSource(1, 1, 1);

// 9. 定义结果监测区域 - 监测Y方向节点位移和冲击波流速
for (var i = 0; i <= 5; i++) {
    dyna.Monitor("block", "syy", 5.0 + i, 4.8, 0);
}

// 10. 配置绘图输出选项
dyna.Plot("Elem", "Cohesion"); // 单元内聚力云图
dyna.Plot("Node", "Displace", 2); // Y方向节点位移云图
dyna.Plot("SkWave", "Velocity", 1); // 冲击波X方向流速

// 11. 打印全局材料统计信息验证参数设置
dyna.Print("JWLMat"); // JWL爆源参数
dyna.Print("SatRockMat"); // SatRock材料参数

// 12. 执行仿真计算并保存结果
blkdyn.Solve();
