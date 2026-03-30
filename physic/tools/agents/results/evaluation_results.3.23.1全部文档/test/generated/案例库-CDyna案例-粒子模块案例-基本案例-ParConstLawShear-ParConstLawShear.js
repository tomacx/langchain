setCurDir(getSrcDir());

// 初始化仿真环境
dyna.Clear();
doc.clearResult();

// 设置基本参数
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Gravity 0.0 0.0 -9.8");
dyna.Set("Contact_Detect_Tol 1e-3");
dyna.Set("Time_Step 5e-4");

// 修正颗粒形状（棱形体，默认）
pfly.FragShapeCorrect(5.0, 3.0, 1.0, 4);

// 创建剪切盒域内的初始颗粒装配
var boxSize = [2.0, 1.0, 0.5];
var particleSize = 0.02;
var numParticles = 100;

pdyna.RegularCreateByCoord(1, 2, particleSize, particleSize,
    boxSize[0], boxSize[1], boxSize[2], numParticles);

// 设置颗粒接触模型为脆性断裂模型
pdyna.SetModel("brittleMC");

// 设置颗粒材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼
pdyna.SetMat(2500, 1e8, 0.25, 0.0, 0.0, 30, 0.0, 0.1);

// 定义剪切盒边界坐标
var coordTop = new Array([0, 0, boxSize[2]], [boxSize[0], 0, boxSize[2]]);
var coordBottom = new Array([0, 0, 0], [boxSize[0], 0, 0]);

// 创建顶部剪切板（刚性面）
rdface.Create(1, 1, 2, coordTop);

// 创建底部约束面（刚性面）
var coordBottomFull = new Array([0, 0, 0], [boxSize[0], boxSize[1], 0]);
rdface.Create(1, 2, 2, coordBottomFull);

// 设置顶部剪切板位移边界条件
var topVel = 1e-4;
rdface.ApplyVelocityByGroup([topVel, 0, 0], 1, 1);

// 设置底部约束（固定）
rdface.ApplyVelocityByGroup([0, 0, 0], 2, 2);

// 定义剪切面线段，设置接触面材料属性
var shearCoord1 = new Array(0.5, 0, 0);
var shearCoord2 = new Array(0.5, boxSize[1], 0);
blkdyn.SetIMatByLine(1e9, 1e9, 30, 1e6, 1e5, shearCoord1, shearCoord2, 1e-3);

// 设置颗粒与刚性面接触模型为全局参数
dyna.Set("If_Contact_Use_GlobMat 1 2 1e9 1e9 0.0 0.0 0.0");

// 设置监测变量：位移、力、应力
var monitorCoord = new Array(1.0, 0.5, boxSize[2]/2);
dyna.Set("Monitor_Points 1 " + monitorCoord[0] + " " + monitorCoord[1] + " " + monitorCoord[2]);

// 搜索特定网格单元内的颗粒（监测区域）
var cellMin = new Array(0.8, 0.3, boxSize[2]/2 - 0.1);
var cellMax = new Array(1.2, 0.7, boxSize[2]/2 + 0.1);
var totalParInCell = pdyna.SearchParInCell(cellMin[0], cellMin[1], cellMin[2],
    cellMax[0], cellMax[1], cellMax[2]);

// 获取监测区域内的颗粒ID
if (totalParInCell > 0) {
    for (var i = 1; i <= totalParInCell; i++) {
        var parId = pdyna.GetParIdInCell(i);
        // print(parId, " particle in monitored cell.");
    }
}

// 执行求解迭代循环
dyna.Solve(5000);

// 后处理，输出必要结果
pdyna.PostProcess();
