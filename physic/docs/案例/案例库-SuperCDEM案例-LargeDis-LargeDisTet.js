//设置文件路径
setCurDir(getSrcDir());

//cdem.set("dpMode",1);

// 设置系统不平衡率为1e-4
scdem.ubr = 1e-4;

//设置云图更新间隔
scdem.outputInterval = 100;

//打开虚质量开关
scdem.isVirtualMass = 1;

//设置虚时步
scdem.virtualStep = 0.6;

//打开大变形开关
scdem.isLargeDisplace = 1;

//导入计算网格
var msh1 = imesh.importGmsh("LargeDis_Tet.msh");
scdem.getMesh(msh1);

//施加单元材料参数(含单元模型设置)
scdem.setModel("linear");
oMat = {"density":2500, "young":1e6, "poission":0.35, "cohesive":1.35e9,
 "tension":0.68e9, "friction":30, "dilatation":10};
scdem.setMat(oMat);

//施加界面材料参数(含接触面模型设置)
scdem.setIModel("linear");
scdem.setIMatByElem(10);

//施加位移边界条件
oSel = new SelNodes(scdem);
oSel.box(0.05,0.05,0.00499,0.052,0.052,0.00501);
scdem.setVel(oSel, "z", -2e-6);

oSel = new SelNodes(scdem);
oSel.box(-0.0001,-1e5,-1e5,0.0001,1e5,1e5);
scdem.setVel(oSel, "z", 0.0);
oSel = new SelNodes(scdem);
oSel.box(0.099,-1e5,-1e5,0.101,1e5,1e5);
scdem.setVel(oSel, "z", 0.0);

scdem.monitor("node", "xAcc", 0.05,0.05,0.025);
scdem.monitor("node", "yAcc", 0.05,0.05,0.025);
scdem.monitor("node", "zAcc", 0.05,0.05,0.025);

scdem.monitor("node", "xVel", 0.05,0.05,0.025);
scdem.monitor("node", "yVel", 0.05,0.05,0.025);
scdem.monitor("node", "zVel", 0.05,0.05,0.025);

scdem.monitor("node", "xDis", 0.05,0.05,0.025);
scdem.monitor("node", "yDis", 0.05,0.05,0.025);
scdem.monitor("node", "zDis", 0.05,0.05,0.025);

scdem.monitor("node", "sxx", 0.05,0.05,0.025);
scdem.monitor("node", "syy", 0.05,0.05,0.025);
scdem.monitor("node", "szz", 0.05,0.05,0.025);

scdem.monitor("node", "exx", 0.05,0.05,0.025);
scdem.monitor("node", "eyy", 0.05,0.05,0.025);
scdem.monitor("node", "ezz", 0.05,0.05,0.025);

//设置局部阻尼
scdem.set("localDamp", 0.2);

//求解至稳定
scdem.solveGpu();

//释放GPU端内存
scdem.releaseGpuMem();

//打印提示信息
print("Solution Finished");