setCurDir(getSrcDir());

// ==================== 1. 初始化求解器环境 ====================
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Output_Interval 5000");
dyna.Set("Monitor_Iter 100");
dyna.Set("Contact_Detect_Tol 5.0e-3");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.5");

// ==================== 2. 构建起爆点坐标数组 ====================
var pos = new Array(3);
pos[0] = [10, 8, 45];   // 炮孔1位置
pos[1] = [15, 8, 45];   // 炮孔2位置
pos[2] = [20, 8, 45];   // 炮孔3位置

// ==================== 3. 配置JWL爆源气体逸散特征参数 ====================
// 特征时间tc=5e-4s，特征指数n=1.2，爆源ID范围1-10
blkdyn.SetJWLGasLeakMat(5e-4, 1.2, 1, 10);

// ==================== 4. 绑定JWL爆源到模型单元 ====================
// 假设爆源单元ID范围为1-10，绑定到对应单元
blkdyn.BindJWLSource(1, 10);

// ==================== 5. 设置监测点获取位移数据 ====================
// 监测边坡关键节点在X方向的位移（坐标点附近）
dyna.Monitor("block", "xdis", 10.0, 8.0, 45.0);
// 监测Y方向位移
dyna.Monitor("block", "ydis", 10.0, 8.0, 45.0);
// 监测Z方向位移
dyna.Monitor("block", "zdis", 10.0, 8.0, 45.0);

// ==================== 6. 配置块体损伤监测指标 ====================
// 总破坏度 gv_block_broken_ratio
dyna.Monitor("gvalue", "gv_block_broken_ratio");
// 破裂度 gv_block_crack_ratio
dyna.Monitor("gvalue", "gv_block_crack_ratio");
// 等效破裂体积 gv_block_equiv_frac_volume
dyna.Monitor("gvalue", "gv_block_equiv_frac_volume");

// ==================== 7. 设定仿真时间参数 ====================
// 时间步长dt=1e-6s，总运行时间t_end=0.5s
dyna.Set("Time_Step 1e-6");
dyna.Set("Total_Time 0.5");

// ==================== 8. 启动求解器执行动力学计算 ====================
blkdyn.Solve();

// ==================== 9. 导出结果文件 ====================
doc.ExportResult("slope_blast_result.dat");
