setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 创建几何模型
var id1 = igeo.genCircle(0, 0, 0, 1, 0.05);
var id2 = igeo.genCircle(0, 0, 0, 0.2, 0.02);

var id = igeo.genSurface([id1, id2], 1);

// 网格划分
imeshing.genMeshByGmsh(2);

// 设置计算参数
dyna.Set("If_Virtural_Mass", 0);
dyna.Set("Large_Displace", 1);
dyna.Set("If_Renew_Contact", 1);
dyna.Set("Interface_Soften_Value", "1e-3 1e-3");
dyna.Set("Output_Interval", 500);

// 导入网格
blkdyn.ImportGrid("gmsh", "GDEM.msh");

// 创建接触面并更新
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置实体单元模型和材料参数
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 3e10, 0.25, 1e7, 1e7, 35, 15);

// 设置接触面模型及强度参数
blkdyn.SetIModel("SSMC");
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();

// 局部阻尼设置
blkdyn.SetLocalDamp(0.01);

// 时间步长校正
dyna.TimeStepCorrect(0.5);

// 施加内压载荷
blkdyn.ApplyConditionByCylinder("face_force", [0, 0, -1e8], [0, 0, 0, 0, 0, 0, 0, 0, 0], 0, 0, -1, 0, 0, 1, 0.19, 0.21, true);

// 求解
dyna.Solve(3000);

// 输出破裂块度信息
blkdyn.ExportGradationCurveByGroup(1, 1);
