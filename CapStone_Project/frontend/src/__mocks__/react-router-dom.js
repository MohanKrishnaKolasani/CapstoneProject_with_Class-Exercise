const React = require("react");

const NavigationContext = React.createContext({});
const LocationContext   = React.createContext({ pathname: "/" });

const MemoryRouter = ({ children, initialEntries = ["/"] }) => {
  const [location, setLocation] = React.useState({
    pathname: initialEntries[0] || "/",
    search:   "",
    hash:     "",
    state:    null,
  });
  const navigate = (to) => {
    const pathname = typeof to === "string" ? to : to.pathname || "/";
    setLocation((prev) => ({ ...prev, pathname }));
  };
  return React.createElement(
    NavigationContext.Provider,
    { value: { navigate, location } },
    React.createElement(
      LocationContext.Provider,
      { value: location },
      children
    )
  );
};

const Routes = ({ children }) => {
  const location = React.useContext(LocationContext);
  let match = null;
  React.Children.forEach(children, (child) => {
    if (match) return;
    if (!React.isValidElement(child)) return;
    const { path } = child.props;
    if (!path || location.pathname === path || location.pathname.startsWith(path + "/")) {
      match = child;
    }
  });
  return match ? React.cloneElement(match, {}) : null;
};

const Route = ({ element }) => element;

const Navigate = ({ to }) => {
  const { navigate } = React.useContext(NavigationContext);
  React.useEffect(() => { if (navigate) navigate(to); }, []);
  return null;
};

const Link = ({ to, children, ...rest }) =>
  React.createElement("a", { href: to, ...rest }, children);

const useNavigate = () => {
  const ctx = React.useContext(NavigationContext);
  return ctx.navigate || jest.fn();
};

const useLocation = () => React.useContext(LocationContext);

const useParams = () => ({});

module.exports = {
  MemoryRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  useLocation,
  useParams,
  BrowserRouter: MemoryRouter,
};