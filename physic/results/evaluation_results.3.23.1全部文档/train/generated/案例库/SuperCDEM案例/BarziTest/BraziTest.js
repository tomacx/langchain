setCurDir(getSrcDir());

scdem.outputInterval = 1000;
scdem.monitorIter = 10;

// 设置虚拟质量参数
scdem.isVirtualMass = 0;

// 设置大型位移计算模式
scdem.set("isLargeDisplace", 1);

// 设置Rayleigh阻尼系数
scdem.set("RayleighDamp", 5e-7, 0);

// 裂隙渗流模块参数设置
scdem.set("Config_FracSeepage", 1);
scdem.set("FracSeepage_Cal", 1);
scdem.set("Seepage_Mode", 2); // 流动模式设置为气体
scdem.set("FS_Solid_Interaction", 1); // 开启裂隙场和固体场耦合计算
scdem.set("FS_Gas_Index", 4/3); // 气体常数值设置
scdem.set("FS_MaxWid", 1e-1);
scdem.set("FS_MinWid", 0.0); // 最小开度设置为0.0
scdem.set("FS_Frac_Start_Cal", 1); // 开启破裂才进行气体压力计算
scdem.set("isJWLBlastGasFlow", 1); // 开启爆生气体流动
scdem.set("GasFlowModel", 2); // 开启湍流流动模型

// 设置粗糙度和气体方程参数
scdem.set("CSRoughness", 0.001);
scdem.set("GasEos", 2); // 采用多方方程进行气体流动计算
scdem.set("ErosionMassThreshold", 0.01); // 删除炸药单元的临界质量比

// 导入网格文件
var msh = imesh.importGmsh("plateblast.msh");
scdem.getMesh(msh);

// 设置材料模型和参数
scdem.setModel("linear");

scdem.setMat([2500, 5e10, 0.25, 30e6, 15e6, 45.0, 10.0]);
scdem.setMat(1, [1000, 10e9, 0.2, 1e3, 1e3, 30, 10]); // 炸药材料参数

// 设置爆源
var pos = [0.05, 0.05, 0.0025];
scdem.setJWLBlastSource(1, 931, 2.484e9, 49.46e9, 1.891e6, 3.907, 1.118, 0.333, 5.15e9, 4160, 0.0, 1e-2, pos);
scdem.bindJWLBlastSource(1, 1, 1);

// 设置接触模型和参数
scdem.setIModel("Linear", 1);
scdem.setIModel("FracE", 2);
scdem.setIModel("FracE", 1, 2);
scdem.setContactFractureEnergy(10,100);
scdem.setContactFractureEnergy(0, 0 , 1,2);

// 计算
scdem.solveGpu(100000);

// 释放GPU内存
scdem.releaseGpuMem();

print("Solution Finished");
