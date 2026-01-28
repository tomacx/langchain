
//设置当前工作路径为 JS 脚本所在路径
setCurDir(getSrcDir());


//清除Mesh模块网格数据
imeshing.clear();

//不执行合并功能
imeshing.setValue("IfMerge",0);


//循环中自动短时反复推送，会导致显示出问题，关闭自动推送开关，改用手动向平台推送网格
imeshing.setValue("IfCommitMeshAuto", 0);


////砖块尺寸
var lx = 0.24;
var ly = 0.053;
var lz = 0.115;

////砖块数量
var nx = 10;
var ny = 20;

//建模，中间位置
for(var i=0;i<nx;i++)
{
	for(var j=1;j<=ny;j++)
		{
			var x1=lx*i;
			var x2=lx/2+lx*i;
			var y1=ly*(2*j-2);
			var y2=ly*(2*j-1);
       			imeshing.genBrick3D ("1",lx,ly,lz,1, 1, 1 ,x1,y1,0);
        		imeshing.genBrick3D ("2",lx,ly,lz,1, 1, 1 ,x2,y2,0);
		}
}


//建模，两侧位置
for(var j=1;j<=ny;j++)
{	var y1=ly*(2*j-2);
	imeshing.genBrick3D ("3",lx/2,ly,lz,1, 1, 1 ,0,ly+y1,0);
	imeshing.genBrick3D ("4",lx/2,ly,lz,1, 1, 1 ,lx*nx,y1,0);


}

//循环中自动短时反复推送，会导致显示出问题，改用手动向平台推送网格
imeshing.commitMesh();

