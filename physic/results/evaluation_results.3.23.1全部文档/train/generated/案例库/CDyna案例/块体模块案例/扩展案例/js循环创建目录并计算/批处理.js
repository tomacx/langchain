// 设置当前目录为脚本所在目录
SetCurDir(GetSrcDir());

var CurDir = GetSrcDir();
var fso = new ActiveXObject("Scripting.FileSystemObject");

// 创建10个文件夹，每个文件夹执行一个计算案例
for(var i = 0; i < 10; i++) {
    var NewDir = CurDir + "\\Case" + (i + 1);
    fso.CreateFolder(NewDir);

    // 设置当前目录为新创建的文件夹
    setCurDir(NewDir);

    // 清除之前的计算结果和设置
    igeo.clear();
    imeshing.clear();
    dyna.Clear();
    doc.clearResult();

    // 设置输出间隔
    dyna.Set("Output_Interval 500");

    // 生成二维砖块模型，尺寸根据循环变量变化
    blkdyn.GenBrick2D(5, (i + 1), 20, (i+1) * 4, 1);

    // 设置线性弹性材料模型和材料参数
    blkdyn.SetModel("linear");
    blkdyn.SetMat(2500,3e10,0.25, 3e6,1e6, 35, 15);

    // 固定边界条件
    blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);

    // 设置重力加速度
    dyna.Set("Gravity 0.0 0.0 -9.8");

    // 开始计算
    dyna.Solve();

    // 返回原始目录，以便创建下一个文件夹
    setCurDir(CurDir);
}
