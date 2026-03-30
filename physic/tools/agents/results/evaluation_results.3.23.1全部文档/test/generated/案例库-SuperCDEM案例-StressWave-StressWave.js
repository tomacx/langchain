setCurDir(getSrcDir());

// 计算结果输出间隔为5000步
scdem.outputInterval = 5000;

// 迭代监测频率为100
scdem.monitorIter = 100;

// 打开虚质量计算开关
scdem.isVirtualMass = 1;

// 虚时步
scdem.virtualStep = 0.5;

// 关闭大变形设置
scdem.set("isLargeDisplace", 0);

// 导入三维网格模型文件
var msh = imesh.importGmsh("stresswave_3D.msh");
scdem.getMesh(msh);

// 设置单元模型为线弹性模量
scdem.setModel("linear");

// 设置固体介质材料参数 [密度, 弹性模量, 泊松比, 屈服强度1, 屈服强度2, 其他...]
scdem.setMat([2700, 60e9, 0.2, 25e6, 15e6, 40, 10]);

// 设置交界面模型为断裂模型
scdem.setIModel("FracE");
scdem.setContactFractureEnergy(5, 50);
scdem.setIMatByElem(10);

// 获取模型中心点附近的节点ID作为应力波源点
var sourceNodeId = skwave.GetNodeID(0.0, 0.0, 0.0);

// 设置源节点的初始压力值以激发应力波（1e6 Pa）
if (sourceNodeId > 0) {
    var retV = skwave.SetNodeValue(sourceNodeId, "press", 1e6);
    print("Source node ID: " + sourceNodeId + ", Set pressure result: " + retV);
}

// 选取模型底部节点施加法向约束条件（y方向速度为0）
oSel = new SelNodes(scdem);
oSel.box(-1e10, -0.0301, -1e10, 1e10, -0.0299, 1e10);
scdem.setVel(oSel, "y", 0);

// 选取模型顶部节点施加准静态速度载荷（-5e-9 m/s）
oSel = new SelNodes(scdem);
oSel.box(-1e10, 0.0299, -1e10, 1e10, 0.0301, 1e10);
scdem.setVel(oSel, "y", -5e-9);

// 设置顶部节点区域监测y方向力
oSel = new SelNodes(scdem);
oSel.box(-1e10, 0.0299, -1e10, 1e10, 0.0301, 1e10);
scdem.regionMonitor("node", "yForce", 1, oSel);

// 设置局部阻尼系数
scdem.localDamp = 0.8;

// 启动GPU求解器进行计算，指定计算步数
scdem.solveGpu(100000);

// 释放GPU端内存资源
scdem.releaseGpuMem();

// 打印提示信息确认仿真计算结束
print("StressWave Simulation Finished");
