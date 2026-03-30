setCurDir(getSrcDir());

// 初始化仿真环境参数
scdem.set("ubr", 1e-4);
scdem.set("ubrMode", 2);
scdem.outputInterval = 1000;
scdem.gravity = [0, 0, -10.0];
scdem.set("isLargeDisplace", 0);
scdem.set("isVirtualMass", 1);
scdem.set("virtualStep", 0.6);
scdem.set("localDamp", 0.8);

// 定义模型尺寸参数
var fModelH = 50.0;      // 模型高度 (m)
var fModelL = 60.0;      // 模型宽度 (m)
var fEllipDH = 4.0;      // 椭圆竖向半轴长 (m)
var fEllpDV = 3.5;       // 椭圆水平半轴长 (m)
var fBottomDist = 10.0;  // 隧道底部到模型底部的距离 (m)
var fSizeModel = 2.0;    // 模型四周网格尺寸 (m)
var fSizeTunnel = 1.5;   // 隧道网格尺寸 (m)
var fShellW = 0.3;       // 衬砌厚度 (m)

// 生成带衬砌的椭圆形隧道几何模型
igeo.genEllipseTunnelS(fModelH, fModelL, fEllipDH, fEllpDV, fBottomDist, fSizeModel, fSizeTunnel, 1, fShellW);

// 导入网格（从生成的几何创建网格）
var msh = imesh.importGmsh("tunnel.msh");
scdem.getMesh(msh);

// 设置模型为线弹性模型
scdem.setModel("linear");

// 围岩材料参数 (组号1:外部围岩, 组号2:内部围岩)
var rockMat = [2700, 3.0e9, 0.25, 50e3, 5e3, 20, 3];

// 衬砌材料参数 (组号3)
var liningMat = [2400, 3.0e10, 0.2, 30e6, 30e6, 20, 3];

// 设置围岩材料属性
oSel = new SelElems(scdem);
oSel.box(-fModelL/2 - fSizeModel, -fModelH/2 - fSizeModel, -fBottomDist - fSizeModel,
          fModelL/2 + fSizeModel, fModelH/2 + fSizeModel, fBottomDist + fSizeModel);
scdem.setMat(oSel, rockMat);

// 设置衬砌材料属性
oSel = new SelElems(scdem);
oSel.box(-fEllpDV - fShellW/2, -fEllipDH - fShellW/2, -fBottomDist - fSizeModel,
          fEllpDV + fShellW/2, fEllipDH + fShellW/2, fBottomDist + fSizeModel);
scdem.setMat(oSel, liningMat);

// 设置初始应力场（模拟地应力）
oSel = new SelElems(scdem);
oSel.box(-fModelL/2 - fSizeModel, -fModelH/2 - fSizeModel, -fBottomDist - fSizeModel,
          fModelL/2 + fSizeModel, fModelH/2 + fSizeModel, fBottomDist + fSizeModel);
scdem.setStress(oSel, [0, 0, 15e6]);

// 设置边界条件 - 固定约束
oSel = new SelNodes(scdem);
oSel.box(-fModelL/2 - fSizeModel, -fModelH/2 - fSizeModel, -fBottomDist - fSizeModel,
          -fModelL/2 + fSizeModel, fModelH/2 + fSizeModel, -fBottomDist + fSizeModel);
scdem.setVel(oSel, "x", 0);

oSel = new SelNodes(scdem);
oSel.box(-fModelL/2 - fSizeModel, -fModelH/2 - fSizeModel, -fBottomDist - fSizeModel,
          fModelL/2 + fSizeModel, fModelH/2 + fSizeModel, -fBottomDist + fSizeModel);
scdem.setVel(oSel, "y", 0);

oSel = new SelNodes(scdem);
oSel.box(-fModelL/2 - fSizeModel, -fModelH/2 - fSizeModel, -fBottomDist - fSizeModel,
          fModelL/2 + fSizeModel, fModelH/2 + fSizeModel, -fBottomDist + fSizeModel);
scdem.setVel(oSel, "z", 0);

// 设置边界条件 - 左右侧向约束
oSel = new SelNodes(scdem);
oSel.box(-fModelL/2 - fSizeModel, -fModelH/2 - fSizeModel, -fBottomDist - fSizeModel,
          -fModelL/2 + fSizeModel, fModelH/2 + fSizeModel, fBottomDist + fSizeModel);
scdem.setVel(oSel, "x", 0);

oSel = new SelNodes(scdem);
oSel.box(fModelL/2 - fSizeModel, -fModelH/2 - fSizeModel, -fBottomDist - fSizeModel,
          fModelL/2 + fSizeModel, fModelH/2 + fSizeModel, fBottomDist + fSizeModel);
scdem.setVel(oSel, "x", 0);

// 设置边界条件 - 前后侧向约束
oSel = new SelNodes(scdem);
oSel.box(-fModelL/2 - fSizeModel, -fModelH/2 - fSizeModel, -fBottomDist - fSizeModel,
          fModelL/2 + fSizeModel, fModelH/2 + fSizeModel, -fModelH/2 + fSizeModel);
scdem.setVel(oSel, "y", 0);

oSel = new SelNodes(scdem);
oSel.box(-fModelL/2 - fSizeModel, fModelH/2 - fSizeModel, -fBottomDist - fSizeModel,
          fModelL/2 + fSizeModel, fModelH/2 + fSizeModel, fModelH/2 + fSizeModel);
scdem.setVel(oSel, "y", 0);

// 设置监测点
scdem.monitorIter = 100;
oSel = new SelNodes(scdem);
oSel.box(-fEllpDV - 0.5, -fEllipDH + 0.5, -fBottomDist + 2.0,
          -fEllpDV + 0.5, fEllipDH - 0.5, fBottomDist - 2.0);
scdem.regionMonitor("node", "displacement", 1, oSel);

// 设置输出步长
scdem.timeStep = 1e-6;

// 执行计算
scdem.solveGpu(50000);

// 每隔一定步数推送进度信息
var stepCount = 0;
while(stepCount < scdem.totalSteps) {
    if (stepCount > 0 && stepCount % 1000 == 0) {
        print("计算步数：" + stepCount);
        dyna.PutStep(1, stepCount, 0.1);
    }
    stepCount++;
}

// 导出最终结果
scdem.exportTextData();

// 释放GPU内存
scdem.releaseGpuMem();

print("Tunnel3D-Tunnel仿真完成");
