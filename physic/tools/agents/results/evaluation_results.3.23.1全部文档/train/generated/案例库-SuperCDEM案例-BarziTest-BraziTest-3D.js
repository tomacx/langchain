setCurDir(getSrcDir());

// 计算结果输出间隔为2000步
scdem.outputInterval = 2000;

scdem.monitorIter = 100;

// 打开虚质量计算开关
scdem.isVirtualMass = 1;

// 虚时步
scdem.virtualStep = 0.5;

scdem.set("isLargeDisplace", 0);

// 导入网格文件（半径2cm的圆盘）
var msh = imesh.importGmsh("pan-300000.msh");
scdem.getMesh(msh);

// 设置单元模型为线弹性模量
scdem.setModel("linear");

// 设置单元的材料参数 [密度, 弹性模量, 泊松比, 粘聚力, 抗拉强度, 内摩擦角, 剪胀角]
scdem.setMat([2700, 60e9, 0.2, 25e6, 15e6, 40, 10]);

// 设置交界面的模型为断裂模型
scdem.setIModel("FracE");
scdem.setContactFractureEnergy(5, 50);
scdem.setIMatByElem(10);

// 对坐标控制范围内的单元的抗拉强度进行随机化
// 随机系数范围：0.8-1.2，确保材料异质性
blkdyn.RandomizeMatByCoord("tension", 0.8, 1.2, -0.03, 0.03, -0.05, 0.05, -0.05, 0.05);

// 对粘聚力进行随机化
blkdyn.RandomizeMatByCoord("cohesion", 0.8, 1.2, -0.03, 0.03, -0.05, 0.05, -0.05, 0.05);

// 最底侧节点法向约束（y方向）
oSel = new SelNodes(scdem);
oSel.box(-1e10, -0.0301, -1e10, 1e10, -0.0299, 1e10);
scdem.setVel(oSel, "y", 0);

// 最顶侧节点施加准静态速度载荷（巴西劈裂试验）
oSel = new SelNodes(scdem);
oSel.box(-1e10, 0.0299, -1e10, 1e10, 0.0301, 1e10);
scdem.setVel(oSel, "y", -5e-9);

// 顶部节点法向力监测
oSel = new SelNodes(scdem);
oSel.box(-1e10, 0.0299, -1e10, 1e10, 0.0301, 1e10);
scdem.regionMonitor("node", "yForce", 1, oSel);

// z方向左右两侧固定（防止侧向位移）
oSel = new SelNodes(scdem);
oSel.box(-1e10, -1e10, -1e10, 1e10, 1e10, 1e10);
scdem.setVel(oSel, "z", 0);

// 设置局部阻尼
scdem.localDamp = 0.8;

// 计算10万步
scdem.solveGpu(100000);

// 释放GPU端内存
scdem.releaseGpuMem();

// 打印提示信息
print("Solution Finished");
