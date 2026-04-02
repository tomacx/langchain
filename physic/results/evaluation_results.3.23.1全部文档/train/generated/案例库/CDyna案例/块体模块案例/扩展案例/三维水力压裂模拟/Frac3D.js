// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置三个方向的重力加速度，均为0
dyna.Set("Gravity 0.0 0.0 0.0");

// 关闭大变形计算开关
dyna.Set("Large_Displace 0");

// 设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 500");

// 打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 设置虚质量时步为0.3
dyna.Set("Virtural_Step 0.3");

// 设置满足稳定条件的系统不平衡率
dyna.Set("UnBalance_Ratio 1e-4");

// 关闭接触更新计算开关
dyna.Set("If_Renew_Contact 0");

// 设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

// 打开接触检测开关
dyna.Set("If_Find_Contact_OBT 1");

// 关闭GiD输出开关
dyna.Set("GiD_Out 0");

// 包含裂隙渗流计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

// 打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

// 关闭裂隙渗流与固体耦合开关（孔隙渗流无此开关）
dyna.Set("FS_Solid_Interaction 0");

var msh1 = imesh.importGmsh("model.msh");
blkdyn.GetMesh(msh1);

// 创建接触面
blkdyn.CrtIFace(1, 1);
// 更新接触面网格
blkdyn.UpdateIFaceMesh();

// 设定所有单元的本构为线弹性本构
blkdyn.SetModel("MC");

// 设置材料参数，依次为密度、弹性模量、泊松比、拉伸强度、粘聚力、摩擦角、局部阻尼系数、粘性阻尼系数
blkdyn.SetMatByGroup(2500, 6.5e9, 0.25, 3e6, 3e6, 30.0, 10.0, 1);

// 设定所有接触面的本构为线弹性模型
blkdyn.SetIModel("brittleMC");

// 设置接触面材料参数，依次为法向刚度、切向刚度、摩擦角、拉伸强度、粘聚力、局部阻尼系数
blkdyn.SetIMat(9e9, 9e9, 30, 3e6, 3e6, 1);

// 设接触面刚度为单元特征刚度的1倍
blkdyn.SetIStiffByElem(1.0);

// 设定全部节点的局部阻尼系数为0.8
blkdyn.SetLocalDamp(0.8);

// 创建裂隙单元，只有弹簧的位置才加渗流
fracsp.CreateGridFromBlock (2);

// 设置裂隙渗流参数，依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
fracsp.SetPropByGroup(1000.0, 1e7, 1e-14, 1e-8, 1, 1);

// 设置水力参数，依次为水的密度和粘性系数
dyna.Set("Water_Density_Viscosity 1000.0 0.0");

// 设置水力计算开关
dyna.Set("Hydraulic_Cal 1");

// 计算步数
var steps = 500;
for (var i = 0; i < steps; i++) {
    dyna.DynaCycle(1);
}

// 结束模拟，保存结果
doc.SaveResult("result.dyn");
