module.exports = function merge (target, src) {
    var array = Array.isArray(src);
    var dst = array && [] || {};

    if (array) {
        target = target || [];
        dst = dst.concat(target);
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
        if (target && typeof target === 'object') {
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
                    if (Array.isArray(src[key])) {
                      dst[key] = src[key].reduce( function(coll,item){
                        coll.push( item );
                        return coll;
                      }, dst[key] );
                    } else {
                      dst[key].push(src[key]);
                    }
                  }
                  else {
                    dst[key] = [dst[key], src[key]];
                  }
                }
            }
            else {
                if (!target[key]) {
                    dst[key] = src[key];
                } else {
                    dst[key] = merge(target[key], src[key]);
                }
            }
        });
        if (src && src instanceof Date && target && target instanceof Date)
        {
          if (target === src)
            dst = target;
          else
            dst = [target, src];
        }
    }

    return dst;
};
