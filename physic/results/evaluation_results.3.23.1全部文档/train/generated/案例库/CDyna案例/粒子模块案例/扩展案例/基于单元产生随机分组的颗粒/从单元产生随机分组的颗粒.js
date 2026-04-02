setCurDir(getSrcDir());

igeo.genRectS(0, 0, 0, 1, 1, 0, 0.01, 1);

imeshing.genMeshByGmsh(2);

blkdyn.GetMesh(imeshing);

blkdyn.RandomizeGroupByBall(0.05, 0.2, 0, 200, 1);

pdyna.CreateFromBlock(2, 1, 111111);

var minX = 0;
var minY = 0;
var minZ = 0;
var maxX = 1;
var maxY = 1;
var maxZ = 0;

pdyna.AdvCreateByCoord("random", 1000, 1, 0.05, [minX, maxX], [minY, maxY], [minZ, maxZ]);

dyna.Set("Output_Interval 500");

dyna.Solve(8000);

var aCoord = new Array(2);
aCoord[0] = [minX, minY, minZ];
aCoord[1] = [maxX, maxY, maxZ];

rdface.Create(1, 1, 2, aCoord);

rdface.ApplyVelocityByGroup([0, 0, -9.8], 1, 1);

dyna.TimeStepCorrect(0.5);

var result = dyna.Solve(8000);
