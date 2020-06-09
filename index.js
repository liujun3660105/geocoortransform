const x_PI = 3.14159265358979324 * 3000.0 / 180.0;
const PI = 3.1415926535897932384626;
const a = 6378245.0;
const ee = 0.00669342162296594323;


function transformlat(lng, lat) {
  let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
  return ret
};

function transformlng(lng, lat) {
  let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
  return ret
};


// 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
// 即 百度 转 谷歌、高德
let bd2gcj = function (lng, lat) {
  let x = lng - 0.0065;
  let y = lat - 0.006;
  let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
  let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
  let gg_lng = z * Math.cos(theta);
  let gg_lat = z * Math.sin(theta);
  return [gg_lng, gg_lat]
};


// 百度坐标系 (BD-09)转火星坐标系 (GCJ-02)
let gcj2bd = function (lng, lat) {
  let z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
  let theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
  let bd_lng = z * Math.cos(theta) + 0.0065;
  let bd_lat = z * Math.sin(theta) + 0.006;
  return [bd_lng, bd_lat]
};



//wgs转火星坐标系
let wgs2gcj = function (lng, lat) {
  if (out_of_china(lng, lat)) {
    return [lng, lat]
  } else {
    let dlat = transformlat(lng - 105.0, lat - 35.0);
    let dlng = transformlng(lng - 105.0, lat - 35.0);
    let radlat = lat / 180.0 * PI;
    let magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    let sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
    dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
    let mglat = lat + dlat;
    let mglng = lng + dlng;
    return [mglng, mglat]
  }
};


//GCJ02 转换为 WGS84
let gcj2wgs = function (lng, lat) {
  if (out_of_china(lng, lat)) {
    return [lng, lat]
  } else {
    let g0 = [lng, lat];
    let w0 = g0;
    let g1 = wgs2gcj(w0[0], w0[1]);

    let arr = [[w0[0], g1[0], g0[0]], [w0[1], g1[1], g0[1]]];
    let w1 = arr.map(a => {
      return a[0] - (a[1] - a[2])
    });
    let deltaArr = [
      [w1[0], w0[0]],
      [w1[1], w0[1]]
    ]
    let delta = deltaArr.map((a) => {
      return a[0] - a[1]
    });
    while (Math.abs(delta[0]) >= 1e-6 || Math.abs(delta[1]) >= 1e-6) {
      w0 = w1;
      g1 = wgs2gcj(w0[0], w0[1]);
      arr = [[w0[0], g1[0], g0[0]], [w0[1], g1[1], g0[1]]];
      w1 = arr.map(a => {
        return a[0] - (a[1] - a[2])
      });
      deltaArr = [
        [w1[0], w0[0]],
        [w1[1], w0[1]]
      ]
      delta = deltaArr.map((a) => {
        return a[0] - a[1]
      });
      
    }
    return w1;
  }
};


//bd09转wgs84
let bd2wgs = function(lng, lat){
  let gcj = bd2gcj(lng, lat);
  return gcj2wgs(gcj[0],gcj[1])
}



//wgs84转bd09

let wgs2bd = function(lng, lat){
  let gcj = wgs2gcl(lng, lat);
  return gcj2bd(gcj[0],gcj[1])
}

/**
 * 判断是否在国内，不在国内则不做处理
 * @param {dobule} lng 
 * @param {dobule} lat 
 */
function out_of_china(lng, lat) {
  // 纬度3.86~53.55,经度73.66~135.05
  return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
};
export default { bd2gcj, gcj2bd, wgs2gcj, gcj2wgs, bd2wgs, wgs2bd };
