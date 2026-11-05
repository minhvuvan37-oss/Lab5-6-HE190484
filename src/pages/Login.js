import { useState } from 'react';
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import api from '../api';
import { getUser, setUser } from '../auth';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (getUser()) {
    return <Navigate to="/subjects" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.get('/accounts', {
        params: { email: email.trim(), password },
      });
      const account = res.data[0];

      if (!account) {
        setError('Email hoặc mật khẩu không đúng.');
        return;
      }
      if (String(account.status).toLowerCase() !== 'active') {
        setError('Tài khoản của bạn đang bị khóa (Inactive).');
        return;
      }

      setUser({ id: account.id, email: account.email, role: account.role });
      navigate('/subjects');
    } catch {
      setError('Không thể kết nối đến server. Hãy chạy: npm run server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh' , paddingTop: 48 }}>
      <Container className="d-flex justify-content-center">
        <Card style={{ width: 400, borderColor: '#3984f3' }}>
          <Card.Body>
            <Card.Title className="text-center mb-4 text-primary">Sign In</Card.Title>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3" controlId="email">
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <div className="d-grid">
                <Button type="submit" variant="primary" disabled={loading}>
                  Login
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default Login;