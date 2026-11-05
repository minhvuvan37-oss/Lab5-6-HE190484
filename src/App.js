import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import SubjectList from './pages/SubjectList';
import QuestionList from './pages/QuestionList';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/subjects" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/subjects"
        element={
          <ProtectedRoute>
            <SubjectList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/question/:subjectId"
        element={
          <ProtectedRoute>
            <QuestionList />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/subjects" replace />} />
    </Routes>
  );
}

export default App;
