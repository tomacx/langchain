setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置系统不平衡率
dyna.Set("UnBalance_Ratio 1e-5");

// 设置重力加速度为负Y方向
dyna.Set("Gravity 0.0 -9.8 0.0");

// 关闭大变形计算开关
dyna.Set("Large_Displace 0");

// 计算结果输出间隔为2000步
dyna.Set("Output_Interval 2000");

// 关闭GiD结果输出开关
dyna.Set("GiD_Out 0");

// 将监测间隔设为100步
dyna.Set("Moniter_Iter 100");

// 打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 将虚拟时步设定为0.5
dyna.Set("Virtural_Step 0.5");

// 设置接触容差为0.0
dyna.Set("Contact_Detect_Tol 0.00");

// 关闭接触更新开关
dyna.Set("If_Renew_Contact 0");

// 关闭Save自动存储开关
dyna.Set("SaveFile_Out 0");

// 创建三维块体网格模拟巴西劈裂试验试样（圆柱体近似）
blkdyn.GenBrick3D(10, 10, 10, 20, 20, 20, 1);

// 将组号为1的单元交界面进行切割
blkdyn.CrtIFace(1, 1);

// 更新交界面网格信息
blkdyn.UpdateIFaceMesh();

// 设置单元模型为线弹性模型
blkdyn.SetModel("linear");

// 设置单元的材料参数（密度、弹性模量、泊松比等）
blkdyn.SetMatByGroup(2500, 1e10, 0.25, 10e6, 4e6, 40.0, 10.0, 1);

// 将横观各向同性材料关联到设定的单元组号范围
blkdyn.BindTransIsoMat(1, 1, 10);

// 设置交界面的模型为断裂模型
blkdyn.SetIModel("FracE");

// 设置交界面的一般材料参数，法向刚度、切向刚度、内摩擦角、粘聚力、抗拉强度
blkdyn.SetIMat(5e13, 5e13, 40, 5e6, 1e6);

// 指定组1的断裂能参数，拉伸断裂能为50，剪切断裂能为500
blkdyn.SetIFracEnergyByGroupInterface(50.0, 500.0, 1, 1);

// 固定底部边界在X、Z方向的速度并限制Y方向位移
blkdyn.FixVByCoord("x", 0.0, -1e10, 1e10, -0.0201, -0.0199, -1e10, 1e10);
blkdyn.FixVByCoord("z", 0.0, -1e10, 1e10, -0.0201, -0.0199, -1e10, 1e10);

// 固定底部Y方向位移（限制）
blkdyn.FixVByCoord("y", 0.0, -1e10, 1e10, -0.0201, -0.0199, -1e10, 1e10);

// 设置顶部加载点施加准静态速度载荷
blkdyn.FixVByCoord("y", -2e-9, -1e10, 1e10, 0.0199, 0.0201, -1e10, 1e10);

// 设置监测点位置及监测信息
dyna.Monitor("block", "ydis", 5.0, 10.0, 5.0);
dyna.Monitor("block", "ydis", 5.0, 6.0, 5.0);
dyna.Monitor("block", "ydis", 5.0, 2.0, 5.0);

// 计算前初始化操作以准备求解
dyna.BeforeCal();

// 循环调用求解器并输出监测数据至结果文件夹
for (var i = 0; i < 100000; i++) {
    // 集成核心计算
    var unbal = blkdyn.Solver();

    // 计算单元变形力
    blkdyn.CalBlockForce();

    // 计算节点运动
    blkdyn.CalNodeMovement();

    // 输出监测信息
    dyna.OutputMonitorData();

    // 每隔100步推送信息
    if (i != 0 && i % 100 == 0) {
        // 推送文本信息
        print("不平衡率：" + unbal);

        // 推送结果信息至GDEM-Env
        dyna.PutStep(1, i, 0.1);
    }
}

// 打印提示信息
print("Solution Finished");
