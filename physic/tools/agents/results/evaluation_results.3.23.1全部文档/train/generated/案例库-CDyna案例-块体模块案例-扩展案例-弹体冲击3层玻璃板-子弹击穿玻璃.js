setCurDir(getSrcDir());

// ========== 1. 初始化仿真环境 ==========
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0 0 -9.8");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 1e-4");
dyna.Set("Output_Interval 500");
dyna.Set("Monitor_Iter 100");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("SaveFile_Out 1");

// ========== 2. 导入几何模型 ==========
var msh1 = imesh.importAnsys("3ceng.dat");
blkdyn.GetMesh(msh1);

// ========== 3. 创建接触面并更新网格拓扑 ==========
blkdyn.CrtIFace(1);
blkdyn.CrtIFace(2);
blkdyn.CrtIFace(3);
blkdyn.CrtBoundIFaceByCoord(-1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
blkdyn.UpdateIFaceMesh();

// ========== 4. 设置材料属性 ==========
// 玻璃层1 (密度2500 kg/m³)
blkdyn.SetMat(2500, 70e9, 0.23, 80e6, 50e6, 30, 5, 1);
// 玻璃层2 (密度2500 kg/m³)
blkdyn.SetMat(2500, 70e9, 0.23, 80e6, 50e6, 30, 5, 2);
// 玻璃层3 (密度2500 kg/m³)
blkdyn.SetMat(2500, 70e9, 0.23, 80e6, 50e6, 30, 5, 3);
// 子弹材料 (钢，密度7800 kg/m³)
blkdyn.SetMat(7800, 210e9, 0.3, 1500e6, 1000e6, 30, 5, 4);

// ========== 5. 设置接触面本构模型 ==========
blkdyn.SetIModel("brittleMC");
blkdyn.SetIModel("linear", 4); // 子弹设为线弹性
blkdyn.SetIStrengthByElem();
blkdyn.SetIMat(1e11, 1e11, 35, 5e6, 2e6, 1, 2);
blkdyn.SetIMat(1e11, 1e11, 35, 5e6, 2e6, 2, 3);
blkdyn.SetIMat(1e11, 1e11, 35, 5e6, 2e6, 3, 4); // 玻璃-子弹接触
blkdyn.SetIStiffByElem(10.0);

// ========== 6. 设置边界条件 ==========
// 固定底层玻璃板底部 (y=0)
blkdyn.FixV("xyz", 0, "y", -0.0001, 0.0001);
// 固定两侧支撑 (x方向约束)
blkdyn.FixV("xyz", 0, "x", -0.0001, 0.0001);
blkdyn.FixV("xyz", 0, "x", 299e-3, 301e-3);

// ========== 7. 设置子弹初始速度 ==========
var fvalue = new Array(0.0, 50.0, 0.0); // 子弹沿Y方向以50m/s速度运动
pdyna.InitCondByGroup("velocity", fvalue, 4, 4);

// ========== 8. 设置靶板记录穿透信息 ==========
// 创建可穿透靶板，中心(0,0,0)，半径100mm，高度范围-5mm到5mm
pfly.CrtPeneHeightTarget(0.0, 0.0, 0.0, 0.1, 60, -0.005, 0.005);

// ========== 9. 设置监测信息 ==========
dyna.Monitor("block", "ydis", 0.0, 0.03, 0);
dyna.Monitor("block", "ydis", 0.0, 0.06, 0);
dyna.Monitor("block", "ydis", 0.0, 0.09, 0);

// ========== 10. 执行求解器 ==========
dyna.Solve(50000);

// ========== 11. 输出结果 ==========
blkdyn.ExportIntDataByPlane(new Array(0.0, 0.0, 0.0), new Array(0.0, 1.0, 0.0), 0.001, "contact_spring.txt");
pfly.ExportPeneTargetInfo(60, 0.0, 0.0);

print("Simulation completed successfully!");
