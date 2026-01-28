setCurDir(getSrcDir());

imesh.importGid("wheel.msh");

//gFun.calArbi3DModelInfo(<pBoundMesh, fDensity [, nTotal [, nPrtFlag [, nExpParFlag]] ]>);
//pBoundMesh-需要计算part信息的mesh指针，导入或创建mesh会产生mesh指针
//fDensity--密度，kg/m3
//nTotal，分割数，可以不写
//nPrtFlag-打印标记，0-1,0-不打，1-打
//nExpParFlag-是否导出颗粒网格，0-不导出，1-导出

gFun.calArbi3DModelInfo(cMesh[2], 1000, 100, 1, 1);