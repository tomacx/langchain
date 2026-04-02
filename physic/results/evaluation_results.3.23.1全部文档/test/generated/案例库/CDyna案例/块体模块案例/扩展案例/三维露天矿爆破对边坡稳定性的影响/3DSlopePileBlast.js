// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 清除Mesh模块几何数据
igeo.clear();

// 清除Mesh模块网格数据
imeshing.clear();

// 清除BlockDyna模型数据
dyna.Clear();

// 清除Genvi平台数据
doc.clearResult();

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置三个方向的重力加速度均为0
dyna.Set("Gravity 0.0 0.0 0.0");

// 打开大变形计算开关
dyna.Set("Large_Deformation 1");

// 设置结果输出时步
dyna.Set("Output_Interval 500");

// 打开接触更新开关
dyna.Set("If_Renew_Contact 1");

// 创建几何模型
var loopid1 = igeo.genRect(0, 0, 0, 20, 20, 0, 1.0);
var loopid2 = igeo.genRect(8, 8.5, 0, 12, 11.5, 0, 0.2);

// 创建外边界的面（含矩形空洞）
igeo.genSurface([loopid1, loopid2], 1);
igeo.genSurface([loopid2], 2);

// 生成二维网格
imeshing.genMeshByGmsh(2);

// BlockDyna从平台下载网格
blkdyn.GetMesh(imeshing);

// 对两侧单元均为组1的公共面进行切割，设置为接触面
blkdyn.CrtIFace();

// 设置接触后，更新网格信息
blkdyn.UpdateIFaceMesh();

// 指定材料参数
blkdyn.SetModel("linear");
blkdyn.SetMat(2300, 1e10, 0.25, 5e6, 5e6, 35.0, 15.0);

// 将接触面模型设定为线弹性模型
blkdyn.SetIModel("linear");

// 虚拟接触面刚度及强度从单元中自动获取
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem(1);

// 设置爆炸荷载参数
var explosionParams = {
    "x": 10.0,
    "y": 10.0,
    "z": 0.0,
    "chargeWeight": 100.0,
    "detonationVelocity": 6500.0,
    "explosionTime": 0.0
};

// 设置爆炸荷载
blkdyn.SetExplosion(explosionParams);

// 指定爆炸荷载作用的单元组
blkdyn.ApplyExplosion("all");

// 解算模型
dyna.Solve();
