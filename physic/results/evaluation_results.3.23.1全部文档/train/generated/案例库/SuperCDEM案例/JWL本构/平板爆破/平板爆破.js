setCurDir(getSrcDir());

scdem.outputInterval = 100;
scdem.monitorIter = 10;

scdem.set("isLargeDisplace", 1);
scdem.set("RayleighDamp", 1e-7, 0);

var msh = imesh.importGmsh("plateblast.msh");
scdem.getMesh(msh);

scdem.setModel("linear");

// 设置材料模型
scdem.setModel(1, "JWL");
scdem.setMat([2500, 5e10, 0.25, 15e6, 10e6, 40.0, 10.0]);

// 设置爆炸源参数
var pos = [0.05, 0.05, 0.0025];
scdem.setJWLBlastSource(1, 1000, 4.1e9, 162.7e9, 10.82e9, 5.4, 1.8, 0.25, 7.5e9, 5100, 0.0, 25e-6, pos);
scdem.bindJWLBlastSource(1, 1, 1);

// 设置接触模型
scdem.setIModel("Linear", 1);
scdem.setIModel("FracE", 2);
scdem.setContactFractureEnergy(0, 0);
scdem.setIMatByElem(10);

// 设置接触面参数
scdem.setIMat(1e14, 1e14, 0, 0, 0, 1, 2);

// 设置无反射条件
var oSel = new SelElemFaces(scdem);
oSel.box(-100, 0.0999, -100, 100, 0.1001, 100);
scdem.applyNonReflectionBySel(oSel);

oSel = new SelElemFaces(scdem);
oSel.box(-100, -0.0001, -100, 100, 0.0001, 100);
scdem.applyNonReflectionBySel(oSel);

oSel = new SelElemFaces(scdem);
oSel.box(-0.0001, -100, -100, 0.0001, 100, 100);
scdem.applyNonReflectionBySel(oSel);

oSel = new SelElemFaces(scdem);
oSel.box(0.0999, -100, -100, 0.1001, 100, 100);
scdem.applyNonReflectionBySel(oSel);

// 固定z方向位移
oSel = new SelNodes(scdem);
oSel.box(-1e10, -1e10, -1e10, 1e10, 1e10, 1e10);
scdem.setVel(oSel, "z", 0);
