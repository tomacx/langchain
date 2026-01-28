setCurDir(getSrcDir());

scdem.outputInterval = 1000;
scdem.set("isLargeDisplace", 1);
scdem.set("isVirtualMass", 0);
scdem.set("RayleighDamp", 2e-8, 0);

var msh = imesh.importGmsh("PlateBlast-60w.msh");//可更换文件中不同网格数量的网格文件
scdem.getMesh(msh);

scdem.setModel("Linear");
scdem.setMat([2700, 60e9, 0.2, 25e6, 15e6, 40,10]);

scdem.setIModel("FracE");
scdem.setIMatByElem(10);
scdem.setContactFractureEnergy(20,40);

//边界条件

//z方向左右两侧固定
oSel = new SelNodes(scdem);
oSel.box(-1e10,-1e10,-1e10, 1e10,1e10,1e10);
scdem.setVel(oSel, "z", 0);

//固定上下边界
oSel = new SelNodes(scdem);
oSel.box(-1e10,0.299,-1e10, 1e10,0.301,1e10);
scdem.setVel(oSel, "y", 0);

oSel = new SelNodes(scdem);
oSel.box(-1e10,-0.001,-1e10, 1e10,0.001,1e10);
scdem.setVel(oSel, "y", 0);

//动态边界
var oSel = new SelElemFaces(scdem);
oSel.cylinder(0.15,0.15,0,0.15,0.15,0.005,0.0029,0.0031);
scdem.applyDynaBoundaryFromFileBySel("faceforce",true,-1,0,0,oSel,"BlastLoad.txt");

scdem.timeStep= 2e-9;

scdem.dynaSolveGpu(1.5e-4);

//释放GPU端内存
scdem.releaseGpuMem();