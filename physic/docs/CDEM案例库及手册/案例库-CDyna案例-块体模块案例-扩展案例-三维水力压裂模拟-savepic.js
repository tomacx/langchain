for(var i = 0; i < 360; i++)
{
view.rotate(1,0,0,1);

var oss = "0";

if(i < 10)
{
oss = "000";
}
else if(i < 100)
{
oss = "00";
}
view. saveJpeg(oss + i + ".jpg");
sleep(40);
}