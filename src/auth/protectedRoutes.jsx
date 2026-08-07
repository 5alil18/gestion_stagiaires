
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function ProtectedRoute({children}){
    const navigate = useNavigate();
    const token = localStorage.getItem('token')
    useEffect(() => {
        if(!token){
            return navigate('/auth')
        }
    }, [token, navigate])
    return children
}