// 示例脚本用于演示如何调用API和设置参数

setCurDir(getSrcDir());

// 清除之前的几何、网格、计算数据等信息
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 创建一个圆盘模型
var id1 = igeo.genCircle(0, 0, 0, 1, 0.05);
var id2 = igeo.genCircle(0, 0, 0, 0.2, 0.02);

var id = igeo.genSurface([id1, id2], 1);

// 使用Gmsh生成网格
imeshing.genMeshByGmsh(2);

// 设置计算参数
dyna.Set("If_Virtural_Mass", 0);
dyna.Set("Large_Displace", 1);
dyna.Set("If_Renew_Contact", 1);
dyna.Set("Interface_Soften_Value", "1e-3 1e-3");
dyna.Set("Output_Interval", 500);

// 导入网格
blkdyn.ImportGrid("gmsh", "GDEM.msh");

// 创建接触面并更新网格
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置材料模型和参数
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 3e10, 0.25, 1e7, 1e7, 35, 15);

// 设置接触面模型及刚度
blkdyn.SetIModel("SSMC");
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();

// 设置局部阻尼系数
blkdyn.SetLocalDamp(0.01);

// 时间步长校正
dyna.TimeStepCorrect(0.5);

// 施加边界条件，例如圆盘内压
blkdyn.ApplyConditionByCylinder("face_force", [0, 0, -1e8], [0, 0, 0, 0, 0, 0, 0, 0, 0], 0, 0, -1, 0, 0, 1, 0.19, 0.21, true);

// 开始计算
dyna.Solve(3000);

// 输出结果，例如破裂块度信息
blkdyn.ExportGradationCurveByGroup(1, 1);
