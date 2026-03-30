setCurDir(getSrcDir());

// ==================== 1. 初始化仿真环境 ====================
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Contact_Detect_Tol 5e-3");

// ==================== 2. 创建底部刚性面（结构面） ====================
var fCoord = new Array();
fCoord[0] = new Array(-10.0, -2.0, 0.0);
fCoord[1] = new Array(10.0, -2.0, 0.0);
rdface.Create(1, 1, 2, fCoord);

fCoord[0] = new Array(-10.0, -2.0, 0.0);
fCoord[1] = new Array(-10.0, 12.0, 0.0);
rdface.Create(1, 1, 2, fCoord);

fCoord[0] = new Array(10.0, -2.0, 0.0);
fCoord[1] = new Array(10.0, 12.0, 0.0);
rdface.Create(1, 1, 2, fCoord);

// ==================== 3. 导入颗粒体系 ====================
pdyna.Import("gid", "ParJoint.msh");

// ==================== 4. 设置接触模型与材料参数 ====================
// 设置颗粒接触模型为考虑应变软化的Mohr-Coulomb模型
pdyna.SetModel("SSMC");

// 设置颗粒的材料参数（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数）
pdyna.SetMat(2500, 1e8, 0.25, 1e7, 1e7, 30, 0.0, 0.1);

// ==================== 5. 设置结构面接触属性 ====================
// 设置结构面（刚性面）的接触材料参数
for(var i = 0; i < 50; i++) {
    pdyna.SetICMatByLine(1e9, 1e9, 0, 0, 0, [-20 + i * 3, -20, 0], [-10 + i * 3, 20, 0]);
    pdyna.SetICMatByLine(1e9, 1e9, 0, 0, 0, [-10 + i * 3, -20, 0], [-40 + i * 3, 20, 0]);
}

// ==================== 6. 配置接触破坏类型与初始重叠量 ====================
// 设置颗粒接触破坏类型为剪切破坏（FailType=2）
pdyna.Set("Contact_FailType 2");

// 设置初始接触重叠量（IniOverlap）
pdyna.Set("IniOverlap 0.01");

// ==================== 7. 启用监测功能 ====================
// 设置输出包含拉伸剪切破裂数及损伤量统计
dyna.Set("Output_Include_FailStat 1");

// ==================== 8. 求解设置 ====================
dyna.Set("Time_Step 1e-4");
dyna.Set("Contact_Detect_Tol 0.0");

// ==================== 9. 执行求解计算 ====================
dyna.Solve(30000);

// ==================== 10. 结果输出与检查 ====================
print("仿真计算完成，结果已保存至输出目录");
print("可读取*.sav文件进行重启动或结果提取");
