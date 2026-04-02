setCurDir(getSrcDir());

scdem.outputInterval = 1000;

scdem.isVirtualMass = 0;

scdem.set("isLargeDisplace", 1);

scdem.set("RayleighDamp", 5e-7, 0);

var msh = imesh.importGmsh("3DBlast-20w.msh");//可更换文件中不同网格数量的网格文件
scdem.getMesh(msh);


scdem.setModel("linear");
scdem.setMat([2700, 70e9, 0.24, 28.3e6, 17.9e6, 55,10]);

scdem.setIModel("FracE");
scdem.setIMatByElem(10);
scdem.setContactFractureEnergy(50,100);

//边界条件

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
scdem.dynaSolveGpu(0.004);

//释放GPU端内存
scdem.releaseGpuMem();

print("finish!");
