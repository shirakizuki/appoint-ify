import { useAuth } from "./ServerContext";
import { Outlet } from 'react-router-dom';

const ProtectedRoute = ({ fallbackPath = "/login" }) => {
    const { auth } = useAuth();

    if (auth === null) {
        return <div>Loading...</div>;
    }

    if (!auth?.token) {
        return <Navigate to={fallbackPath} />;
    }

    return <Outlet />;
};

export default ProtectedRoute;