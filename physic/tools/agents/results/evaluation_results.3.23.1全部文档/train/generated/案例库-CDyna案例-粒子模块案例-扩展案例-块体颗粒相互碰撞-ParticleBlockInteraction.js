setCurDir(getSrcDir());

// ========== 1. 初始化仿真环境配置 ==========
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("Moniter_Iter 100");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 3e-3");
dyna.Set("Time_Step 5e-5");
dyna.Set("SaveFile_Out 1");

// ========== 2. 创建块体几何与材料属性 ==========
blkdyn.GenBrick3D(1, 1, 1, 5, 5, 5, 1);
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 1e8, 0.25, 3e4, 1e4, 35, 15);
blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(1e9, 1e9, 25.0, 0.0, 0.0);
blkdyn.SetLocalDamp(0.01);

// ========== 3. 创建颗粒几何与材料属性 ==========
var x = [0, 1];
var y = [-1.2, -0.2];
var z = [0, 1];
pdyna.CreateByCoord(1000, 2, 2, 0.1, 0.1, 0.005, x, y, z);

pdyna.SetModel("brittleMC");
pdyna.SetMat(2500, 1e8, 0.2, 0.0, 0.0, 20, 0.01, 0.00);

// ========== 4. 创建刚性面边界条件 ==========
var fCoord = new Array();
fCoord[0] = new Array(-2, -1.5, -2);
fCoord[1] = new Array(-2, -1.5, 3);
fCoord[2] = new Array(3, -1.5, 3);
fCoord[3] = new Array(3, -1.5, -2);
pdyna.CreatePlaneByCoord(fCoord);

// ========== 5. 配置颗粒-块体接触检测参数 ==========
dyna.Set("If_Cal_EE_Contact 1");
dyna.Set("If_Search_PBContact_Adavance 1");

// ========== 6. 设置监测请求记录碰撞力和位移数据 ==========
dyna.Monitor("block", "ydis", 200, 140, 0);
dyna.Monitor("particle", "ydis", 300, 50, 0);

// ========== 7. 执行接触检测建立初始接触对 ==========
pdyna.DetectPBContact();

// ========== 8. 应用材料参数随机化处理接触面属性变化 ==========
blkdyn.RandomizeIMat("kn", 0.8, 1.2);
blkdyn.RandomizeIMat("kt", 0.8, 1.2);
blkdyn.RandomizeIMat("friction", 0.9, 1.1);

// ========== 9. 运行仿真循环通过用户自定义命令执行接口 ==========
dyna.Solve(30000);

// ========== 10. 导出最终结果文件并验证输出完整性 ==========
pdyna.exportPDyna("result.dat");
