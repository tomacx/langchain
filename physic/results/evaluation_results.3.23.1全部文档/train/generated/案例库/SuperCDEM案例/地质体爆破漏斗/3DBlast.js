setCurDir(getSrcDir());

scdem.outputInterval = 1000;

// 设置材料模型和参数
scdem.setModel("Linear");
scdem.setMat([2700, 60e9, 0.25, 30e6, 15e6, 35, 10]);

// 导入网格文件
var msh = imesh.importGmsh("example.msh"); // 替换为实际的网格文件名
scdem.getMesh(msh);

// 设置边界条件
oSel = new SelNodes(scdem);
oSel.box(-100, -100, -0.001, 100, 100, 0.001);
scdem.setVel(oSel, "z", 0);

// 设置重力
scdem.gravity = [0, 0, -9.8];

// 解算地应力场
scdem.solveGpu();

// 释放固定边界
oSel.box(-100, -100, -0.001, 100, 100, 0.001);
scdem.freeVelocityBySel(oSel, "z");

// 设置爆破源参数
var pos = [2.5, 2.5, 2.0];
scdem.setJWLBlastSource(1, 1100, 4.1e9, 162.7e9, 10.82e9, 5.4, 1.8, 0.333, 5.15e9, 4160, 0.0, 1e-2, pos);

// 绑定爆破源
scdem.bindJWLBlastSource(1, 1, 1);

// 设置接触断裂能
scdem.setContactFractureEnergy(10, 100);

// 开启GPU求解器
scdem.localDamp = 0.8;
scdem.solveGpu();

// 释放GPU资源
scdem.freeVelocityBySel(oSel, "z");
