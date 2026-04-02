// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 设置系统不平衡率为1e-4
scdem.set("ubr", 1e-4);

// 设置云图更新间隔
scdem.outputInterval = 100;

// 打开虚质量计算开关
scdem.isVirtualMass = 1;

// 虚时步设置为0.6
scdem.virtualStep = 0.6;

// 导入网格文件并获取网格数据
var msh = imesh.importGmsh("U3D.msh");
scdem.getMesh(msh);

// 设置单元模型为线弹性模量
scdem.setModel("linear");

// 设置单元的材料参数
oMat = [2500, 1e10, 0.25, 10e6, 4e6, 40.0, 10.0];
scdem.setMat(oMat);

// 设置交界面模型为断裂模型
scdem.setIModel("FracE");
scdem.setIMatByElem(10);
scdem.setContactFractureEnergy(5,50);

// 最底侧节点法向约束
oSel = new SelNodes(scdem);
oSel.box(-1e10,-0.0301,-1e10, 1e10,-0.0299,1e10);
scdem.setVel(oSel, "y", 0);

// 最顶侧节点施加准静态速度载荷
oSel = new SelNodes(scdem);
oSel.box(-1e10,0.0301,-1e10, 1e10,0.0303,1e10);
scdem.setVel(oSel, "y", -2e-9);

// 设置局部阻尼
scdem.localDamp = 0.8;

// 计算步数
scdem.solveGpu(100000);

// 释放GPU端内存
scdem.releaseGpuMem();

// 打印提示信息
print("Solution Finished");
