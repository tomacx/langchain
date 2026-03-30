setCurDir(getSrcDir());

// 1. 初始化脚本运行环境并清除当前选择集
igeo.clear();
imeshing.clear();
dyna.Clear();

// 2. 调用 skwave.DefMesh 函数定义计算域正交网格参数
// 创建二维计算域：100m×100m，每个方向分割50个点
skwave.DefMesh(2, [100.0, 100.0], [50, 50]);

// 3. 使用 sel.pick() 函数在界面选择需要重新分组的单元集合
sel.pick();

// 4. 准备 bmp 格式的图片文件并确保路径可访问
// 假设图片在当前工作目录下，名为"pattern.bmp"
var imageFile = "pattern.bmp";

// 5. 调用 mesh.SetGroupByImage 函数传入分段数目及图片路径进行分组
// 将灰度值分为60份进行分组
mesh.SetGroupByImage(60, imageFile);

// 6. 读取当前工作路径下的 BitMapColor.txt 文件验证像素灰度值记录
// 通过文件操作验证BitMapColor.txt已生成
var fso = new ActiveXObject("Scripting.FileSystemObject");
if (fso.FileExists("BitMapColor.txt")) {
    var bitmapFile = fso.OpenTextFile("BitMapColor.txt", 1);
    var lineCount = 0;
    while (!bitmapFile.AtEndOfStream) {
        bitmapFile.ReadLine();
        lineCount++;
    }
    bitmapFile.Close();
    print("BitMapColor.txt 包含 " + lineCount + " 行像素数据");
} else {
    print("警告：BitMapColor.txt 文件未生成");
}

// 7. 配置 mpm.SetModelByGroup 函数以设置不同颗粒组的本构模型
// 组号1-30设置为线弹性模型"linear"
mpm.SetModelByGroup("linear", 1, 30);
// 组号31-60设置为DP模型（离散颗粒）
mpm.SetModelByGroup("DP", 31, 60);

// 8. 调用 mpm.DrawBackGrid 函数在绘图区绘制背景网格以监测分组效果
// 使用红色背景网格(RGB: 255, 0, 0)
mpm.DrawBackGrid(255, 0, 0);

// 9. 导出当前网格分组结果及必要的监测数据至指定文件
imesh.exportPDyna(imeshing, "grouped_mesh.dat");

// 10. 提交所有更改并结束脚本执行流程
dyna.commit();
print("网格分组完成，模型已提交");
