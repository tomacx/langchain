//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 0");

//设置三个方向的重力加速度，均为0
dyna.Set("Gravity 0 0.0 0.0");

//包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage 1");

//开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal 1");

dyna.Set("Seepage_Mode 2");

//孔隙气体渗流时，打开吸附解吸附渗流开关
dyna.Set("If_Langmuir_Cal 1");

//将结果输出时步设定为500步
dyna.Set("Output_Interval 5000");

//监测结果输出时步间隔设定为100步
dyna.Set("Moniter_Iter 100");

//生成四边形网格
blkdyn.GenBrick2D(100,50, 40, 20, 1);

//定义X、Y、Z三个方向的渗透系数
var arrayK1 = new Array(1e-10, 1e-10, 1e-10);

//指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
//气体渗流时，仅密度、孔隙率、渗透系数起作用
poresp.SetPropByGroup (0.176, 1e9, 1.0, 0.01, arrayK1, 1.0, 1);

////////////////////////////设置指定单元的渗透系数//////////////////////////////////
/////////////////////////////////读取文件内容///////////////////////////////////////
//创建FileSystemObject对象
var fso = new ActiveXObject("Scripting.FileSystemObject");

//1-只读方式 2-读写方式 8-追加方式
var FracInfo = fso.OpenTextFile("FracInfo.txt", 1);

//读取首行获取破裂单元总数
var TotalFracElem = FracInfo.ReadLine();


var aValue = new Array(TotalFracElem);
for (var i = 0; i < TotalFracElem; i++)
{
	var sValue = FracInfo.ReadLine();
	
	//将字符串转为数组
	aValue[i] = new Array();
	aValue[i] = sValue.split("	");
}
//关闭文件
FracInfo.Close();
//print(aValue[0][8]);
/////////////////////////////创建数组，存储单元ID、体心坐标及 开度（多个）////////////////////////////
var ElemAndCrack = new Array();
//print(ElemAndCrack.length);
ElemAndCrack.push([aValue[0][7], [aValue[0][1],aValue[0][2],aValue[0][3]],aValue[0][0]]);//第一个单元号，中间三个为坐标值，最后一个开度
ElemAndCrack.push([aValue[0][8], [aValue[0][4],aValue[0][5],aValue[0][6]],aValue[0][0]]);

for (var i = 1; i < TotalFracElem; i++)
{
	var iFlag1 = 0;
	var iFlag2 = 0;
	
	for (var j = 0; j < ElemAndCrack.length; j++)
	{
		if (aValue[i][7] == ElemAndCrack[j][0])
		{
			iFlag1 = j;
		}
		if (aValue[i][8] == ElemAndCrack[j][0])
		{
			iFlag2 = j;
		}
	}
	if (iFlag1 == j)
	{
		ElemAndCrack[j].push(aValue[i][0]);
	}
	else
	{
		ElemAndCrack.push([aValue[i][7], [aValue[i][1],aValue[i][2],aValue[i][3]], aValue[i][0]]);
	}
	if (iFlag2 == j)
	{
		ElemAndCrack[j].push(aValue[i][0]);
	}
	else
	{
		ElemAndCrack.push([aValue[i][8], [aValue[i][4],aValue[i][5],aValue[i][6]], aValue[i][0]]);
	}
}
//print(ElemAndCrack[0][1]);

///////////////////////将裂隙开度转换为等效渗透系数////////////////////////////////
msg("正在将裂隙开度转为等效渗透系数，请稍等……");

//初始裂隙开度
var initD = 1e-5;
//最大裂隙开度
var maxD = 5e-5;
//ElemAndCrack.length
for (var i = 0; i < ElemAndCrack.length; i++)
{
	//单元体心坐标
	var afCoord = new Array(3);
	afCoord[0] = ElemAndCrack[i][1][0];
	afCoord[1] = ElemAndCrack[i][1][1];
	afCoord[2] = ElemAndCrack[i][1][2];
	
	//该单元相邻裂隙开度数量
	var nCracks = ElemAndCrack[i].length - 2;
	
	//等效裂隙开度
	var equiD = 0;
	for (var ii = 2; ii < ElemAndCrack[i].length; ii++)
	{
		equiD += ElemAndCrack[i][ii];
	}
	equiD = equiD / nCracks;
	

	//等效渗透系数
	var equiK = 0;
	equiK = 1e-10 + ((1e-8) - (1e-10)) * (equiD - initD) / (maxD - initD);
	
	var TolElem = dyna.GetValue("Total_Block_Num");
	TolElem = Math.round(TolElem);
	for (var ielem = 1; ielem <= TolElem; ielem++)
	{
		var TolVertex = blkdyn.GetElemValue(ielem, "TotalVertex", 1);
		TolVertex = Math.round(TolVertex);
		var afCoord1 = new Array();

		for (var ii = 0; ii < TolVertex; ii++)
		{
			afCoord1[ii] = new Array(3);
			var iNodeID = blkdyn.GetElemValue(ielem, "NodeID", ii + 1);
			iNodeID = Math.round(iNodeID);
			afCoord1[ii][0] = blkdyn.GetNodeValue(iNodeID, "Coord", 1);
			afCoord1[ii][1] = blkdyn.GetNodeValue(iNodeID, "Coord", 2);
			afCoord1[ii][2] = blkdyn.GetNodeValue(iNodeID, "Coord", 3);
		}
		
		if (IsPointInPolygon(afCoord1, afCoord))
		{
			//设置单元的渗透系数
			blkdyn.SetElemValue(ielem, "KCoeff", equiK, 1);
			blkdyn.SetElemValue(ielem, "KCoeff", equiK, 2);
			blkdyn.SetElemValue(ielem, "KCoeff", equiK, 3);
			
			break;
		}
	}
}

///////////////////////////////////////////////////////////////////////////////////

//设置Langmuir吸附解吸附参数，依次为最大吸附量、吸附常数、固体密度、瓦斯滑脱效应克林博格系数
poresp.SetLangmuirPropByGroup(37.255e-3, 0.432e-6, 2530, 0.0, 1, 1);

//定义梯度
var fArrayGrad = new Array(0.0, 0.0, 0.0);

//初始化孔隙气体压力，为10MPa
poresp.InitConditionByCoord("pp", 10e6, fArrayGrad, 30, 70, 5, 45, -100, 100, false);

//获取准确的流量点源位置
var NodeID1 = blkdyn.GetNodeID(50, 25, 0);

var Coord1 = new Array();

Coord1[0] = blkdyn.GetNodeValue(NodeID1, "Coord", 1);
Coord1[1] = blkdyn.GetNodeValue(NodeID1, "Coord", 2);
Coord1[2] = blkdyn.GetNodeValue(NodeID1, "Coord", 3);

//施加点汇条件，即瓦斯抽采点
poresp.ApplyConditionByCoord("source", -50, [0,0,0], Coord1[0] - 0.01, Coord1[0] + 0.01, Coord1[1] - 0.01, Coord1[1] + 0.01, Coord1[2] - 0.01, Coord1[2] + 0.01, false);

//对典型位置的孔隙压力进行监测
for(var i = 2; i < 50;)
{
	dyna.Monitor("block", "fpp", 50, i, 0);	
	i = i + 2;
}

//设定计算时步为100s
dyna.Set("Time_Step 1e-2");

dyna.Set("Time_Now 0");

//迭代2万步
dyna.Solve(1000000);
dyna.Save("Final.sav");
//dyna.Restore("Final.sav");


//打印提示信息
print("Solution Finished");

/////////////////////////////////////自定义函数///////////////////////////////////////////////
////////////
//计算两个点之间的距离
function Distance(Coord1, Coord2)
{
	var dx = Coord2[0] - Coord1[0];
	var dy = Coord2[1] - Coord1[1];
	var dz = Coord2[2] - Coord1[2];
	return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

//两个向量叉积
function CrossProduct(Coord1, Coord2)
{
	var crossproduct = new Array(3);
	crossproduct[0] = Coord1[1] * Coord2[2] - Coord2[1] * Coord1[2];
	crossproduct[1] = Coord1[2] * Coord2[0] - Coord2[2] * Coord1[0];
	crossproduct[2] = Coord1[0] * Coord2[1] - Coord2[0] * Coord1[1];

	return crossproduct;
}

//两向量的点积
function DotProduct(Coord1, Coord2)
{
	var dotproduct = Coord1[0] * Coord2[0] + Coord1[1] * Coord2[1] + Coord1[2] * Coord2[2];

	return dotproduct;
}

//判断点是否在线段上 
function IsPointInLineSegment(point0, point1, point2)
{
	var p1p0 = new Array(3);
	var p2p0 = new Array(3);
	var p1p2 = new Array(3);
	for ( var i = 0; i < 3; i++ )
	{
		p1p0[i] = point0[i] - point1[i];
		p2p0[i] = point0[i] - point2[i];
		p1p2[i] = point2[i] - point1[i];
	}
		
	var cross_product = CrossProduct(p1p0, p1p2);
	var Mod_cross_product = Math.sqrt(cross_product[0] * cross_product[0] + cross_product[1] * cross_product[1] + cross_product[2] * cross_product[2]);
	var dot_product = DotProduct(p1p0, p2p0);

	if (dot_product < 1e-12 && Mod_cross_product <= 1e-12)
	{
		return true;
	}
	else
	{
		return false;
	}
}

//判断线段是否平行
function IsHorizontal(vert1_y, vert2_y)
{
	return(Math.abs(vert1_y - vert2_y) <= 1.0e-12);
}

//判断线段是否相交
function IfLineCross(A, B, C, D)
{
	var AD = new Array(3);
	var AB = new Array(3);
	var AC = new Array(3);
	for ( var i = 0; i < 3; i++ )
	{
		AD[i] = D[i] - A[i];
		AB[i] = B[i] - A[i];
		AC[i] = C[i] - A[i];
	}
	var AD_AB = CrossProduct(AD, AB);
	var AC_AB = CrossProduct(AC, AB);
	
	var CA = new Array(3);
	var CD = new Array(3);
	var CB = new Array(3);
	for ( var i = 0; i < 3; i++ )
	{
		CA[i] = A[i] - C[i];
		CD[i] = D[i] - C[i];
		CB[i] = B[i] - C[i];
	}
	var CA_CD = CrossProduct(CA, CD);
	var CB_CD = CrossProduct(CB, CD);
	
	//CD跨立于AB两旁
	var CD_AB = DotProduct(AD_AB, AC_AB);
	//AB跨立于CD两旁
	var AB_CD = DotProduct(CA_CD, CB_CD);
	
	return ((CD_AB <= 1e-12) && (AB_CD <= 1e-12));
}

/////////////////判断点是否在多边形内///////////////////////////////   
function IsPointInPolygon(GeometryInfo, CrackCoordi)
{
	var e = Math.abs(GeometryInfo[1][0] - GeometryInfo[0][0]);
	
	//获取几何模型中x的最小值
	var Xmin = GeometryInfo[0][0];
	for (var i = 1; i < GeometryInfo.length; i++)
	{
		if (Xmin > GeometryInfo[i][0])
		{
			Xmin = GeometryInfo[i][0];
		}
	}
	
	var JudgeCoord = new Array(3);
	JudgeCoord[0] = Xmin - e;
	JudgeCoord[1] = CrackCoordi[1];
	JudgeCoord[2] = CrackCoordi[2];
	
	var count = 0;
	for ( var i = 0; i < GeometryInfo.length; i++ )
	{
		var j = (i + 1) % GeometryInfo.length;
		
		if (IsPointInLineSegment(CrackCoordi, GeometryInfo[i], GeometryInfo[j]))
		{
			return true;
		}
		if (!IsHorizontal(GeometryInfo[i][1], CrackCoordi[1]))
		{
			if (IfLineCross(CrackCoordi, JudgeCoord, GeometryInfo[i], GeometryInfo[j]))
			{
				if((Math.abs(CrackCoordi[1] - GeometryInfo[j][1]) > 1.0e-12)&&(Math.abs(CrackCoordi[1] - GeometryInfo[i][1]) > 1.0e-12))
				{
					count++;
				}
				else if ((Math.abs(CrackCoordi[1] - GeometryInfo[j][1]) <= 1.0e-12) && (GeometryInfo[j][1]>GeometryInfo[i][1]))
				{
					count++;
				}
				else if ((Math.abs(CrackCoordi[1] - GeometryInfo[j][1]) <= 1.0e-12) && (GeometryInfo[i][1]>GeometryInfo[j][1]))
				{
					count++;
				}
			}
		}
	}
	
	return (count % 2);
}

