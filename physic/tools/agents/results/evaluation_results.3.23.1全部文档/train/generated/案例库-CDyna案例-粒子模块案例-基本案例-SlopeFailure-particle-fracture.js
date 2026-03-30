setCurDir(getSrcDir());

// 清除内存数据（可选）
// dyna.Clear();
// doc.ClearResult();

// 设置结果输出间隔
dyna.Set("Output_Interval 500");

// 打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置接触容差
dyna.Set("Contact_Detect_Tol 1e-1");

// 设置求解不平衡率
dyna.Set("UnBalance_Ratio 5e-4");

// 加载自定义动态链接库以启用颗粒接触面二次开发本构计算功能
dyna.LoadUDF("CustomModel");

// 导入颗粒数据（示例：从文件导入）
pdyna.Import("gid", "slope-particle.msh");

// 设置颗粒接触模型为线弹性模量
pdyna.SetModel("linear");

// 设置组1的材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数
pdyna.SetMat(2500, 1e10, 0.25, 1e6, 1e6, 35, 0.8, 0.0);

// 设置组2的材料参数（节理带或软弱面）
pdyna.SetMat(2500, 1e9, 0.25, 1e4, 1e4, 10, 0.8, 0.0);

// 设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

// 设置随机节理模型（SMRM）的材料参数
// 第一组结构面：倾向、倾角、节理密度、半径、粘聚力、摩擦角
var aProp = new Array(3);
aProp[0] = [45, 60, 1e5, 0.5, 1e5, 25];
aProp[1] = [135, 60, 1e5, 0.5, 1e5, 25];
aProp[2] = [0, 90, 1e4, 0.3, 1e4, 15];

// 为所有节理组设置参数
blkdyn.SetSJRockMat(3, aProp);

// 设置接触面本构模型为 Custom 以激活自定义断裂逻辑
blkdyn.SetIModel("Custom");

// 设置当前失效模式为剪坏模式
CurrentFailureFlag = 2;

// 定义节理脆断模型的输入参数阈值（通过UDFValue设置）
dyna.SetUDFValue(1.0, 0.5, 0.3); // 示例：设置断裂阈值参数

// 模型左右两侧及底部法向约束
blkdyn.FixV("xyz", 0.0, "x", -2, 3.0);
blkdyn.FixV("xyz", 0.0, "x", 117, 121);
blkdyn.FixV("xyz", 0.0, "y", -3, 3);

// 设置动态边界施加
blkdyn.SetQuietBoundByCoord(-0.001, 0.001, -100, 100, -100, 100);

// 配置核心求解器参数
dyna.Set("CalDynaBound 1"); // 动态边界施加
dyna.Set("CalIntSolid 1");  // 固体破裂耦合计算步长

// 设置计算时步
dyna.Set("Time_Step 5e-3");

// 设置迭代步数（根据边坡规模调整）
dyna.Solve(50000);

// 监测典型颗粒的水平位移
dyna.Monitor("particle", "pa_xdis", 32.3547, 65.9723, 0);
dyna.Monitor("particle", "pa_xdis", 39.0829, 52.8447, 0);
dyna.Monitor("particle", "pa_xdis", 42.4554, 44.3844, 0);
dyna.Monitor("particle", "pa_xdis", 52.9724, 23.6007, 0);
dyna.Monitor("particle", "pa_xdis", 60.3594, 12.3325, 0);

// 设置裂隙渗流节点信息的值（可选）
// SetNodeValue(nodeID, pressure);
// SetElemValue(elemID, flowRate);

// 运行用户自定义命令流，触发 UserDefFunction_Execute 进行断裂演化计算
dyna.RunUDFCmd("SlopeFailure_Init");

// 存储结果文件
dyna.Save("slope_failure_result.sav");

// 输出监测数据
dyna.OutputMonitor();
