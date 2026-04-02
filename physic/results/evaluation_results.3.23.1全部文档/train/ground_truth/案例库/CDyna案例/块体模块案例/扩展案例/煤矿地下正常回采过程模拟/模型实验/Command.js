setCurDir(getSrcDir());


//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置系统收敛的不平衡率为 1e-5
dyna.Set("UnBalance_Ratio 1e-2");

//设置 3 个方向的重力加速度值
dyna.Set("Gravity 0 -9.8 0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//设置接触更新
dyna.Set("If_Renew_Contact 1");


//设置计算结果的输出间隔为 100000 步
dyna.Set("Output_Interval 10000000");

//设置监测结果的输出时步为 100 步
dyna.Set("Moniter_Iter 100");

//打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

//设置虚拟时步为 0.1
dyna.Set("Virtural_Step 0.4");

//设置接触容差 1.0e-3
dyna.Set("Contact_Detect_Tol 0.0");

//设置接触面软化系数，断裂时的临界位移
dyna.Set("Interface_Soften_Value 1e-5 3e-5");


//导入2D网格
blkdyn.ImportGrid("ansys","coal.dat");

blkdyn.CrtIFace();

//更新交界面网格信息
blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");

//设置材料参数，分别为密度，弹性模量，泊松比，粘聚力、抗拉强度、内摩擦角、剪胀角、组号

//粉砂岩
blkdyn.SetMat(1742, 0.01e9, 0.26, 126e3, 37.5e3, 16.3, 10, 1);
blkdyn.SetMat(1742, 0.01e9, 0.26, 126e3, 37.5e3, 16.3, 10, 4);
blkdyn.SetMat(1742, 0.01e9, 0.26, 126e3, 37.5e3, 16.3, 10, 7);
blkdyn.SetMat(1742, 0.01e9, 0.26, 126e3, 37.5e3, 16.3, 10, 17);
blkdyn.SetMat(1742, 0.01e9, 0.26, 126e3, 37.5e3, 16.3, 10, 20);
blkdyn.SetMat(1742, 0.01e9, 0.26, 126e3, 37.5e3, 16.3, 10, 28);


//煤层
blkdyn.SetMat(1072, 0.06e9, 0.31, 57.8e3, 9.29e3, 17.7, 10, 2);


//泥岩
blkdyn.SetMat(1728, 0.03e9, 0.28, 55.1e3, 17.1e3, 14.5, 10, 3);
blkdyn.SetMat(1728, 0.03e9, 0.28, 55.1e3, 17.1e3, 14.5, 10, 8);



//细砂岩
blkdyn.SetMat(1886, 0.02e9, 0.22, 158e3, 58.9e3, 21.5, 10, 6);
blkdyn.SetMat(1886, 0.02e9, 0.22, 158e3, 58.9e3, 21.5, 10, 9);
blkdyn.SetMat(1886, 0.02e9, 0.22, 158e3, 58.9e3, 21.5, 10, 11);
blkdyn.SetMat(1886, 0.02e9, 0.22, 158e3, 58.9e3, 21.5, 10, 14);
blkdyn.SetMat(1886, 0.02e9, 0.22, 158e3, 58.9e3, 21.5, 10, 15);
blkdyn.SetMat(1886, 0.02e9, 0.22, 158e3, 58.9e3, 21.5, 10, 23);
blkdyn.SetMat(1886, 0.02e9, 0.22, 158e3, 58.9e3, 21.5, 10, 25);
blkdyn.SetMat(1886, 0.02e9, 0.22, 158e3, 58.9e3, 21.5, 10, 29);


//砂质泥岩
blkdyn.SetMat(1764, 0.02e9, 0.25, 111e3, 36.9e3, 15.7, 10, 5);
blkdyn.SetMat(1764, 0.02e9, 0.25, 111e3, 36.9e3, 15.7, 10, 10);
blkdyn.SetMat(1764, 0.02e9, 0.25, 111e3, 36.9e3, 15.7, 10, 12);
blkdyn.SetMat(1764, 0.02e9, 0.25, 111e3, 36.9e3, 15.7, 10, 13);
blkdyn.SetMat(1764, 0.02e9, 0.25, 111e3, 36.9e3, 15.7, 10, 16);
blkdyn.SetMat(1764, 0.02e9, 0.25, 111e3, 36.9e3, 15.7, 10, 18);
blkdyn.SetMat(1764, 0.02e9, 0.25, 111e3, 36.9e3, 15.7, 10, 19);
blkdyn.SetMat(1764, 0.02e9, 0.25, 111e3, 36.9e3, 15.7, 10, 21);
blkdyn.SetMat(1764, 0.02e9, 0.25, 111e3, 36.9e3, 15.7, 10, 22);
blkdyn.SetMat(1764, 0.02e9, 0.25, 111e3, 36.9e3, 15.7, 10, 24);
blkdyn.SetMat(1764, 0.02e9, 0.25, 111e3, 36.9e3, 15.7, 10, 26);
blkdyn.SetMat(1764, 0.02e9, 0.25, 111e3, 36.9e3, 15.7, 10, 27);


blkdyn.SetIModel("linear");

blkdyn.SetIStrengthByElem();

blkdyn.SetIMat(1e8, 1e8, 20.0, 50e3, 50e3, 3, 3);
blkdyn.SetIMat(1e8, 1e8, 20.0, 50e3, 50e3, 8, 8);
blkdyn.SetIMat(1e8, 1e8, 20.0, 10e3, 10e3, -1, -1);

blkdyn.SetIStiffByElem(1.0);

blkdyn.FixV("x", 0.0, "x", -1e-3, 1e-3);

blkdyn.FixV("x", 0.0, "x", 2.999,3.001);

blkdyn.FixV("y", 0.0, "y", -1e-3, 1e-3);


for(var i = 1; i < 29; i++)
{
dyna.Monitor("block","ydis",0.1 * i, 1.43,0);
}

blkdyn.SetLocalDamp(0.5);

dyna.Solve();

dyna.Save("Elastic.sav");

blkdyn.SetIModel("SSMC");

dyna.Solve();

dyna.Save("Initial.sav");


//定义三个方向基础值
var values = new Array(0.0,0.0, 0);
//定义变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
//将控制范围内的位移清零
blkdyn.InitConditionByCoord("displace", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);



blkdyn.SetLocalDamp(0.005);

for(var i = 0; i < 40; i++)
{
var x1 = 0.5 + 0.05 * i;
var x2 = 0.5 + 0.05 * (i + 1);
blkdyn.SetModelByCoord("none", x1, x2, 0.1, 0.16, -1e5, 1e5);

dyna.Solve(30000);

}
