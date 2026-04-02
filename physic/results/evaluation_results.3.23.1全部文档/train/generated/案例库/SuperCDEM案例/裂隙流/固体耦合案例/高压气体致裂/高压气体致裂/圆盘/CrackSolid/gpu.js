setCurDir(getSrcDir());

// 设置计算结果输出间隔为100步
scdem.outputInterval = 100;
scdem.monitorIter = 10;

// 关闭虚质量计算开关
scdem.isVirtualMass = 0;

// 打开大位移计算开关
scdem.set("isLargeDisplace", 1);

// 包含裂隙计算模块，开辟相应内存
scdem.set("Config_FracSeepage", 1);
scdem.set("FracSeepage_Cal", 1);

// 设置重力为0
scdem.set("gravity",[0.0,0.0,0.0]);

var msh = imesh.importGmsh("pan-300000.msh");
scdem.getMesh(msh);

// 设置单元模型为线弹性模量
scdem.setModel("linear");

// 设置单元的材料参数
scdem.setMat([2700, 60e9, 0.2, 25e6, 15e6, 40,10]);

// 设置交界面的模型为断裂模型
scdem.setIModel("FracE");
scdem.setContactFractureEnergy(5,50);
scdem.setIMatByElem(10);

SFracsp.createGridFromBlock(1);

SFracsp.setPropByCoord([1.0, 1e7, 12e-13, 12e-9], -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
SFracsp.initConditionByCoord("pp", 1e5, 0, 0, 0,  -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

SFracsp.applyConditionByCylinder("pp", 30e6,  0, 0, 0,    0,0,-1,0,0,1, 0,0.151);

scdem.timeStep = 1e-7;

// 开始GPU计算
scdem.dynaSolveGpu(0.01);

print("finish");
