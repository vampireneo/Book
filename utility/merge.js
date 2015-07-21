module.exports = function merge (target, src) {
    var array = Array.isArray(src) || Array.isArray(target);
    var dst = array && [] || {};

    if (array) {
        target = target || [];
        dst = dst.concat(target);
        if (src.forEach) {
          src.forEach(function(e, i) {
              if (typeof target[i] === 'undefined') {
                  if (target.indexOf(e) === -1) {
                      dst.push(e);
                  }
              } else if (typeof e === 'object' && !(e instanceof Date)) {
                  dst[i] = merge(target[i], e);
              } else {
                  if ((!(e instanceof Date) && target.indexOf(e) === -1) || ((e instanceof Date) && target.map(Number).indexOf(+e) === -1)) {
                      dst.push(e);
                  }
              }
          });
        } else {
          dst.push(src);
        }
    } else {
        if (target && typeof target === 'object' && !Array.isArray(target)) {
            Object.keys(target).forEach(function (key) {
                dst[key] = target[key];
            });
        }
        Object.keys(src).forEach(function (key) {
            if (typeof src[key] !== 'object' || !src[key]) {
                if (!dst[key] || dst[key] === src[key]) {
                  dst[key] = src[key];
                } else {
                  if (Array.isArray(dst[key])) {
                    if (dst[key].indexOf(src[key]) === -1) {
                      dst[key].push(src[key]);
                    }
                  } else {
                    dst[key] = [dst[key], src[key]];
                  }
                }
            }
            else {
              dst[key] = !target[key] ? src[key] : merge(target[key], src[key]);
            }
        });
        if (src && src instanceof Date && target && target instanceof Date)
        {
          dst = target.getTime() === src.getTime() ? target : [target, src];
        }
    }

    return dst;
};
