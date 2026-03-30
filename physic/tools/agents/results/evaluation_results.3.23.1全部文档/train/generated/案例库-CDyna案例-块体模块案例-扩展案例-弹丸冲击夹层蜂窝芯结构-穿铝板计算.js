setCurDir(getSrcDir());

// ========== 1. 仿真环境初始化 ==========
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Output_Interval 500");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Renew_Interval 100");
dyna.Set("Contact_Detect_Tol 1e-6");

// ========== 2. 材料参数定义 ==========
// 铝靶板材料 (铝合金2024-T3)
blkdyn.SetMat(2730, 72e9, 0.33, 400e6, 400e6, 0.0, 5, 1);

// 蜂窝芯材料 (铝泡沫)
blkdyn.SetMat(2730, 76e9, 0.33, 220e6, 220e6, 0.0, 5, 1, 10);

// 弹丸材料 (钢)
blkdyn.SetMat(7800, 200e9, 0.3, 1500e6, 1500e6, 0.0, 5, 2);

// ========== 3. 网格导入与模型设置 ==========
blkdyn.ImportGrid("ansys", "model-1.dat");
blkdyn.SetModel("FEP");

// 创建接触面
blkdyn.CrtIFace(1);
blkdyn.CrtIFace(2);
blkdyn.CrtBoundIFaceByCoord(-1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
blkdyn.UpdateIFaceMesh();

// ========== 4. 单元组与材料绑定 ==========
// 将不同组号的单元关联到对应材料
blkdyn.BindMat(1, 1, 10);   // 靶板前层铝
blkdyn.BindMat(2, 11, 20);  // 蜂窝芯
blkdyn.BindMat(3, 21, 30);  // 弹丸

// ========== 5. 边界条件设置 ==========
// 固定蜂窝芯后端 (假设在Z方向)
blkdyn.FixV("xyz", 0, "z", -0.0001, 0.0001);
blkdyn.FixV("xyz", 0, "x", -0.0001, 0.0001);
blkdyn.FixV("xyz", 0, "y", -0.0001, 0.0001);

// ========== 6. 接触定义 ==========
// 设置接触参数
blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(5e11, 5e11, 0.01, 0, 0);
blkdyn.SetIStiffByElem(10.0);

// ========== 7. 输出请求配置 ==========
// 设置监测点 (穿透深度与冲击力)
blkdyn.SetOutput("History", "Velocity", "X", "Y", "Z");
blkdyn.SetOutput("History", "Force", "X", "Y", "Z");

// ========== 8. 求解器控制参数 ==========
dyna.Set("Time_Step 5e-6");
dyna.Set("UnBalance_Ratio 1e-3");
dyna.Set("Elem_Kill_Option 1 0.8 0.8 1 3");

// ========== 9. 执行仿真计算 ==========
var totalTime = 0.02; // 总时长 20ms
blkdyn.DynaCycle(totalTime);

// ========== 10. 结果处理 ==========
// 提取穿透深度数据
var penetrationDepth = blkdyn.GetResult("Penetration_Depth");

// 提取冲击力数据
var impactForce = blkdyn.GetResult("Impact_Force");

// 输出结果摘要
console.log("仿真完成 - 穿透深度: " + penetrationDepth);
console.log("仿真完成 - 最大冲击力: " + Math.max(impactForce));
