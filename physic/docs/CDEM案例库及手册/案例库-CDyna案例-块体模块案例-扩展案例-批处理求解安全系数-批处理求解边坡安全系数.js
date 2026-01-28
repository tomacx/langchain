/////设置工作路径为当前脚本所在路径
setCurDir(getSrcDir());

////坡高的数组
var SlopeH = [10.0, 15.0, 20.0, 25.0, 30.0];

////坡角的数组
var Sita    = [45.0, 45.0, 45.0, 45.0, 45.0];

/////安全系数值
var Fos     = new Array(5);

/////左侧平台长度比例
var LeftLRatio = 1.0;

/////右侧平台长度比例
var RightLRatio = 2.0;

/////坡体底部厚度比例
var BaseHRatio = 1.5;

////斜坡段附近网格尺寸
var size1 = 1.5;

/////其他部分网格尺寸
var size2 = 4;


for(var i = 0;  i < 5; i++)
{
	////清除mesh模块几何
	igeo.clear();
	////清除mesh模块网格
	imeshing.clear();
	////清除dyna核心计算模块数据
	dyna.Clear();
	////清除平台数据
	doc.clearResult();
	
	///////////////////////////////////创建几何
	var SlopeL = SlopeH[i] / Math.tan(Sita[i] / 180.0 * Math.PI);
	var LeftL  = LeftLRatio * SlopeL;
	var RightL = RightLRatio * SlopeL;
	var BaseH  = BaseHRatio * SlopeH[i];
	var TotalL = LeftL + SlopeL + RightL;
	var TotalH = BaseH + SlopeH[i];
	var aCoord = new Array(6);
	aCoord[0] = [0,0,0, size2];
	aCoord[1] = [TotalL,0,0, size2];
	aCoord[2] = [TotalL,TotalH,0, size2];
	aCoord[3] = [LeftL + SlopeL,TotalH,0, size1];
	aCoord[4] = [LeftL,BaseH,0, size1];
	aCoord[5] = [0,BaseH,0, size2];
	
	////创建多边形边坡
	igeo.genPloygenS(aCoord, 1);
	
	///划分网格
	imeshing.genMeshByGmsh(2);

	///设定不平衡率
                dyna.Set("UnBalance_Ratio 1e-4");
               
                /////此处可添加其他在网格导入前的全局Set命令

	////dyna核心计算模块获取网格
	blkdyn.GetMesh(imeshing);
	
	////设置计算本构
	blkdyn.SetModel("linear");
	
	////设置材料参数
	blkdyn.SetMat(2000, 3e8, 0.33, 3e4, 3e4, 22,10);
	
	////模型底部及两侧位移全约束
	blkdyn.FixV("xyz", 0.0, "x", -0.001, 0.001);
	blkdyn.FixV("xyz", 0.0, "x", TotalL - 1e-3, TotalL + 1e-3);
	blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);
	
     ////弹性求解稳定
	dyna.Solve();
	
	////设置计算本构
	blkdyn.SetModel("MC");
	
	/////保存save文件
	dyna.Save("Init.sav");
	
    Fos[i] = dyna.SolveFos(5000, 8 ,1.0,[aCoord[3][0],aCoord[3][1],aCoord[3][2]],"Init.sav");
}

//////////////////////求解完毕后处理
print("*********************************************");
print("*********************************************");
print("***************安全系数求解完毕**************");
print("********不同坡高下的安全系数为***************");
for(var i = 0; i < 5; i++)
{
	var Str = "坡高 = " + SlopeH[i] + "    安全系数 = " + Fos[i];
	print(Str);
}
