//前7项
var x = [6.57119, 36.7075, 86.1158, 155.223, 244.058, 352.628, 480.936, 628.961, 796.766];

//外边界初始压力,kpa
var p0 = 100.0;
var E  = 1e6;
var mu = 0.25;


var G  = E / 2.0 / (1.0 + mu);
var K  = E / 3.0 / (1.0 - 2.0 * mu);

//水的压缩模量
var Kw = 1e6;

//孔隙率
var n  = 0.1;

//渗流系数 m2/(Pa*s)
var pemk = 1.0e-8;

//比奥系数
var alpha = 1.0;

var BiotM = Kw / n;

var S = 1.0 / BiotM + 3.0 * alpha * alpha / (3.0 * K + 4.0 * G);


var cc = pemk / S;

var r0 = 0.1; 

//孔隙弹性应力系数
var eda = alpha * (1.0 - 2.0 * mu) / 2.0 / (1.0 - mu); 


var TimeStep = 25e-3;

for(var i = 1; i <= 20; i++)
{
var timeN = i * TimeStep;

var ReleTime = cc * timeN / r0 / r0;

var BaseValue = 0.0;
for(var j = 0; j < 9; j++)
{
var xn_sqrt = Math.sqrt(x[j]);
BaseValue += 8.0 * eda * (xn_sqrt - Math.sin( xn_sqrt )) / ((x[j] - 12.0 * eda + 16.0 * eda * eda) * Math.sin( xn_sqrt ) ) * Math.exp(-x[j] * ReleTime);
}



var P = BaseValue * p0;


print(timeN, P);

}