setCurDir(getSrcDir());

////////////////////////////////////////////////////公共接口设置
//重力方向必须Y轴负半轴，Y方向为重力方向
dyna.Set("Gravity 0 -9.8 0");

dyna.Set("Large_Displace 1");

dyna.Set("If_Virtural_Mass 0");

dyna.Set("If_Renew_Contact 0");

dyna.Set("Renew_Interval 100");

dyna.Set("Contact_Detect_Tol 2.0e-3");

dyna.Set("Block_Soften_Value 0.2 0.2");

dyna.Set("If_Cal_Particle 0");

//导入ANSYS类型的块体网格
blkdyn.ImportGrid("ansys", "block.dat");


////////////////////////////////////////////////////////////////块体信息栏
//设置单元本构模型为线弹性模型
blkdyn.SetModel("linear");
//设置炸药参数density young poisson cohesion tension friction dilation
blkdyn.SetMat(1700, 3e9, 0.24, 3e5, 3e5, 0, 0, 1);
//设置侧壁破片参数（钢）-等效层
blkdyn.SetMat(7800, 2e11, 0.3, 10e6, 10e6, 0, 0, 2);

//设置阻尼为0
blkdyn.SetLocalDamp(0.0);

//施加重力
//blkdyn.ApplyGravity();


////////////////////////////////////////////////////////////////爆炸载荷设定
//设置全局的朗道爆源模型：序号、装药密度、爆速、爆热、初始段绝热指数、第二段绝热指数、波阵面上的压力、点火点位置、点火时间、持续时间
var pos = new Array(4.06192, 0, 0);
blkdyn.SetLandauSource(1, 1700, 7104, 4.6e6, 3.0, 1.3333, 21.4e9, pos, 0.0, 100);
//将各组号单元与对应的的Landau爆源模型序号绑定
blkdyn.BindLandauSource(1, 1, 1);

////////////////////////////////////////////////////////////////颗粒(破片)网格生成及导入
///////////////////////////////////////////////////////需要输入的参数
//炸药组号
var iChargeGrp = 1;

//壳体组号
var iShellGrpL    = 2;
var iShellGrpU    = 2;

///全弹一段，只能为1及0。如果为1，表示一段，如果为0，表示多段
//如果1段，不需要输入轴线坐标
var OneSegOrNot   = 1;

pdyna.CreateByCoord(50, iChargeGrp, 1, 2.0, 2.0, 0);
pdyna.CreateByCoord(100, iShellGrpL, 1, 4.0, 4.0, 0);

//设置颗粒本构模型
pdyna.SetModel("linear");
pdyna.SetMat(7800, 2e11, 0.3, 10e6, 10e6, 0, 0);

dyna.Solve(500);
