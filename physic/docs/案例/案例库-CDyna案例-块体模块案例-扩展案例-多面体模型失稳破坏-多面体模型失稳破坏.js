//设置工作路径为JS脚本所在路径
setCurDir(getSrcDir());

//清除dyna信息
dyna.Clear();
//清除平台结果信息
doc.clearResult();

//打开大位移开关
dyna.Set("Large_Displace 1");

//打开接触更新开关
dyna.Set("If_Renew_Contact 1");

//设置云图输出间隔为500
dyna.Set("Output_Interval 500");

//设置虚拟时步为0.4
dyna.Set("Virtural_Step 0.4");

//导入ansys格式的网格
blkdyn.ImportGrid("ansys","groupcheck.dat");

//不同组号交界面进行切割
blkdyn.CrtIFace(-1,-1);

//接触切割后，更新网格
blkdyn.UpdateIFaceMesh();

//设置单元本构
blkdyn.SetModel("linear");
blkdyn.SetMat(2000,1e8,0.3,1e6,1e6,35,35);

//设置接触面本构
blkdyn.SetIModel("linear");
blkdyn.SetIMat(1e9,1e9,15,0,0);

//固定Y底部的Y方向位移
blkdyn.FixV("y",0,"y",-1,0.001);

//求解
dyna.Solve();

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//设置接触面模型为脆性断裂模型
blkdyn.SetIModel("brittleMC");

//设置局部阻尼为0.01
blkdyn.SetLocalDamp(0.01);

//自动计算时步
dyna.TimeStepCorrect(0.8);

//求解1.5万步
dyna.Solve(15000);

print("Solution is OK!");