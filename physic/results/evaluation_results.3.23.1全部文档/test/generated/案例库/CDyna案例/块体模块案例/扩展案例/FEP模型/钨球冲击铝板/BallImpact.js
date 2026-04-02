// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 清除Mesh模块几何数据和网格数据
igeo.clear();
imeshing.clear();

// 清除BlockDyna模型数据及Genvi平台数据
dyna.Clear();
doc.clearResult();

// 打开力学计算开关并设置重力加速度为0
dyna.Set("Mechanic_Cal", 1);
dyna.Set("Gravity", 0.0, 0.0, 0.0);

// 设置大变形计算开关和接触更新开关
dyna.Set("Large_Displace", 1);
dyna.Set("If_Renew_Contact", 1);

// 创建一个矩形区域作为几何模型
var loopid = igeo.genRect(0, 0, 0, 20, 20, 0, 1.0);
igeo.genSurface([loopid], 1);

// 使用Gmsh生成二维网格
imeshing.genMeshByGmsh(2);

// BlockDyna从平台下载网格数据
blkdyn.GetMesh(imeshing);

// 设置接触面并更新网格信息
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 指定材料属性，包括密度、弹性模量等
blkdyn.SetMat(2300, 1e10, 0.25, 5e6, 5e6, 35.0, 15.0);

// 设置单元本构模型为线性弹性模型
blkdyn.SetModel("linear");

// 将接触面的材料属性设置为与实体相同
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();

// 输出计算结果文件
dyna.Output();
