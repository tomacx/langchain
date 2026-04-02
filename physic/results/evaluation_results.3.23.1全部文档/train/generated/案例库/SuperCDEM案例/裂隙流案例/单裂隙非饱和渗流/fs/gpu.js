setCurDir(getSrcDir());

// 开启裂隙计算模块并分配内存
scdem.set("Config_FracSeepage", 1);
scdem.set("FracSeepage_Cal", 1);

// 设置渗流模式为气体流动
scdem.set("Seepage_Mode", 2);

// 设置输出间隔和监控迭代次数
scdem.outputInterval = 100;
scdem.monitorIter = 10;

// 导入网格文件并设置模型
var msh = imesh.importGmsh("fracurenet.msh");
scdem.getMesh(msh);
scdem.setModel("linear");

// 设置材料属性
scdem.setMat([2600, 5.5e10, 0.25, 10e6, 2.5e6, 30.0, 10.0]);

// 创建裂隙网格并设置初始条件和边界条件
SFracsp.createGridFromBlock(1);
SFracsp.setPropByCoord([1.00, 1e7, 12e-13, 12e-9], -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 初始化压力条件
SFracsp.initConditionByCoord("pp", 1e5, 0, 0, 0, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
SFracsp.applyConditionByCoord("pp", 30e6, 0, 0, 0, -1e5, 1e5, -0.001, 0.001, -1e5, 1e5);

// 设置时间步长并求解
scdem.timeStep = 1e-7;
scdem.dynaSolveGpu(0.01);

print("finish");
