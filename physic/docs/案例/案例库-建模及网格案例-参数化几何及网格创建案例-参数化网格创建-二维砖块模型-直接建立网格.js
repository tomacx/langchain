imeshing.clear();

var xpai = 10;

var ypai = 10;

////砖高度
var YL = 0.25;
///砖长度
var XL = 0.5;


var igroup = 1;

for (var i=0;i<ypai;i++)
{
////创建偶数排
if (i%2==0)
{
   for(var j =0;j<xpai;j++)
   {
       var xc =  j * XL;
       var yc =  i * YL;
       var Group = "Grp_" + igroup;

       imeshing.genBrick2D(Group,XL,YL,1,1,xc,yc);
     
       sleep(50);

       igroup++;
    }
}
else ////创建奇数排
{
   

    ///先创建最左边的半块砖
    var xc =  0;
    var yc =  i * YL;

    var Group = "Grp_" +  igroup;

    imeshing.genBrick2D(Group,XL * 0.5,YL,1,1,xc,yc);
    
     sleep(50);

    igroup++;

///创建中间的几块完整砖
for(var j =0;j< xpai - 1;j++)
   {
       var xc =  j * XL + 0.5 * XL;
       var yc =  i * YL;

       var Group = "Grp_" +  igroup;

       imeshing.genBrick2D(Group,XL,YL,1,1,xc,yc);

       sleep(50);

       igroup++;

    }

   ////创建最右边的半块砖 
    var xc = (xpai - 1) * XL + 0.5 * XL;
    var yc =  i * YL;

    var Group = "Grp_" +  igroup;

    imeshing.genBrick2D(Group,XL * 0.5,YL,1,1,xc,yc);

    sleep(50);

    igroup++;
    

}
       
}