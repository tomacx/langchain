setCurDir(getSrcDir());

// 全局参数配置
scdem.outputInterval = 1000;
scdem.monitorIter = 10;
scdem.isLargeDisplace = 1;
scdem.isVtk = 1;
scdem.gravity = [0, 0, -9.8];
scdem.isVirtualMass = 0;
scdem.set("ubr", 1e-4);
scdem.set("RayleighDamp", 5e-7, 0);

// 导入网格模型
var msh = imesh.importGmsh("plateblast.msh");
scdem.getMesh(msh);

// 设置块体模型类型
scdem.setModel("linear");

// 平板材料参数（连续介质力学属性）
scdem.setMat([2500, 5e10, 0.25, 30e6, 15e6, 45.0, 10.0]);

// 设置炸药区域模型为JWL本构
scdem.setModel(1, "JWL");

// 设置平板材料参数（单元1）
scdem.setMat([2700, 60e9, 0.25, 20e6, 8e6, 35, 10]);

// 设置炸药区域初始压力和绝热指数（CustomModel_MPM接口参数）
scdem.set("GasInitPressure", 4.1e9);
scdem.set("GasAdiabaticIndex", 3.0);

// 设置JWL爆生气体源参数
var pos = [0.05, 0.05, 0.0025];
scdem.setJWLBlastSource(1, 1100, 4.1e9, 162.7e9, 10.82e9, 5.4, 1.8, 0.25, 7.5e9, 5100, 0.0, 50e-6, pos);
scdem.bindJWLBlastSource(1, 1, 1);

// 设置模型类型映射
scdem.setIModel("Linear", 1);
scdem.setIModel("FracE", 2);
scdem.setIModel("FracE", 1, 2);

// 设置接触断裂能参数
scdem.setContactFractureEnergy(100, 500);
scdem.setContactFractureEnergy(0, 0, 1, 2);

// 设置材料属性映射
scdem.setIMatByElem(10.0);

// 设置炸药单元与固体单元的接触面参数
scdem.setIMat(1e14, 1e14, 0, 0, 0, 1, 2);

// 设置无反射边界条件（四周）
var oSel = new SelElemFaces(scdem);
oSel.box(-100, 0.0999, -100, 100, 0.1001, 100);
scdem.applyNonReflectionBySel(oSel);

oSel = new SelElemFaces(scdem);
oSel.box(-100, -0.0001, -100, 100, 0.0001, 100);
scdem.applyNonReflectionBySel(oSel);

oSel = new SelElemFaces(scdem);
oSel.box(-0.0001, -100, -100, 0.001, 100, 100);
scdem.applyNonReflectionBySel(oSel);

oSel = new SelElemFaces(scdem);
oSel.box(0.0999, -100, -100, 100, 100, 100);
scdem.applyNonReflectionBySel(oSel);

// 固定平板底部位移（Z方向）
oSel = new SelNodes(scdem);
oSel.box(-100, -100, -0.001, 100, 100, 0.001);
scdem.applyDynaBoundaryBySel(oSel, "fix", 2);

// 执行颗粒与块体接触检测
pdyna.DetectPBContact();

// 设置时间步长
scdem.timeStep = 1e-7;

// 启动求解器进行时间积分计算
scdem.dynaSolveGpu(0.004);

// 释放GPU端内存
scdem.releaseGpuMem();

print("平板爆破仿真完成！");
