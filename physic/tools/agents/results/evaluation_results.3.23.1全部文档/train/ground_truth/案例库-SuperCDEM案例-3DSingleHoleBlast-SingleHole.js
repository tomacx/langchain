setCurDir(getSrcDir());

scdem.outputInterval = 5000;
scdem.monitorIter = 100;
scdem.isVirtualMass = 0;

scdem.set("isLargeDisplace", 1);
scdem.set("RayleighDamp", 3.3e-7, 0);

scdem.set("isVtk", 1);

var msh = imesh.importGmsh("singleHole_1.5mm.msh");//可更换文件中不同网格数量的网格文件
scdem.getMesh(msh);

scdem.setModel("Linear");
scdem.setMat([2660, 54e9, 0.16, 6e6, 6e6, 53,10]);

scdem.setIModel("FracE");
scdem.setContactFractureEnergy(10,20);
scdem.setIMatByElem(50);

//边界条件

//动态边界
var oSel = new SelElemFaces(scdem);
oSel.cylinder(0, 0, 0, 0, 0 ,0.15, 0, 3.226e-3);
scdem.applyDynaBoundaryFromFileBySel("faceforce",true,-1,0,0,oSel,"BlastLoad-fit-10us.txt");

scdem.timeStep= 1e-9;
scdem.dynaSolveGpu(100e-6);

print("finish");
