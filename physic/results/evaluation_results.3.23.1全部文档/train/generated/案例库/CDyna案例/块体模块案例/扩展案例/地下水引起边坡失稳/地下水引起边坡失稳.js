// 设置当前路径为脚本所在目录
setCurDir(getSrcDir());

// 配置输出间隔和重力加速度等参数
dyna.Set("Output_Interval", 1000);
dyna.Set("Gravity", [0.0, -9.8, 0.0]);
dyna.Set("Contact_Detect_Tol", 5e-3);

// 导入网格数据
blkdyn.ImportGrid("gid", "blockmesh2.msh");
rdface.Import("gid", "bound.msh");

// 设置边界条件和材料属性
blkdyn.CrtBoundIFaceByCoord(-1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
blkdyn.UpdateIFaceMesh();
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 1e9, 0.25, 3e6, 1e6, 45, 15);

// 导入颗粒数据并设置其属性
pdyna.Import("gid", "parmesh2.msh");
pdyna.SetModel("linear");
pdyna.SetMat(2500, 1e8, 0.25, 1e4, 1e4, 20, 0.8);

// 设置计算参数
dyna.TimeStepCorrect(0.8);
blkdyn.SetLocalDamp(0.01);
pdyna.SetSingleMat("LocalDamp", 0.01);

// 开始模拟
dyna.Solve(30000); // 运行3万步
