// 定义三维计算域网格
skwave.DefMesh(3, [100.0, 50.0, 20.0], [10.0, 5.0, 2.0]);

// 导入边界网格文件
var msh1 = imesh.importGid("top.msh");
var msh2 = imesh.importGid("middle.msh");
var msh3 = imesh.importGid("bottom.msh");

// 添加边界
pargen.addBound(msh1, msh2, msh3);

// 设置优化位置选项
pargen.setValue("OptiPosOption", 1);

// 填充半径为1m的粒子
var parmsh = pargen.gen(1.0);

// 创建滑坡模型颗粒接触高级脚本
function createSlidingParticles() {
    // 定义几何边界条件
    var boundaryConditions = [
        { type: "top", mesh: msh1 },
        { type: "middle", mesh: msh2 },
        { type: "bottom", mesh: msh3 }
    ];

    // 遍历每个边界并生成颗粒
    for (var i = 0; i < boundaryConditions.length; i++) {
        var condition = boundaryConditions[i];
        pargen.addBound(condition.mesh);
        pargen.gen(1.0); // 半径为1m的粒子
    }
}

// 调用创建滑坡模型颗粒函数
createSlidingParticles();

// 设置物理参数，如重力、摩擦系数等
pargen.setValue("Gravity", [0, -9.81, 0]);
pargen.setValue("FrictionCoefficient", 0.5);

// 定义输出文件名
var outputFileName = "sliding_particles";

// 输出生成的颗粒模型到文件
pargen.export(outputFileName);
