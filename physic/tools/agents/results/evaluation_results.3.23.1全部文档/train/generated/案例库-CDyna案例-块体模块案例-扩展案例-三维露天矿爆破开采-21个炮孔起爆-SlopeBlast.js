setCurDir(getSrcDir());

// 初始化仿真环境
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Output_Interval 5000");
dyna.Set("Moniter_Iter 100");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.5");

// 定义露天矿边坡地形几何参数（使用方块函数）
gflow.setTerrainByBrick(0.0, 0.0, 200.0, 300.0, 150.0, 80.0);
gflow.setTerrainByBrick(0.0, 0.0, 200.0, 300.0, 150.0, 60.0, 1);

// 创建边界刚性面
var fCoord = new Array();
fCoord[0] = new Array(-50, 8, 0);
fCoord[1] = new Array(-50, 8, 150);
fCoord[2] = new Array(250, 8, 150);
fCoord[3] = new Array(250, 8, 0);
rdface.Create(2, 1, 4, fCoord);

// 导入网格模型
blkdyn.ImportGrid("ansys", "Model.dat");

// 创建接触面
blkdyn.CrtIFace(1);
blkdyn.CrtIFace(-1);

// 更新接触面网格
blkdyn.UpdateIFaceMesh();

// 设置线性模型
blkdyn.SetModel("linear");

// 配置岩石材料属性（密度、弹性模量、泊松比等）
blkdyn.SetMat(2700, 6e10, 0.25, 20e6, 10e6, 40.0, 15.0);

// 设置接触面本构为线弹性
blkdyn.SetIModel("linear");

// 设置接触面刚度从单元获取
blkdyn.SetIStiffByElem(1.0);

// 设置接触面强度从单元获取
blkdyn.SetIStrengthByElem();

// 生成21个炮孔的坐标数组（基于设计的爆破布置图）
var holePos = new Array(21);
var holeDistX = 5.0;
var holeDistY = 8.0;
var baseZ = 60.0;

holePos[0] = [0, 0, baseZ];
for (var i = 1; i < 21; i++) {
    holePos[i][0] = (i - 1) * holeDistX;
    holePos[i][1] = (i % 7) * holeDistY;
    holePos[i][2] = baseZ;
}

// 设置每个炮孔的JWL爆源参数
var jwlParams = [1630, 7.0e9, 371.2e9, 3.2e9, 4.2, 0.95, 0.30, 21e9, 6930];

for (var i = 0; i < 21; i++) {
    blkdyn.SetJWLSource(i + 1, jwlParams[0], jwlParams[1], jwlParams[2],
                         jwlParams[3], jwlParams[4], jwlParams[5],
                         jwlParams[6], jwlParams[7], jwlParams[8], holePos[i], 0.0, 15e-3);
}

// 配置爆生气体逸散衰减参数（特征时间、特征指数、ID范围）
blkdyn.SetJWLGasLeakMat(5e-4, 1.2, 1, 21);

// 将配置的JWL爆源绑定到对应的起爆点位置
for (var i = 0; i < 21; i++) {
    blkdyn.BindJWLSource(i + 1, holePos[i]);
}

// 设置边界条件（固定底部和两侧）
blkdyn.FixV("x", 0.0, "x", -50.0, -49.0);
blkdyn.FixV("x", 0.0, "x", 250.0, 251.0);
blkdyn.FixV("y", 0.0, "y", -50.0, -49.0);
blkdyn.FixV("y", 0.0, "y", 150.0, 151.0);
blkdyn.FixV("z", 0.0, "z", 0.0, 1e-3);

// 设置无反射边界（粘性边界）
blkdyn.SetQuietBoundByCoord(-0.001, 0.001, -200, 200, -200, 200);

// 设置裂隙显示参数
blkdyn.Set("Config_Crack_Show 1");
blkdyn.Set("Crack_Color 1");

// 求解器执行
dyna.Solve();

// 保存结果
dyna.Save("SlopeBlast_result.sav");
