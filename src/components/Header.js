import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { clearUser, getUser } from '../auth';

function Header() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearUser();
    navigate('/login');
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <span>
        Hello {user?.email} ({user?.role})
      </span>
      <Button variant="secondary" size="sm" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}

export default Header;
