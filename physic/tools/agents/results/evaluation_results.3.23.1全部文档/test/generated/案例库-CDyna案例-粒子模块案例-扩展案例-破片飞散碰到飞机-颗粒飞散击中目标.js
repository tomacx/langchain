setCurDir(getSrcDir());

// ========== 1. 全局仿真环境配置 ==========
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 2.0e-3");
dyna.Set("Output_Interval 500");
dyna.Set("Block_Soften_Value 0.2 0.2");
dyna.Set("If_Cal_Particle 0");

// ========== 2. 破片颗粒网格生成 ==========
// 创建不同尺寸的破片颗粒（直径范围：1mm - 50mm）
var x = new Array(-50.0, 50.0);
var y = new Array(0.0, 10.0);
var z = new Array(-50.0, 50.0);

// 大尺寸破片（直径20-50mm）
pdyna.CreateByCoord(100, 1, 2, 20.0, 20.0, 0, x, y, z);
pdyna.CreateByCoord(200, 2, 2, 30.0, 30.0, 0, x, y, z);
pdyna.CreateByCoord(300, 3, 2, 40.0, 40.0, 0, x, y, z);

// 小尺寸破片（直径5-15mm）
pdyna.CreateByCoord(500, 4, 2, 5.0, 5.0, 0, x, y, z);
pdyna.CreateByCoord(600, 5, 2, 8.0, 8.0, 0, x, y, z);
pdyna.CreateByCoord(700, 6, 2, 10.0, 10.0, 0, x, y, z);

// 导出颗粒网格数据
pdyna.exportPDyna("shrapnel.dat");

// ========== 3. 飞机靶板结构定义 ==========
// 创建可穿透环形靶板（模拟飞机机身截面）
// 参数：中心坐标(0,0,0)，半径15m，角度范围±45°，高度范围-2m到2m
pfly.CrtPeneHeightTarget(0.0, 0.0, 0.0, 15.0, 90, -2.0, 2.0);

// ========== 4. 破片材料属性设置 ==========
// 破片材料参数：密度、杨氏模量、泊松比、粘聚力、抗拉强度、摩擦系数等
pdyna.SetMat(100, 2e11, 0.3, 50e6, 50e6, 0.5, 0.0);

// ========== 5. 监测变量初始化 ==========
// 设置速度衰减和冲击能量监测点
for(var i = -4; i <= 4; i++) {
    dyna.Monitor("particle", "vel", i * 1.0, 0.0, 0.0);
}

// ========== 6. 计算参数配置 ==========
blkdyn.SetLocalDamp(0.0);
dyna.Set("Time_Step 5e-8");
pdyna.SetModel("none");

// ========== 7. 执行求解 ==========
dyna.Solve(10000);

// ========== 8. 保存计算结果 ==========
dyna.Save("shrapnel_blast.sav");

// ========== 9. 输出靶板穿透统计信息 ==========
pfly.ExportPeneTargetInfo(0.0, 0.0, 0.0, 1);

// ========== 10. 释放资源 ==========
dyna.FreeUDF();
