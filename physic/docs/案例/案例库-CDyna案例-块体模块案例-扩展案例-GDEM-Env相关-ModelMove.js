setCurDir(getSrcDir());

blkdyn.GenBrick3D(10,10,10,10,10,10,1);

for(var i = 0; i < 1000; i++)
{

//var x = 0.1 * Math.round( Math.sin(i * 0.01));
//var y = 0.1 * Math.round( Math.cos(i * 0.01));
//view.Pan(x, y);

view.rotate(0.5, 0.3,0.3,0.3);

sleep(50);
}