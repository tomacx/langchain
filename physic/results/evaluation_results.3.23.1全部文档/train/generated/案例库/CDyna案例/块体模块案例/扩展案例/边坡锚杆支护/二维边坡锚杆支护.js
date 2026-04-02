setCurDir(getSrcDir());

// 定义坡高数组
var SlopeH = [10.0, 15.0, 20.0, 25.0, 30.0];

// 定义坡角数组
var Sita    = [45.0, 45.0, 45.0, 45.0, 45.0];

// 初始化安全系数值数组
var Fos     = new Array(5);

// 左侧平台长度比例
var LeftLRatio = 1.0;

// 右侧平台长度比例
var RightLRatio = 2.0;

// 坡体底部厚度比例
var BaseHRatio = 1.5;

// 斜坡段附近网格尺寸
var size1 = 1.5;

// 其他部分网格尺寸
var size2 = 4;

for (var i = 0; i < 5; i++) {
    // 清除几何、网格和计算模块数据
    igeo.clear();
    imeshing.clear();
    dyna.Clear();
    doc.clearResult();

    // 计算坡长和其他参数
    var SlopeL = SlopeH[i] / Math.tan(Sita[i] / 180.0 * Math.PI);
    var LeftL  = LeftLRatio * SlopeL;
    var RightL = RightLRatio * SlopeL;
    var BaseH  = BaseHRatio * SlopeH[i];
    var TotalL = LeftL + SlopeL + RightL;
    var TotalH = BaseH + SlopeH[i];

    // 定义多边形坐标
    var aCoord = new Array(6);
    aCoord[0] = [0, 0, 0, size2];
    aCoord[1] = [TotalL, 0, 0, size2];
    aCoord[2] = [TotalL, TotalH, 0, size2];
    aCoord[3] = [LeftL + SlopeL, TotalH, 0, size1];
    aCoord[4] = [LeftL, BaseH, 0, size1];
    aCoord[5] = [0, BaseH, 0, size2];

    // 创建多边形边坡
    igeo.genPloygenS(aCoord, 1);

    // 划分网格
    imeshing.genMeshByGmsh(2);

    // 设置不平衡率
    dyna.Set("UnBalance_Ratio 1e-4");

    // 获取网格数据
    blkdyn.GetMesh(imeshing);

    // 设置计算本构模型
    blkdyn.SetModel("linear");

    // 设置材料参数
    blkdyn.SetMat(2000, 3e9, 0.3, 1e5, 1e5, 25, 15);

    // 对底部和两侧进行约束
    blkdyn.FixV("y", 0.0, "y", -0.01, 0.01);
    blkdyn.FixV("x", 0.0, "x", -0.01, 0.01);
    blkdyn.FixV("x", 0.0, "x", TotalL-0.01, TotalL+0.01);

    // 设置局部阻尼
    blkdyn.SetLocalDamp(0.8);

    // 监测典型测点的竖向应力
    dyna.Monitor("block", "syy", LeftL + SlopeL / 2, BaseH + SlopeH[i] / 2, 0);

    // 求解
    dyna.Solve();

    // 计算安全系数并存储到数组中
    var displacement = blkdyn.GetDisplacement(LeftL + SlopeL / 2, BaseH + SlopeH[i] / 2, 0)[0];
    Fos[i] = (SlopeH[i] * Math.tan(Sita[i] / 180.0 * Math.PI)) / displacement;
}

// 输出安全系数数组
console.log(Fos);
