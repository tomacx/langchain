// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 计算结果输出间隔为2000步
scdem.outputInterval = 2000;

scdem.monitorIter = 100;

// 打开虚质量计算开关
scdem.isVirtualMass = 1;

// 虚时步
scdem.virtualStep = 0.5;

scdem.set("isLargeDisplace", 0);

// 创建半径为2cm的圆盘
var msh = imesh.importGmsh("pan-300000.msh"); // 可更换文件中不同网格数量的网格文件
scdem.getMesh(msh);

// 设置单元模型为线弹性模量
scdem.setModel("linear");

// 设置单元的材料参数
scdem.setMat([2700, 60e9, 0.2, 25e6, 15e6, 40,10]);

// 设置交界面的模型为断裂模型
scdem.setIModel("FracE");
scdem.setContactFractureEnergy(5,50);
scdem.setIMatByElem(10);

// 最底侧节点法向约束
oSel = new SelNodes(scdem);
oSel.box(-1e10,-0.0301,-1e10, 1e10,-0.0299,1e10);
scdem.setVel(oSel, "y", 0);

// 最顶侧节点施加2e-9的准静态速度载荷
oSel = new SelNodes(scdem);
oSel.box(-1e10,0.0299,-1e10, 1e10,0.0301,1e10);
scdem.setVel(oSel, "y", -5e-9);

// 区域监控
oSel = new SelNodes(scdem);
oSel.box(-1e10,0.0299,-1e10, 1e10,0.0301,1e10);
scdem.regionMonitor("node", "yForce",1,oSel);

// 局部阻尼
scdem.localDamp = 0.8;

// 计算步数
scdem.solveGpu(100000);

// 释放GPU端内存
scdem.releaseGpuMem();

// 打印提示信息
print("Solution Finished");
