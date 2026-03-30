setCurDir(getSrcDir());

// 初始化环境
igeo.clear();
imeshing.clear();
dyna.Clear();

// 创建二维砖块网格（参数化尺寸）
var gridSize = 10;
var gridWidth = 500;
var gridHeight = 500;
imeshing.genBrick2D("grid", gridSize, gridSize, gridWidth, gridHeight);

// 准备BMP图片用于颜色分组
// 注意：实际使用时需确保image.bmp文件存在于工作目录
var imageDivisions = 60; // 灰度分段数目，可根据图片复杂度调整
imeshing.setGroupByImage(imageDivisions, "image.bmp");

// 获取生成的网格数据到CDyna模块
blkdyn.GetMesh(imeshing);

// 验证分组结果（BitMapColor.txt会自动生成）
var bitmapFile = getSrcDir() + "/BitMapColor.txt";
if (file.exists(bitmapFile)) {
    print("BitMapColor.txt 文件已生成，像素映射正确");
} else {
    print("警告：BitMapColor.txt 未找到，请检查图片路径");
}

// 根据分组设置本构模型（示例：不同组使用不同材料）
// 组1-30: 线弹性模型
blkdyn.SetModel("linear", 1, 30);
// 组31-60: Drucker-Prager模型（模拟岩土材料）
blkdyn.SetModel("DP", 31, 60);

// 设置颗粒接触本构模型
pdyna.SetModel("linear");

// 配置输出监测变量
var outputConfig = {
    "elem": ["stress", "strain", "velocity"],
    "group": true
};

// 导出为PDyna格式供后续计算
imesh.exportPDyna(imeshing, "simulation.dat");

// 绘制分组结果可视化
dyna.Plot("Elem", "Group");

// 设置背景网格显示（可选）
mpm.DrawBackGrid(200, 200, 200);

// 提交计算任务
dyna.Submit();
