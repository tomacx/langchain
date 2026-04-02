setCurDir(getSrcDir());

// 设置输出间隔和监控迭代次数
scdem.outputInterval = 100;
scdem.monitorIter = 10;

// 设置大位移计算参数
scdem.set("isLargeDisplace", 1);

// 设置重力加速度为零
scdem.gravity = [0, 0, 0];

// 关闭虚拟质量
scdem.isVirtualMass = 0;

// 设置阻尼系数
scdem.set("ubr", 1e-4);
scdem.localDamp = 0.8;

// 裂隙渗流模块参数设置
scdem.set("Config_FracSeepage", 1);
scdem.set("FracSeepage_Cal", 1);
scdem.set("Seepage_Mode", 2); // 设置为气体流动模式
scdem.set("FS_Solid_Interaction", 1);
scdem.set("FS_MaxWid", 6e-5);

// 导入网格模型
var msh = imesh.importGmsh("Tet4Gmsh.msh");
scdem.getMesh(msh);

// 设置材料属性
scdem.setModel("linear");
scdem.setMat([2600, 5.5e10, 0.25, 10e6, 2.5e6, 30.0, 10.0]);

// 设置损伤模型和接触断裂能量
scdem.setIModel("FracE");
scdem.setContactFractureEnergy(10, 20);

// 设置初始条件
SFracsp.createGridFromBlock(1);
SFracsp.setPropByCoord([1.0, 1e7, 12e-13, 12e-9], -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
SFracsp.initConditionByCoord("pp", 1e5, 0, 0, 0, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 应用边界条件
SFracsp.applyConditionByCylinder("pp", 30e6, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0.151);

// 设置时间步长并求解
scdem.timeStep = 1e-7;
scdem.dynaSolveGpu(0.01);

print("finish");
