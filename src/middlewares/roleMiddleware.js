function roleMiddleware(...allowedRoles){
    return (req, res, next) =>{
        const { tipoConta } = req.users;

        if(tipoConta === "admin"){
            return next()
        }

        if(!allowedRoles.includes(tipoConta)){
            return res.status(403).json({error: "Conta não autorizada!"});
        };

        next()
    };
};

module.exports = roleMiddleware