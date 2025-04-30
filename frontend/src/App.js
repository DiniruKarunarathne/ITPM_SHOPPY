import logo from './logo.svg';
import './App.css';

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminReview from "./pages/AdminReview";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch all cart items when the app mounts
    dispatch(fetchAllCartItems());
  }, [dispatch]);

  return (
    <Provider store={store}>
      <AuthContextProvider> {/* ✅ Wrap inside AuthContextProvider */}
        <BrowserRouter>
          <Toaster />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
            <Route path="/adminReview" element={<AdminReview />} />
          </Routes>
          <ToastContainer position="bottom-center" autoClose={5000} theme="dark" />
        </BrowserRouter>
      </AuthContextProvider>
    </Provider>
  );
}

export default App;
