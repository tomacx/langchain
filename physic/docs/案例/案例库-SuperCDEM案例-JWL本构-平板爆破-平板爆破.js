setCurDir(getSrcDir());

scdem.outputInterval = 500;
scdem.monitorIter = 10;

scdem.set("isLargeDisplace", 1);

scdem.gravity = [0, 0, 0];

scdem.isVirtualMass = 0;

scdem.set("ubr", 1e-4);

scdem.set("isVtk", 1);

scdem.set("RayleighDamp", 1e-7, 0);

var msh = imesh.importGmsh("plateblast.msh");
scdem.getMesh(msh);

scdem.setModel("linear");

scdem.setModel(1, "JWL");

scdem.setMat([2500, 5e10, 0.25, 30e6, 15e6, 45.0, 10.0]);

// HNS 1.00 JWL
var pos = [0.05, 0.05, 0.0025];
scdem.setJWLBlastSource(1, 100, 4.1e9, 162.7e9, 10.82e9, 5.4, 1.8, 0.25, 7.5e9, 5100, 0.0, 50e-6, pos);
scdem.bindJWLBlastSource(1, 1, 1);

scdem.setIModel("Linear", 1);
scdem.setIModel("FracE", 2);
scdem.setIModel("FracE", 1, 2);
scdem.setContactFractureEnergy(100,500);
scdem.setContactFractureEnergy(0, 0 , 1,2);
scdem.setIMatByElem(10.0);

// 设置炸药单元与固体单元的接触面参数1
scdem.setIMat(1e14, 1e14, 0, 0, 0, 1, 2);

// 设置无反射条件

///上
oSel = new SelElemFaces(scdem);
oSel.box(-100, 0.0999, -100, 100, 0.1001, 100);
scdem.applyNonReflectionBySel(oSel);

///下
oSel = new SelElemFaces(scdem);
oSel.box(-100, -0.0001, -100, 100, 0.0001, 100);
scdem.applyNonReflectionBySel(oSel);

///左
oSel = new SelElemFaces(scdem);
oSel.box(-0.0001, -100, -100, 0.0001, 100, 100);
scdem.applyNonReflectionBySel(oSel);

///右
oSel = new SelElemFaces(scdem);
oSel.box(0.0999, -100, -100, 0.1001, 100, 100);
scdem.applyNonReflectionBySel(oSel);

// 固定z方向位移
oSel = new SelNodes(scdem);
oSel.box(-1e10, -1e10, -1e10, 1e10, 1e10, 1e10);
scdem.setVel(oSel, "z", 0);

// 炸药中心 z方向上取3个点
scdem.monitor("elem", "sxx", 0.05, 0.05, 0.0025);

// 炸药中心 x 方向上 取 3个点
for (var i = 1; i < 5; i++) {
    scdem.monitor("elem", "sxx", 0.05 + i * 0.005, 0.05, 0.0025);
}

scdem.timeStep = 1e-9;
scdem.dynaSolveGpu(50e-6);


print("finish");