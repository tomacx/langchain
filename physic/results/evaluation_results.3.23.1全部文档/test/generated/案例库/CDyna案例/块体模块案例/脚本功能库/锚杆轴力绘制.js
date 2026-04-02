// 示例脚本用于演示如何调用dyna.Set和dyna.Print接口，并打印特定材料参数

// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal", 1);

// 设置不平衡率为1e-5
dyna.Set("UnBalance_Ratio", 1e-5);

// 设置3个方向的重力加速度均为0.0
dyna.Set("Gravity", 0, 0.0, 0);

// 关闭大变形计算开关
dyna.Set("Large_Displace", 0);

// 打开虚拟质量计算开关
dyna.Set("If_Virtural_Mass", 1);

// 设置虚拟时步为0.5
dyna.Set("Virtural_Step", 0.5);

// 导入网格文件（假设已经存在）
blkdyn.ImportGrid("gmsh", "example.msh");

// 创建接触面
blkdyn.CrtIFace();

// 更新接触面网格信息
blkdyn.UpdateIFaceMesh();

// 设置实体单元为线弹性模型
blkdyn.SetModel("linear");

// 设置固体单元的材料参数，例如：密度、弹性模量、泊松比等
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e6, 1e6, 30.0, 10.0, 1);

// 打印特定材料参数，例如：打印材料序号为1的JWL炸药参数
dyna.Print("Landau", 1);
