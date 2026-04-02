setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

var length = 0.2;
var height = 0.05;

var deltl = 0.005;
var size = 0.002;

// 创建几何模型
igeo.genRectS(0, 0, 0, length, height, 0, size, 1);
igeo.genRectS(0.5 * length - deltl, height + deltl, 0, 0.5 * length + deltl, height + deltl * 4, 0, size, 2);
igeo.genPloygenS([length * 0.5, height + 0.1 * deltl, 0, size, 0.5 * length - deltl, height + deltl, 0, size, 0.5 * length + deltl, height + deltl, 0, size], 2);

// 网格生成
imeshing.genMeshByGmsh(2);
dyna.Set("Gravity", 0, 0, 0);
dyna.Set("Large_Displace", 1);
dyna.Set("If_Renew_Contact", 1);
dyna.Set("Contact_Detect_Tol", 1e-4);
dyna.Set("If_Virtural_Mass", 0);
dyna.Set("Output_Interval", 100);
dyna.Set("If_Auto_Create_Contact", 1, 0);
dyna.Set("Elem_Kill_Option", 1, 0.1, 0.1, 1, 1);

// 获取网格
blkdyn.GetMesh(imeshing);

// 创建接触面
blkdyn.CrtBoundIFaceByGroup(1);
blkdyn.CrtBoundIFaceByGroup(2);
blkdyn.UpdateIFaceMesh();

// 设置材料模型和参数
blkdyn.SetModel("JH2");
blkdyn.SetMat(2500, 8e10, 0.3, 20e6, 20e6, 45, 10, 1);
var JH2Mat = [8e10, 0.3, -1.5e11, 2.0e11, 5e9, 1e10, 1.01, 0.83, 0.68, 0.76, 0.005, 3.5e7, 0.01, 0.9, 1.0, 7.0, 1.0];
blkdyn.SetJH2Mat(1, JH2Mat);
blkdyn.BindJH2Mat(1, 1, 1);

// 设置线弹性模型参数
blkdyn.SetModel("linear", 2);
blkdyn.SetMat(7800, 2.1e11, 0.3, 8e8, 8e8, 0, 0, 2);

// 设置接触面材料模型和参数
blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(1e11, 1e11, 0, 0, 0);
blkdyn.SetIStiffByElem(10.0);

// 定义初始速度
var values = new Array(0.0, -1000, 0);
blkdyn.ApplyVelocity(values);

// 求解时间步长
dyna.DynaCycle(5e-3);
