//转义平台
//计算原价
const dealCoupons = function(coupons){
  if(!coupons){
    return false;
  }
  for (let i = 0; i < coupons.length; i++) {
    if (coupons[i].platform == "taoke") {
      coupons[i].platform = "淘宝"
    } else if (coupons[i].platform == "jingtuitui") {
      coupons[i].platform = "京东"
    }
    coupons[i].originalPrice = (parseFloat(coupons[i].couponInfo) + parseFloat(coupons[i].zkFinalPrice)).toFixed(2);
  }
}



module.exports = {
  deal: dealCoupons
}
