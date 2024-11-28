import jwt from "jsonwebtoken"

export const createToken = (user) =>{
    const { id, email, role} = user;
    const token = jwt.sign( { id, email, role}, "Clave" , { expiresIn: "5m" });
    return token;
}

export const verifyToken = (token) => {
    try {
        
        const decode = jwt.verify(token, "Clave");
        return decode;

    } catch(error){
        return null;
        
    }
}