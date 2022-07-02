var sanitizeObj = function(key, obj, ignore, req){
    if(obj != null && (key != null && ignore.indexOf(key) == -1) && typeof obj === 'object'){
        for(var i=0;i<Object.keys(obj).length;i++){
            obj[Object.keys(obj)[i]] = sanitizeObj(Object.keys(obj)[i], obj[Object.keys(obj)[i]], ignore, req);
        }
    }else if(obj != null && (key != null && ignore.indexOf(key) == -1) && typeof obj === 'array'){
        for(var i=0;i<obj.length;i++){
            obj[i] = sanitizeObj(null, obj[i], ignore, req);
        }
    }else if(obj != null && (key != null && ignore.indexOf(key) == -1) && typeof obj == 'string' && obj != ''){
        obj = req.sanitize(obj).trim();
        try { obj = obj.replace(/&amp;/g, '&') } catch(err){ console.log(err) }
    }
    return obj;
}

export var sanitize = function(ignore=[]){
    return (req, res, next) => {
        if(req.body){
            req.body = sanitizeObj('a', req.body, ignore, req);
        }
        if(req.params){
            req.params = sanitizeObj('a', req.params, ignore, req);
        }
        if(req.query){
            req.query = sanitizeObj('a', req.query, ignore, req);
        } 
        next();
    }
}; 