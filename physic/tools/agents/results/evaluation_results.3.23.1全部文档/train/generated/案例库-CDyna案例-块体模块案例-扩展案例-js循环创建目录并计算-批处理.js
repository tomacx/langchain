setCurDir(getSrcDir());

var fso = new ActiveXObject("Scripting.FileSystemObject");
var CurDir = getSrcDir();
var TotalCases = 10;

for(var i = 0; i < TotalCases; i++)
{
    var NewDir = CurDir + "\\Case" + (i + 1);
    var a = fso.CreateFolder(NewDir);

    setCurDir(NewDir);

    // 清空几何、网格、求解器及结果文档中的残留数据
    igeo.clear();
    imeshing.clear();
    dyna.Clear();
    doc.clearResult();

    // 设置重力加速度
    dyna.Set("Gravity 0.0 -9.8 0.0");

    // 创建三维方块网格模型
    blkdyn.GenBrick3D(10, 10, 10, 20, (i + 1) * 4, 20, 1);

    // 设置单元模型为线弹性模型
    blkdyn.SetModel("linear");

    // 设置材料参数：密度、弹性模量、泊松比、抗拉强度、抗压强度、内摩擦角、粘性阻尼系数
    blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, (i + 1) * 5, 15);

    // 固定底部边界条件
    blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);

    // 设置Y方向的监测点
    dyna.Monitor("block", "ydis", 5.0, (i + 1) * 4, 5.0);
    dyna.Monitor("block", "ydis", 5.0, 6.0, 5.0);
    dyna.Monitor("block", "ydis", 5.0, 2.0, 5.0);

    // 设置输出间隔
    dyna.Set("Output_Interval 500");

    // 计算前初始化
    dyna.BeforeCal();

    // 执行求解
    dyna.Solve(10000);

    // 输出监测数据
    dyna.OutputMonitorData();
}

// 清理临时文件（可选）
print("批处理完成，所有案例计算结束。");
