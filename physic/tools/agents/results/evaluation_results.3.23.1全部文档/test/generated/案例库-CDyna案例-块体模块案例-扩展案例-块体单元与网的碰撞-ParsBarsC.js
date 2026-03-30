setCurDir(getSrcDir());

// 初始化环境
dyna.Clear();
doc.clearResult();

// 设置输出参数
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 1e-3");
dyna.Set("SaveFile_Out 1");

// 打开杆件计算开关并设置耦合方式
dyna.Set("If_Cal_Bar 1");
dyna.Set("Bar_Couple_Type 2");

// 创建块体单元（模拟碰撞的块体）
blkdyn.GenBrick3D(1, 1, 1, 0.5, 0.5, 0.5, 1);
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置块体单元模型和材料参数
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 1e8, 0.25, 3e4, 1e4, 35, 15);

// 设定接触面本构为脆性断裂Mohr-Coulomb模型
blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(1e9, 1e9, 25.0, 0.0, 0.0);

// 设置块体局部阻尼
blkdyn.SetLocalDamp(0.01);

// 创建网结构杆件单元（模拟防护网）
var barCoord = new Array();
barCoord[0] = new Array(0, 0, 0);
barCoord[1] = new Array(2, 0, 0);
barCoord[2] = new Array(2, 2, 0);
barCoord[3] = new Array(0, 2, 0);

// 导入或创建杆件网格（模拟网结构）
bar.Import("gid", "cable", "net.msh");

// 定义杆件材料属性：[弹性模量, 密度, 泊松比, 屈服强度, 断裂应变]
var BarProp = [2e11, 7800.0, 0.3, 235e6, 0.05];

// 施加杆件性质（ID从1开始）
bar.SetPropByID(BarProp, 1, 10000000, 1, 15);

// 约束网结构边界节点速度
var types = new Array(true, true, true);
var values = new Array(0.0, 0.0, 0.0);
bar.FixVelByCoord(types, values, -0.001, 0.001, -1e5, 1e5, -1e5, 1e5);
bar.FixVelByCoord(types, values, 9.999, 11, -1e5, 1e5, -1e5, 1e5);

// 创建碰撞块体（随机分布）
var x = new Array(0, 3);
var y = new Array(0, 3);
var z = new Array(2, 4);
pdyna.CreateByCoord(100, 1, 2, 0.5, 0.5, 0.1, x, y, z);

// 设置颗粒模型为脆断模型
pdyna.SetModel("brittleMC");
pdyna.SetMat(2500, 3e7, 0.25, 1e4, 3e4, 25, 0.0, 0.05);

// 设置块体碰撞初速度边界条件
blkdyn.FixV("x", 10.0, "z", -1e5, 1e5);

// 设置动态计算时步
dyna.Set("Time_Step 8e-5");

// 监测关键节点的位移与接触力数据
dyna.Monitor("block", "ydis", 200, 140, 0);
dyna.Monitor("block", "xdis", 200, 140, 1);
dyna.Monitor("rdface", "rg_bxForce", 1, 10, 1);

// 监测杆件单元应变信息
var segValue = bar.GetSegValue(1, 1, "Strain");

// 提取块体系统全局结果变量
var kineticEnergy = dyna.Get("gv_block_kinetic_energy");
var strainEnergy = dyna.Get("gv_block_strain_energy");
var gravityEnergy = dyna.Get("gv_block_gravity_energy");
var crackRatio = dyna.Get("gv_block_crack_ratio");

// 执行核心求解函数
dyna.Solve(100000);

// 输出仿真结束后的监测数据及能量平衡报告
console.log("=== 仿真结果 ===");
console.log("块体总动能: " + kineticEnergy);
console.log("块体总应变能: " + strainEnergy);
console.log("块体重力势能: " + gravityEnergy);
console.log("块体破裂度: " + crackRatio);
console.log("杆件单元1-1应变: " + segValue);

// 导出结果文件
dyna.ExportResult();
