setCurDir(getSrcDir());

// 设置计算参数
dyna.Set("Mechanic_Cal", 1);
dyna.Set("Gravity", 0, -9.8, 0);
dyna.Set("Large_Displace", 1);
dyna.Set("Output_Interval", 500);
dyna.Set("Moniter_Iter", 100);
dyna.Set("If_Virtural_Mass", 0);
dyna.Set("If_Renew_Contact", 1);
dyna.Set("Renew_Interval", 100);
dyna.Set("Contact_Detect_Tol", 1e-3);
dyna.Set("SaveFile_Out", 1);

// 导入网格文件
blkdyn.ImportGrid("patran", "cdem.out");

// 设置单元组号
var x = new Array(-1e10, 1e10);
var y = new Array(-1e10, 19.0);
var z = new Array(-1e10, 1e10);
blkdyn.SetGroupByCoord(2, x[0], x[1], y[0], y[1], z[0], z[1]);

// 创建接触面
blkdyn.CrtIFace(1);
blkdyn.CrtBoundIFaceByGroup(2);

// 更新接触面网格
blkdyn.UpdateIFaceMesh();

// 设置材料参数
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 1e9, 0.3, 6e4, 3e4, 25.0, 10.0, 1, 100);
blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(1e10, 1e10, 25.0, 0.0, 0.0);

// 固定节点速度
blkdyn.FixV("xy", 0.0, "y", -1e10, 19.01);
blkdyn.SetLocalDamp(0.01);

// 监测位移
dyna.Monitor("block", "ydis", 200, 140, 0);
dyna.Monitor("block", "ydis", 300, 150, 0);
dyna.Monitor("block", "ydis", 400, 160, 0);

// 求解
dyna.Solve(100000);
