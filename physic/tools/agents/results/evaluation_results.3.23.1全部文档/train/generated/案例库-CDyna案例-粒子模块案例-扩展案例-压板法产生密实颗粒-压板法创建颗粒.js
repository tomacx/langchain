setCurDir(getSrcDir());

// 初始化全局参数
dyna.Set("Gravity 0.0 0.0 -9.8");
dyna.Set("Output_Interval 500");
dyna.Set("Contact_Detect_Tol 0.001");
dyna.Set("Time_Step 1e-4");

// 创建下压板（刚性面）
var bottomCoord = [
    [0, 0, 0],
    [0.5, 0, 0],
    [0.5, 0.5, 0],
    [0, 0.5, 0]
];
rdface.Create(1, 1, 2, bottomCoord);

// 创建上压板（刚性面）
var topCoord = [
    [0, 0, 0.5],
    [0.5, 0, 0.5],
    [0.5, 0.5, 0.5],
    [0, 0.5, 0.5]
];
rdface.Create(2, 1, 2, topCoord);

// 在上下压板之间随机生成颗粒体系
var xRange = [0, 0.5];
var yRange = [0, 0.5];
var zRange = [0, 0.4];
pdyna.CreateByCoord(10000, 1, 1, 0.002, 0.02, 0, xRange, yRange, zRange);

// 设置颗粒材料模型为脆性断裂模型
pdyna.SetModel("brittleMC");

// 设置颗粒材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数
pdyna.SetMat(2500, 1e7, 0.25, 0.1, 0.0, 30, 0.01, 0.1);

// 设置上压板向下运动速度（产生密实效果）
var compactVelocity = -0.01;
rdface.ApplyVelocityByGroup([0, compactVelocity, 0], 2, 2);

// 设置下压板固定（不施加速度）
rdface.ApplyVelocityByGroup([0, 0, 0], 1, 1);

// 启用监测功能记录密度、损伤等指标
dyna.Set("Monitor_Density 1");
dyna.Set("Monitor_Damage 1");
dyna.Set("Monitor_Fracture 1");

// 求解计算（迭代足够步数使颗粒密实）
dyna.Solve(5000);

// 释放动态链接库清理内存资源
dyna.FreeUDF();
