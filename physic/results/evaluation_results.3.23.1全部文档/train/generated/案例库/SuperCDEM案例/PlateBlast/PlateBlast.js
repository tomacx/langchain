setCurDir(getSrcDir());

scdem.outputInterval = 1000;
scdem.monitorIter = 100;

// 关闭虚质量计算开关
scdem.isVirtualMass = 0;

// 设置大位移计算模式
scdem.set("isLargeDisplace", 1);
scdem.set("RayleighDamp", 3.3e-7, 0);

var msh = imesh.importGmsh("singleHole_1.5mm.msh");
scdem.getMesh(msh);

// 设置单元模型为线弹性模量
scdem.setModel("Linear");

// 设置材料参数
scdem.setMat([2660, 54e9, 0.16, 6e6, 6e6, 53,10]);

// 设置交界面的模型为断裂能模型
scdem.setIModel("FracE");
scdem.setContactFractureEnergy(10,20);
scdem.setIMatByElem(50);

// 动态边界条件设置
var oSel = new SelElemFaces(scdem);
oSel.cylinder(0, 0, 0, 0, 0 ,0.15, 0, 3.226e-3);
scdem.applyDynaBoundaryFromFileBySel("faceforce",true,-1,0,0,oSel,"BlastLoad-fit-10us.txt");

// 设置时间步长
scdem.timeStep = 1e-9;

// 进行动力学求解
scdem.dynaSolveGpu(100e-6);

print("finish");
