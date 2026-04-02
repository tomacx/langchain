setCurDir(getSrcDir());

scdem.outputInterval = 100;
scdem.monitorIter = 10;

// 创建网格模型
var msh = imesh.importGmsh("pan-300000.msh");
scdem.getMesh(msh);

// 设置单元模型为线弹性模量
scdem.setModel("linear");

// 设置材料参数
scdem.setMat([2700, 60e9, 0.25, 20e6, 8e6, 35, 10]);

// 设置交界面的模型为断裂模型
scdem.setIModel("FracE");
scdem.setContactFractureEnergy(5, 50);
scdem.setIMatByElem(10);

// 最底侧节点法向约束
oSel = new SelNodes(scdem);
oSel.box(-1e10, -0.0301, -1e10, 1e10, -0.0299, 1e10);
scdem.setVel(oSel, "y", 0);

// 最顶侧节点施加准静态速度载荷
oSel = new SelNodes(scdem);
oSel.box(-1e10, 0.0299, -1e10, 1e10, 0.0301, 1e10);
scdem.setVel(oSel, "y", -5e-9);

// 设置JWL爆源参数
var pos = [0, 0, 0];
scdem.setJWLBlastSource(1, 1100, 4.1e9, 162.7e9, 10.82e9, 5.4, 1.8, 0.3, 1000, 1000, pos);

// 开启JWL爆生气体流动计算
scdem.set("isJWLBlastGasFlow", 1);
scdem.set("FS_Solid_Interaction", 1); // 开启裂隙场和固体场耦合计算

// 计算步数
scdem.solveGpu(10000);

// 释放GPU端内存
scdem.releaseGpuMem();

print("Solution Finished");
