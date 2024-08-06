import { useLocation } from 'react-router-dom';

const useActiveRoute = (basePath, routes) => {
  const location = useLocation();

  const isBasePath = location.pathname.startsWith(basePath);
  const isAnyRouteActive = routes.some(route => location.pathname.startsWith(`${basePath}/${route}`));

  return { isBasePath, isAnyRouteActive };
};

export default useActiveRoute;
