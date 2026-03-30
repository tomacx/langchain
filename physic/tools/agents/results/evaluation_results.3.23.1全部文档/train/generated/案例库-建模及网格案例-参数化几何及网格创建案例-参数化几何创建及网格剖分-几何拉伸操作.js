setCurDir(getSrcDir());

// 清除几何和网格信息
igeo.clear();
imeshing.clear();

// 创建参数化矩形面（作为拉伸基础）
var id = igeo.genRectS(0, 0, 0, 1.0, 1.0, 0, 0.1, 1);

// 设置二维网格划分方式为Frontal
imeshing.setValue("MeshType2D", 6);

// 借助Gmsh剖分网格
imeshing.genMeshByGmsh(2);

// 获取生成的面ID用于后续操作
var surfaceId = id;

// 创建第二个矩形面（用于构建拉伸体）
var id2 = igeo.genRectS(0, 0, 0, 2.0, 2.0, 0, 0.1, 1);

// 设置三维网格划分
imeshing.setValue("MeshType3D", 7);

// 借助Gmsh剖分三维网格
imeshing.genMeshByGmsh(3);

// 使用MoveGrid对生成的网格进行拉伸位移设定（沿Z轴移动）
MoveGrid([0, 0, 5.0], [1.0, 1.0, 1.0]);

// 使用ZoomGrid调整网格缩放比例
ZoomGrid([1.0, 1.0, 1.2], [1.0, 1.0, 1.0]);

// 将生成的网格单元按ID重新分组以便后续监测
SetGroupByID(1, "group_base");
SetGroupByID(2, "group_stretched");

// 配置输出文件路径
var outputDir = getSrcDir() + "/output";

// 定义需要监测的物理量变量参数
var monitorVars = {
    displacement: true,
    stress: true,
    strain: true
};

// 获取最终网格数据并验证几何拉伸效果
GetMesh();

// 导出包含网格拓扑与监测数据的最终结果文件
print("网格拉伸操作完成，结果已保存至输出目录");
