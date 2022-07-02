import { db } from "../models";

export var staffPermission = (name, type) => {
    return (req, res, next) => {
        if(req.user.userType == 'staff'){
            db.Action.findOne({
                where: {
                    name
                }
            })
            .then(action => {
                if(action){
                    let condition = {
                        actionId: action.id,
                        vendorId: req.user.id,
                    }

                    if(type == 'READ') condition['read'] = true;
                    else if(type == 'WRITE') condition['write'] = true;
                    else if(type == 'DELETE') condition['delete'] = true;

                    db.Vendor_action.findOne({
                        where: condition
                    })
                    .then(vendorAction => {
                        if(vendorAction){
                            next()
                        } else {
                            next(new RequestError(`you don't have permission to access this modules`))
                        }
                    })
                } else {
                    next(new RequestError(`you don't have permission to access this modules`))
                }
            })
        } else {
            next();
        }
    }
}