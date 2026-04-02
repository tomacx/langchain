setCurDir(getSrcDir());

scdem.outputInterval = 5000;
scdem.monitorIter = 100;
scdem.isVirtualMass = 0;

scdem.set("isLargeDisplace", 1);
scdem.set("RayleighDamp", 3.3e-7, 0);

var msh = imesh.importGmsh("example.msh"); // 假设的网格文件
scdem.getMesh(msh);

scdem.setModel("Linear");
scdem.setMat([2660, 54e9, 0.16, 6e6, 6e6, 53, 10]); // 设置材料参数

// 边界条件设置
var oSel = new SelElemFaces(scdem);
oSel.cylinder(0, 0, 0, 0, 0 ,0.15, 0, 3.226e-3); // 假设的边界选择器

// 应用动态边界条件
scdem.applyDynaBoundaryFromFileBySel("faceforce", true, -1, 0, 0, oSel, "example_load.txt");

scdem.timeStep = 1e-9;
scdem.dynaSolveGpu(100e-6);

print("Solution Finished");
