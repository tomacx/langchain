//设置文件路径
setCurDir(getSrcDir());

//清除平台及求解器内存
doc.clearResult();
dyna.Clear();
imeshing.clear();
igeo.clear();

//创建网格文件
igeo.genRectS(0,0,0, 0.1, 0.2, 0, 0.005, 1);
imeshing.genMeshByGmsh(2);

//计算时步
dyna.Set("Virtural_Step 0.5");

//不考虑重力的影响
dyna.Set("Gravity 0 0 0");

//云图输出间隔500
dyna.Set("Output_Interval 500");

//打开ElemJoint本构开关
dyna.Set("If_ElemJoint_Model 1");

//ElemJoint本构的破坏模式，1 为脆性断裂，2 为理想弹塑性
dyna.Set("UbJoint_Mode_Option 1");

//从网格文件从imesing模块搭载的BlockDyna核心求解器
blkdyn.GetMesh(imeshing);

//设置单元本构模型为MC
blkdyn.SetModel("MC");

//设置单元材料参数
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 35, 15);

//设置节理几何参数及力学参数
//设定单元节理面厚度
var fThickness = 0.004;
//设定单元节理面长度
var fLength = 10;
//设定单元节理面中心坐标
var centroid = new Array(0.05, 0.1, 0.0);
//设定单元节理面的法向
var normal = new Array(1, 1, 0);
//设定序号为1的单元节理参数(将节理穿过的单元设置为“ElemJoint"本构
blkdyn.SetElemJointMat(1, 20, 5e5, 5e5, fThickness, fLength, centroid, normal);

//施加边界条件
blkdyn.FixV("y",1e-9, "y", 0.1999, 11);
blkdyn.FixV("y", 0, "y", -0.001, 0.001);

//设置测点 获取特定位置的应力时程曲线
for(var i = 0; i <= 10; i++)
{
    dyna.Monitor("block","syy", i * 0.01, 0.2 ,0);
}

//求解20000步
dyna.Solve(20000);
