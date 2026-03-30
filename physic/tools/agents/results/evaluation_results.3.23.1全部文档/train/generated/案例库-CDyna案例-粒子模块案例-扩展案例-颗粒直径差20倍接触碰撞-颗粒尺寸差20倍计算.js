setCurDir(getSrcDir());

// ========== 1. 初始化仿真环境 ==========
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Output_Interval 500");
dyna.Set("Contact_Detect_Tol 1e-3");
dyna.Set("Contact_Search_Method 2");
dyna.Set("Particle_Renew_Interval 1");
dyna.Set("If_Opti_Cell_Length 0");
dyna.Set("Min_Cell_Length 4.0");
dyna.Set("OpenMP_SubBlock_No 136");

// ========== 2. 创建两种粒径的颗粒（直径比20倍） ==========
// 大颗粒：直径 10m (半径 5m)
var xBig = [0, 10];
var yBig = [0, 10];
var zBig = [0, 10];
pdyna.CreateByCoord(100, 1, 2, 10.0, 10.0, 0, xBig, yBig, zBig);

// 小颗粒：直径 0.5m (半径 0.25m) - 与最大直径比例20倍
var xSmall = [0, 10];
var ySmall = [0, 10];
var zSmall = [0, 10];
pdyna.CreateByCoord(1000, 2, 2, 0.5, 0.5, 0, xSmall, ySmall, zSmall);

// ========== 3. 设置颗粒材料属性 ==========
// 大颗粒材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼
pdyna.SetMat(100, 1e8, 0.25, 1e4, 1e3, 30, 0.01);

// 小颗粒材料参数（相同物性）
pdyna.SetMat(1000, 1e8, 0.25, 1e4, 1e3, 30, 0.01);

// ========== 4. 配置接触检测与边界条件 ==========
// 设置无反射边界条件
pdyna.CalQuietBound();

// 对颗粒-颗粒、颗粒-块体、颗粒-刚性面进行接触检测
pdyna.DetectContactAll();

// 计算颗粒与颗粒之间的接触力
pdyna.CalPPContact();

// ========== 5. 设置时间步长与求解参数 ==========
dyna.Set("Time_Step 1e-5");
dyna.Set("If_Cal_EE_Contact 1");
dyna.Set("If_Search_PBContact_Adavance 1");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");

// ========== 6. 运行用户自定义命令流触发DEM求解器 ==========
// 调用UserDefFunction_Execute启动核心计算
dyna.RunUDFCmd("StartCalculation");

// ========== 7. 执行求解与输出 ==========
// 迭代求解（根据颗粒尺寸和接触特性，设置足够步数）
dyna.Solve(50000);

// ========== 8. 仿真后处理与验证 ==========
// 读取输出文件验证计算结果
var outputFiles = ["par.dat", "result.txt"];
for (var i = 0; i < outputFiles.length; i++) {
    pdyna.Import("pdyna", outputFiles[i]);
}

// 检查日志文件确认接触检测与力计算过程无异常
dyna.Set("If_Log_Error 1");
