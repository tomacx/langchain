setCurDir(getSrcDir());

scdem.outputInterval = 1000;

scdem.isVirtualMass = 1;

// 设置系统不平衡率为1e-4
scdem.set("ubr", 1e-4);
scdem.set("virtualStep", 0.5);

scdem.set("isLargeDisplace", 1);


scdem.gravity = [0,0,-9.8];

var msh = imesh.importGmsh("3DBlast-20w.msh");//可更换文件中不同网格数量的网格文件
scdem.getMesh(msh);

scdem.setModel("Linear");
scdem.setMat([2700, 60e9, 0.2, 30e6, 15e6, 35,10]);

scdem.setIModel("FracE");
scdem.setIMatByElem(10);
scdem.setContactFractureEnergy(10,100);

//固定边界,计算地应力场
oSel = new SelNodes(scdem);
oSel.box(-100,-100,-0.001,100,100,0.001);
scdem.setVel(oSel, "z", 0);

oSel = new SelNodes(scdem);
oSel.box(-100,-0.001,-100,100,0.001,100);
scdem.setVel(oSel, "y", 0);

oSel = new SelNodes(scdem);
oSel.box(-100,2.99,-100,100,3.01,100);
scdem.setVel(oSel, "y", 0);

oSel = new SelNodes(scdem);
oSel.box(-0.001,-100,-100,0.001,100,100);
scdem.setVel(oSel, "x", 0);

oSel = new SelNodes(scdem);
oSel.box(2.99,-100,-100,3.01,100,100);
scdem.setVel(oSel, "x", 0);

scdem.localDamp = 0.8;
scdem.solveGpu();

//释放固定边界
oSel = new SelNodes(scdem);
oSel.box(-100,-100,-0.001,100,100,0.001);
scdem.freeVelocityBySel(oSel, "z");

oSel = new SelNodes(scdem);
oSel.box(-100,-0.001,-100,100,0.001,100);
scdem.freeVelocityBySel(oSel, "y");

oSel = new SelNodes(scdem);
oSel.box(-100,2.99,-100,100,3.01,100);
scdem.freeVelocityBySel(oSel, "y");

oSel = new SelNodes(scdem);
oSel.box(-0.001,-100,-100,0.001,100,100);
scdem.freeVelocityBySel(oSel, "x");

oSel = new SelNodes(scdem);
oSel.box(2.99,-100,-100,3.01,100,100);
scdem.freeVelocityBySel(oSel, "x");

scdem.timeNow = 0.0;
scdem.isVirtualMass = 0;
scdem.set("RayleighDamp", 2e-8, 0);

//动态边界
var oSel = new SelElemFaces(scdem);
oSel.sphere(1.5,1.5,1.6,0.044,0.046);
scdem.applyDynaBoundaryFromFileBySel("faceforce",true,-1,0,0,oSel,"BlastLoad.txt");

//四周 + 底部无反射边界
oSel = new SelElemFaces(scdem);
oSel.box(-100,-100,-0.001,100,100,0.001);
scdem.applyNonReflectionBySel(oSel);

oSel = new SelElemFaces(scdem);
oSel.box(-100,-0.001,-100,100,0.001,100);
scdem.applyNonReflectionBySel(oSel);

oSel = new SelElemFaces(scdem);
oSel.box(-100,2.99,-100,100,3.01,100);
scdem.applyNonReflectionBySel(oSel);

oSel = new SelElemFaces(scdem);
oSel.box(-0.001,-100,-100,0.001,100,100);
scdem.applyNonReflectionBySel(oSel);

oSel = new SelElemFaces(scdem);
oSel.box(2.99,-100,-100,3.01,100,100);
scdem.applyNonReflectionBySel(oSel);

scdem.timeStep= 1e-7;
scdem.dynaSolveGpu(0.001);

//释放GPU端内存
scdem.releaseGpuMem();

print("finish!");
