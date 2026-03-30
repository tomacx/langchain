setCurDir(getSrcDir());

// 清理环境
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// ========== 1. 初始化CDyna仿真环境并加载核心模块 ==========
dyna.Set("Mechanic_Cal 1");
dyna.Set("Config_FracSeepage 1");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Output_Interval 500");

// ========== 2. 定义土质边坡几何模型网格 ==========
var afcoord = new Array();
afcoord[0] = [0.0, 0.0, 0.0, 0.5];
afcoord[1] = [15.0, 0.0, 0.0, 0.5];
afcoord[2] = [15.0, 8.0, 0.0, 0.5];
afcoord[3] = [5.0, 8.0, 0.0, 0.5];
afcoord[4] = [4.0, 3.0, 0.0, 0.5];
afcoord[5] = [0.0, 3.0, 0.0, 0.5];
var id = igeo.genPloygenS(afcoord, 1);

imeshing.genMeshByGmsh(2);

blkdyn.GetMesh(imeshing);

// ========== 3. 建立相邻土块之间的接触界面 ==========
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// ========== 4. 分配弹塑性材料属性给单元 ==========
blkdyn.SetModel("MC");
blkdyn.SetMat(2000, 1e9, 0.35, 1e6, 1e6, 30.0, 15.0);

// ========== 5. 为特定裂隙区域施加拉伸和剪切断裂能参数 ==========
var coord1 = new Array(2.0, 4.0, 0.0);
var coord2 = new Array(8.0, 6.0, 0.0);
blkdyn.SetIFracEnergyByLine(500.0, 2000.0, coord1, coord2, 1e-3);

// ========== 6. 配置裂隙渗流单元的流体密度和渗透系数 ==========
fracsp.CreateGridFromBlock(2);
fracsp.SetSinglePropByInterFri("FDensity", 1000.0, 25.0, 45.0);
fracsp.SetSinglePropByInterFri("KCoeff", 1e-6, 25.0, 45.0);

// ========== 7. 定义边界条件包括重力载荷及边坡位移约束设置 ==========
dyna.Set("Gravity 0.0 -9.8 0.0");
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 14.99, 15.01);
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// ========== 8. 设置沙漏阻尼系数以确保动态破坏过程中的数值稳定性 ==========
blkdyn.SetLocalDamp(0.15);

// ========== 9. 设置节点力、裂隙开度及应力历史的输出请求 ==========
blkdyn.Set("Contact_Cal_Quantity 1");
blkdyn.Set("If_Virtural_Mass 1");
blkdyn.Set("Virtural_Step 0.5");
blkdyn.Set("UnBalance_Ratio 1e-4");
blkdyn.Set("Contact_Detect_Tol 0.005");

// ========== 10. 分配用户自定义变量 UDM_P 给特定节理以监测裂隙演化过程 ==========
var jointGroup = new Array(2, 3);
for (var i = 0; i < jointGroup.length; i++) {
    var groupNum = jointGroup[i];
    dyna.RunUDFCmd("SetUDM_P " + groupNum + " 1.0");
}

// ========== 11. 执行仿真运行并导出结果数据用于塑性开裂验证分析 ==========
dyna.Solve(30000);
