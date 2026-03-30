setCurDir(getSrcDir());

// 清除所有模块数据
dyna.Clear();
doc.clearResult();

// 初始化计算环境
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 100");
dyna.Set("Monitor_Iter 10");
dyna.Set("SaveFile_Out 1");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 0.0");

// 导入墙体网格（假设已有ANSYS格式网格文件）
var msh = imesh.importAnsys("bricks.dat");
blkdyn.GetMesh(msh);

// 创建接触面
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置块体单元本构模型为线弹性
blkdyn.SetModel("linear");

// 设置砌体材料参数（密度、弹性模量、泊松比、屈服强度等）
blkdyn.SetMat(2500, 3e10, 0.25, 6e6, 5e6, 35, 15);

// 设置接触面本构模型为SSMC（脆性断裂）
blkdyn.SetIModel("SSMC");

// 接触面刚度从单元自动获取
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();

// 设置局部阻尼
blkdyn.SetLocalDamp(0.01);

// 固定墙体底部边界条件
blkdyn.FixV("xyz", 0.0, "y", -1e-2, 1e-2);
blkdyn.FixV("xyz", 0.0, "y", 2.01, 2.02);
blkdyn.FixV("xyz", 0.0, "x", -1e-2, 1e-2);
blkdyn.FixV("xyz", 0.0, "x", 2.27, 2.29);

// 定义冲击波网格（3D）
skwave.DefMesh(3, [3, 3, 2], [50, 60, 50], [-0.2, -0.5, -1]);

// 继承固体边界条件
skwave.InheritSolid();

// 设置冲击波作用区域（墙体前方空气域）
skwave.SetSolid(1, -5, 5, -5, 0.2, -5, 5);

// 初始化球形冲击波源（起爆点、质量、声速等）
skwave.InitBySphere(1.01e5, 1.02, [0, 0, 0], [0, 0, 0], 1000.0);

// 初始化第二个冲击波源（模拟爆炸冲击波传播）
skwave.InitBySphere(1e9, 1000, [0, 0, 0], [1.14, 1.0, 0.5], 0.3);

// 设置空气材料参数
dyna.Set("AirMat Air");

// 设置时间步长
dyna.Set("Time_Step 2e-6");

// 执行求解（总时长0.1秒）
dyna.DynaCycle(0.1);

// 设置监测变量记录压力时空演化
dyna.Monitor("skwave", "sw_pp", 1, 5, 0);
dyna.Monitor("skwave", "sw_pp", 2, 5, 0);
dyna.Monitor("skwave", "sw_pp", 3, 5, 0);

// 设置监测变量记录位移数据
dyna.Monitor("block", "ydis", 0.64, 1.007, 0);
dyna.Monitor("block", "ydis", 1.14, 2.0, 0);

// 打印全局材料参数信息
dyna.Print("AirMat");
dyna.Print("JWLMat");

print("求解完毕");
