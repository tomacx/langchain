// 定义爆破源参数
var pos = [2.5, 2.5, 2.0];
scdem.setJWLBlastSource(1, 1100, 4.1e9, 162.7e9, 10.82e9, 5.4, 1.8, 0.333, 5.15e9, 4160, 0.0, 1e-2, pos);

// 设置网格文件
var msh = imesh.importGmsh("BallBlast-40W.msh");
scdem.getMesh(msh);

// 设置材料参数
scdem.setMat([2700, 60e9, 0.25, 20e6, 8e6, 35, 10]); // 岩石材料参数

// 设置裂隙渗流模块参数
scdem.set("Config_FracSeepage", 1);
scdem.set("FracSeepage_Cal", 1);
scdem.set("Seepage_Mode", 2);
scdem.set("FS_Solid_Interaction", 1);
scdem.set("FS_Gas_Index", 4/3);
scdem.set("FS_MaxWid", 1e-1);
scdem.set("FS_MinWid", 0.0);

// 设置气体流动模型参数
scdem.set("GasFlowModel", 2); // 开启湍流流动模型

// 设置JWL爆生气体流动计算
scdem.set("isJWLBlastGasFlow", 1);
scdem.set("CSRoughness", 0.01);

// 设置气体状态方程参数
scdem.set("GasEos", 2); // 采用多方方程进行气体流动计算

// 设置输出间隔和监控迭代次数
scdem.outputInterval = 10000;
scdem.monitorIter = 100;

// 开始求解
scdem.dynaSolveGpu(0.01);

print("finish");
