//将工作路径设置为JavaScript脚本所在路径
setCurDir(getSrcDir());

//清除核心数据及内存
dyna.Clear();


//设置重力，x方向及y方向均有，相当于倾斜45度
dyna.Set("Gravity -6.93 -6.93 0");

//每隔500步输出结果
dyna.Set("Output_Interval 500");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//打开接触更新开关
dyna.Set("If_Renew_Contact 1");

//加载动态链接库
dyna.LoadUDF("CustomModel");

//产生二维网格
blkdyn.GenBrick2D(10,10,10,10,1);

//所有单元界面均设为接触面
blkdyn.CrtIFace();

//更新网格
blkdyn.UpdateIFaceMesh();

//设置单元模型为线弹性
blkdyn.SetModel("linear");

//输入单元参数
blkdyn.SetMat(2500,3e10,0.25,1e7,1e7,35,10);

//先设定接触面模型为线弹性模型
blkdyn.SetIModel("linear");

//接触面刚度从单元自动获取
blkdyn.SetIStiffByElem(1.0);

//接触面强度从单元自动获取
blkdyn.SetIStrengthByElem();

//固定模型底部三个方向的速度
blkdyn.FixV("xyz",0,"y", -0.001,0.001);

//设置接触面自定义本构参数，示例提供了脆断模型的本构
//输入参数依次为单位面积法向接触刚度、单位面积切向接触刚度、粘聚力、抗拉强度及内摩擦角
var avalue = [1e10,1e10,0,0,30];
dyna.SetUDFValue(avalue);


//设置接触模型为用户自定义模型
blkdyn.SetIModel("custom");

//设置局部阻尼
blkdyn.SetLocalDamp(0.01);

//查看接触面模型
dyna.Plot("Interface","IModel");

//求解
dyna.Solve();

//卸载动态链接库
dyna.FreeUDF();
