//设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

//导入ansys网格文件
var omsh1 = imesh.importAnsys("ansys.dat");

//检查是否成功导入网格
if (omsh1) {
    print("ANSYS网格已成功导入");
} else {
    print("ANSYS网格导入失败，请检查文件路径和格式");
}

//剖分网格并进行计算设置
var msh = imesh.importGmsh("pan-300000.msh"); // 可更换不同网格数量的网格文件
scdem.getMesh(msh);

// 设置单元模型为线弹性模量
scdem.setModel("linear");

// 设置材料参数
scdem.setMat([2700, 60e9, 0.2, 25e6, 15e6, 40, 10]);

// 设置交界面的模型为断裂模型
scdem.setIModel("FracE");
scdem.setContactFractureEnergy(5, 50);
scdem.setIMatByElem(10);

// 最底侧节点法向约束
var oSel = new SelNodes(scdem);
oSel.box(-1e10, -0.0301, -1e10, 1e10, -0.0299, 1e10);
scdem.setVel(oSel, "y", 0);

// 最顶侧节点施加准静态速度载荷
oSel = new SelNodes(scdem);
oSel.box(-1e10, 0.0299, -1e10, 1e10, 0.0301, 1e10);
scdem.setVel(oSel, "y", -5e-9);

// 区域监控
oSel = new SelNodes(scdem);
oSel.box(-1e10, 0.0299, -1e10, 1e10, 0.0301, 1e10);
scdem.regionMonitor("node", "yForce", 1, oSel);

// 设置局部阻尼
scdem.localDamp = 0.8;

// 计算步数设置
scdem.solveGpu(100000);

// 释放GPU端内存
scdem.releaseGpuMem();

print("计算完成");
