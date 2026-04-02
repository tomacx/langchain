// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 关闭大变形计算开关
dyna.Set("Large_Displace 0");

// 设置结果输出时步为500步
dyna.Set("Output_Interval 500");

// 监测信息的输出时步为10步
dyna.Set("Monitor_Iter 10");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 打开瑞利阻尼计算开关
dyna.Set("If_Cal_Rayleigh 1");

// 导入Gmsh格式的网格
blkdyn.ImportGrid("gid", "surface.msh");

// 创建接触面
blkdyn.CrtIFace();

// 更新接触面网格信息
blkdyn.UpdateIFaceMesh();

// 设置实体单元为线弹性模型
blkdyn.SetModel("linear");

// 设置材料参数，依次为密度、杨氏模量、泊松比、拉伸强度、粘聚力、摩擦角、局部阻尼、粘性阻尼
blkdyn.SetMat(2500, 5e10, 0.25, 3e6, 1e6, 40.0, 10.0);

// 设置接触面模型为脆断模型
blkdyn.SetIModel("brittleMC");

// 设置接触面上的材料参数，依次为单位面积法向刚度、单位面积切向刚度、内摩擦角、粘聚力、抗拉强度
blkdyn.SetIMat(5e10, 5e10, 20.0, 1e5, 1e5);

// 设置全局的JWL炸药参数，为TNT，材料序号1，装药密度调小10倍
var apos = [5.0, 4.8, 0.0];
blkdyn.SetLandauSource(1, 115, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 0.0, 15e-3);

// 绑定JWL炸药源
blkdyn.BindLandauSource(1, 1, 1);

// 监测Y方向应力
for (var i = 0; i <= 5; i++) {
    dyna.Monitor("block", "syy", 5, 5.0 + i, 0);
}

// 计算2秒
dyna.DynaCycle(2);
