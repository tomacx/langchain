setCurDir(getSrcDir());

// 设置系统不平衡率
bcdem.ubr = 1e-4;

// 设置云图更新间隔
bcdem.outputInterval = 100;

// 开启虚质量计算开关
bcdem.isVirtualMass = 1;

// 设置虚时步
bcdem.virtualStep = 0.6;

// 导入 Gmsh 格式网格文件
var msh = imesh.importGmsh("UCT2d.msh");
bcdem.getMesh(msh);

// 设置单元模型为线弹性
bcdem.setModel("linear");

// 定义单元材料属性
oMat = new Object;
oMat.density = 2500;
oMat.young = 1e10;
oMat.poission = 0.25;
oMat.cohesive = 3e6;
oMat.tension = 3e6;
oMat.friction = 40;
oMat.dilatation = 10;
bcdem.setMat(oMat);

// 设置界面接触模型为脆性断裂模型
bcdem.setIModel("brittleMC");

// 指定应用单元编号（根据网格文件调整）
bcdem.setIMatByElem(10);

// 选择底部节点区域施加垂直方向位移速度边界条件
oSel1 = new SelNodes(bcdem);
oSel1.box(-1e5, 0.099, -1e5, 1e5, 0.101, 1e5);
bcdem.setVel(oSel1, "y", -2e-8);

// 选择顶部节点区域施加约束
oSel2 = new SelNodes(bcdem);
oSel2.box(-1e5, -0.001, -1e5, 1e5, 0.001, 1e5);
bcdem.setVel(oSel2, "y", 0.0);

// 配置局部阻尼系数
bcdem.localDamp = 0.5;

// 开启大变形计算开关
bcdem.set("isLargeDisplace", 1);

// 调用 GPU 求解器执行计算任务
bcdem.solveGpu(30000);

// 释放 GPU 端内存
bcdem.releaseGpuMem();

// 输出计算完成提示信息
print("Solution Finished");
