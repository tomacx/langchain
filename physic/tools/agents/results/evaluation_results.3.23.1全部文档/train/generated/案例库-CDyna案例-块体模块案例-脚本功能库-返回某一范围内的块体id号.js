setCurDir(getSrcDir());

// 初始化环境
dyna.Clear();

// 生成块体网格模型（10x10x50的立方体，单元尺寸50）
blkdyn.GenBrick3D(10, 10, 50, 50, 50, 50, 1);

// 设置材料参数：密度、弹性模量、泊松比、屈服强度等
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 30, 10);

// 设置模型为线弹性模型
blkdyn.SetModel("linear");

// 设置接触搜索方法（可选）
dyna.Set("Contact_Search_Method 2");

// 定义查询空间范围：x=[4,6], y=[4,6], z=0
var xMin = 4;
var xMax = 6;
var yMin = 4;
var yMax = 6;
var zMin = 0;
var zMax = 0;

// 搜索指定范围内的块体单元数量
var totalno = blkdyn.SearchElemInCell(xMin, xMax, yMin, yMax, zMin, zMax);

print("在指定范围内共找到 " + totalno + " 个块体单元。");

// 遍历并提取每个单元的ID
for(var i = 1; i <= totalno; i++) {
    var id = blkdyn.GetElemIdInCell(i);
    print("第" + i + "个单元ID: " + id);

    // 设置识别出的块体组号（用于后续结果监测）
    blkdyn.SetGroupByID(2, id, id);
}

// 输出指定范围内块体的总体积信息
dyna.Print("BlkVol", 1, totalno);

// 配置求解器输出设置：包含应力、应变等监测数据
dyna.Set("Output_Interval 500");
dyna.Set("Output_Stress 1");
dyna.Set("Output_Strain 1");

// 施加简单边界条件（固定底部）
blkdyn.FixV("xyz", 0, "y", -0.01, 0.001);

// 求解计算
dyna.Solve();

// 将当前计算步的结果推送至Genvi平台展示
dyna.PutStep();
