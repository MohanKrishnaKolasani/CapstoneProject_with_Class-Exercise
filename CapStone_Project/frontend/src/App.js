import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login           from "./pages/auth/Login";
import Register        from "./pages/auth/Register";
import SongsPage       from "./pages/user/SongsPage";
import PlaylistsPage   from "./pages/user/PlaylistsPage";
import PlaylistDetails from "./pages/user/PlaylistDetails";
import ManageSongs     from "./pages/admin/ManageSongs";
import AdminDashboard  from "./pages/admin/AdminDashboard";
import ManageArtists   from "./pages/admin/ManageArtists";
import ManageDirectors from "./pages/admin/ManageDirectors";
import ManageAlbums    from "./pages/admin/ManageAlbums";
import ManageUsers     from "./pages/admin/ManageUsers";
import ProfilePage     from "./pages/user/ProfilePage";
import LibraryPage     from "./pages/user/LibraryPage";

import MainLayout   from "./layout/MainLayout";
import PrivateRoute from "./routes/PrivateRoute";
import { useAuth }  from "./hooks/useAuth";

function AppRoutes() {
  const { isAuthenticated, isAdmin } = useAuth();

  const rootRedirect = !isAuthenticated ? "/login" : isAdmin ? "/admin" : "/songs";

  return (
    <Routes>
      <Route path="/" element={<Navigate to={rootRedirect} replace />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/songs"
        element={<PrivateRoute>{isAdmin ? <Navigate to="/admin" replace /> : <MainLayout><SongsPage /></MainLayout>}</PrivateRoute>}
      />
      <Route path="/playlists"
        element={<PrivateRoute>{isAdmin ? <Navigate to="/admin" replace /> : <MainLayout><PlaylistsPage /></MainLayout>}</PrivateRoute>}
      />
      <Route path="/playlists/:id"
        element={<PrivateRoute>{isAdmin ? <Navigate to="/admin" replace /> : <MainLayout><PlaylistDetails /></MainLayout>}</PrivateRoute>}
      />
      <Route path="/profile"
        element={<PrivateRoute><MainLayout><ProfilePage /></MainLayout></PrivateRoute>}
      />
      <Route path="/library"
        element={<PrivateRoute>{isAdmin ? <Navigate to="/admin" replace /> : <MainLayout><LibraryPage /></MainLayout>}</PrivateRoute>}
      />

      <Route path="/admin"
        element={<PrivateRoute>{isAdmin ? <MainLayout><AdminDashboard /></MainLayout> : <Navigate to="/songs" replace />}</PrivateRoute>}
      />
      <Route path="/admin/songs"
        element={<PrivateRoute>{isAdmin ? <MainLayout><ManageSongs /></MainLayout> : <Navigate to="/songs" replace />}</PrivateRoute>}
      />
      <Route path="/admin/artists"
        element={<PrivateRoute>{isAdmin ? <MainLayout><ManageArtists /></MainLayout> : <Navigate to="/songs" replace />}</PrivateRoute>}
      />
      <Route path="/admin/directors"
        element={<PrivateRoute>{isAdmin ? <MainLayout><ManageDirectors /></MainLayout> : <Navigate to="/songs" replace />}</PrivateRoute>}
      />
      <Route path="/admin/albums"
        element={<PrivateRoute>{isAdmin ? <MainLayout><ManageAlbums /></MainLayout> : <Navigate to="/songs" replace />}</PrivateRoute>}
      />
      <Route path="/admin/users"
        element={<PrivateRoute>{isAdmin ? <MainLayout><ManageUsers /></MainLayout> : <Navigate to="/songs" replace />}</PrivateRoute>}
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;