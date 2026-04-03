setCurDir(getSrcDir());

// 清除环境
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 创建混凝土块体
var id1 = igeo.genBrickV(0, 0, 0, 1.0, 0.3, 0.3, 0.05, 1);

// 创建圆柱形锚孔
var id2 = igeo.genCylinderV(-0.1, 0.15, 0.15, 0, 0.15, 0.15, 0.0, 0.1, 0.02, 0.02, 2);

// 几何绑定
igeo.glue("volume", id1, id2);

// 网格划分
imeshing.genMeshByGmsh(3);

// 设置块体计算开关
dyna.Set("If_Cal_Bar 1");

// 设置输出间隔
dyna.Set("Output_Interval 500");

// 关闭重力
dyna.Set("Gravity 0 0 0");

// 导入网格
blkdyn.GetMesh(imeshing);

// 创建接触面
blkdyn.CrtIFace(1, 2);

// 更新接触面网格
blkdyn.UpdateIFaceMesh();

// 设置模型为线弹性
blkdyn.SetModel("linear");

// 设置混凝土材料参数（组1）
blkdyn.SetMat(2500, 3e10, 0.25, 1e6, 5e6, 35, 10, 1);

// 设置锚索材料参数（组2）
blkdyn.SetMat(2000, 1e10, 0.25, 1e6, 5e6, 35, 10, 2);

// 设置块体失效模型
blkdyn.SetIModel("brittleMC");

// 设置材料失效参数
blkdyn.SetIMat(1e12, 1e12, 10.0, 0.0, 0.0);

// 固定底部约束
blkdyn.FixV("xyz", 0.0, "x", 0.999, 1.01);

// 创建第1根锚索
var fArrayCoord1 = [-0.095, 0.15, 0.15];
var fArrayCoord2 = [0.8, 0.15, 0.15];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 30);

// 设置锚索失效模型
bar.SetModelByID("failure", 1, 100);

// 定义锚索材料参数（锚固段）
var BarProp1 = [1e-2, 7800.0, 1e10, 0.25, 235e6, 235e6, 1e6, 35, 1e9, 0.4, 0.0];

// 定义锚索材料参数（自由段）
var BarProp2 = [1e-2, 7800.0, 1e10, 0.25, 235e6, 235e6, 0.0, 0.0, 1e9, 0.4, 0.0];

// 指定自由段锚索材料（节点1-10）
bar.SetPropByID(BarProp2, 1, 10, 1, 23);

// 指定锚固段锚索材料（节点24-30）
bar.SetPropByID(BarProp1, 1, 10, 24, 30);

// 方案2：在钢筋上施加x方向拉力1kN
bar.ApplyForceByID([-1e3, 0.0, 0.0], 1, 11, 1, 1);

// 设置监测点
dyna.Monitor("bar", "a_normal_force", 0, 0.15, 0.15);
dyna.Monitor("bar", "a_normal_force", 0.2, 0.15, 0.15);

// 计算前初始化
dyna.BeforeCal();

// 求解循环
for (var i = 0; i < 10000; i++) {
    // 计算单元变形力
    blkdyn.CalBlockForce();

    // 计算节点运动
    var unbal = blkdyn.CalNodeMovement();

    // 输出监测信息
    dyna.OutputMonitorData();

    // 每隔100步推送信息
    if (i != 0 && i % 100 == 0) {
        print("计算步数：" + i);
        print("不平衡率：" + unbal);

        // 推送结果信息至GDEM-Env
        dyna.PutStep(1, i, 0.1);
    }

    // 核心求解
    blkdyn.Solver();

    // 释放预应力（第500步后）
    if (i >= 500) {
        bar.ApplyForceByID([0, 0, 0], 1, 11, 1, 1);
    }

    // 增强粘接（第600步后）
    if (i >= 600) {
        dyna.Set("Contact_Stiffness 10");
        blkdyn.UpdateIFaceMesh();
    }
}
