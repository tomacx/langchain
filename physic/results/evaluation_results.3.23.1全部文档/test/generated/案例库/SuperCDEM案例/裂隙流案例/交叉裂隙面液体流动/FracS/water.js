setCurDir(getSrcDir());

// 开启裂隙渗流模块并设置计算参数
scdem.set("Config_FracSeepage", 1);
scdem.set("FracSeepage_Cal", 1);

// 导入网格文件
var msh = imesh.importGmsh("your_mesh_file.msh");
scdem.getMesh(msh);

// 设置材料模型和参数
scdem.setModel("linear");
scdem.setMat([2700, 60e9, 0.25, 20e6, 8e6, 35, 10]);

// 创建裂隙网格
SFracsp.createGridFromBlock(1);

// 设置流体属性参数
SFracsp.setProp([170.0, 1e7, 12e-13, 12e-9]);

// 应用边界条件，例如压力条件
SFracsp.applyConditionBySel("pp", 20e6);

// 设置输出间隔和监控迭代次数
scdem.outputInterval = 500;
scdem.monitorIter = 10;

// 开始计算
scdem.dynaSolveGpu(8);
print("finish");
