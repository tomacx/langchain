//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//设置输出的间隔为500步
dyna.Set("Output_Interval 500");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

//设置三个方向的全局重力加速度为0
dyna.Set("Gravity 0.0 -9.8 0.0");

//打开单元大变形计算开关
dyna.Set("Large_Displace 1");

//打开单元接触更新开关
dyna.Set("If_Renew_Contact 1");

//设置接触容差为2e-3
dyna.Set("Contact_Detect_Tol 3e-3");

//设置计算时步为5e-5
dyna.Set("Time_Step 5e-5");


//打开棱-棱接触检测开关
dyna.Set("If_Cal_EE_Contact 1");

//设置颗粒块体接触采用高级模式
dyna.Set("If_Search_PBContact_Adavance 1");

//创建长宽为1m，厚5cm的板
blkdyn.GenBrick3D(1,1,1,5,5,5,1);

//所有块体边界均设为接触面
blkdyn.CrtIFace();

//更新接触面网格
blkdyn.UpdateIFaceMesh();

//设置单元模型为线弹性模型
blkdyn.SetModel("linear");

//设置单元材料，依次为密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角
blkdyn.SetMat(2500, 1e8,0.25, 3e4, 1e4, 35, 15);


//设定所有接触面的本构为脆性断裂的Mohr-Coulomb本构
blkdyn.SetIModel("brittleMC");

//设定接触面上的材料，依次为单位面积法向刚度、单位面积切向刚度、内摩擦角、粘聚力、抗拉强度
blkdyn.SetIMat(1e9, 1e9, 25.0, 0.0, 0.0);


//设置单元的局部阻尼
blkdyn.SetLocalDamp(0.01);


//创建随机分布的颗粒
var x = [0,1];
var y = [-1.2,-0.2];
var z = [0,1];
pdyna.CreateByCoord(1000,2,2, 0.1, 0.1, 0.005, x, y, z);

//设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e8, 0.2, 0.0, 0.0, 20, 0.01, 0.00);


//刚性面创建
var fCoord=new Array();
fCoord[0]=new Array(-2,-1.5,-2);
fCoord[1]=new Array(-2,-1.5,3);
fCoord[2]=new Array(3,-1.5,3);
fCoord[3]=new Array(3,-1.5,-2);
rdface.Create (2, 1, 4, fCoord);

//求解2万步
dyna.Solve(20000);

//打印信息
print("Solution is ok!");

