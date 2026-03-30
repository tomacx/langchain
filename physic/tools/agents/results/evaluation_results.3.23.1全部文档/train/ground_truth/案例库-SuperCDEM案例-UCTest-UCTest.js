//设置文件路径
setCurDir(getSrcDir());

// 设置系统不平衡率为1e-4
bcdem.ubr = 1e-4;

//设置云图更新间隔
bcdem.outputInterval = 100;

//打开虚质量开关
bcdem.isVirtualMass = 1;

//设置虚时步
bcdem.virtualStep = 0.6;

//导入计算网格
//var msh1 = imesh.importAnsys("wedge522.dat");
var msh = imesh.importGmsh("UCT2d.msh");
bcdem.getMesh(msh);

//施加单元材料参数(含单元模型设置)
oMat = new Object;
oMat.density = 2500;
oMat.young = 1e10;
oMat.poission = 0.25;
oMat.cohesive = 3e6;
oMat.tension = 3e6;
oMat.friction = 40;
oMat.dilatation = 10;
bcdem.setModel("linear");
bcdem.setMat(oMat);

//施加界面材料参数(含接触面模型设置)
bcdem.setIModel("brittleMC");
bcdem.setIMatByElem(10);

//施加位移边界条件
oSel1 = new SelNodes(bcdem);
oSel1.box(-1e5,0.099,-1e5,1e5,0.101,1e5);
bcdem.setVel(oSel1, "y", -2e-8);
oSel2 = new SelNodes(bcdem);
oSel2.box(-1e5,-0.001,-1e5,1e5,0.001,1e5);
bcdem.setVel(oSel2, "y", 0.0);

//设置局部阻尼
bcdem.localDamp = 0.5

//求解至稳定
//bcdem.solve(30000);
bcdem.solveGpu(30000);

print("Solution Finished");
