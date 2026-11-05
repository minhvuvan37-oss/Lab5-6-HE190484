import { useEffect, useMemo, useState } from 'react';
import { Button, Container, Form, Modal, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Header from '../components/Header';

function SubjectList() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/subjects'), api.get('/questions')])
      .then(([s, q]) => {
        setSubjects(s.data);
        setQuestions(q.data);
      })
      .catch(() => setError('Không thể tải dữ liệu từ server.'));
  }, []);

  // Số lượng câu hỏi tính trực tiếp từ bảng questions để luôn đúng
  const countOf = (subjectId) =>
    questions.filter((q) => q.subjectId === subjectId).length;

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    return subjects.filter(
      (s) => s.id.toLowerCase().includes(k) || s.name.toLowerCase().includes(k)
    );
  }, [subjects, keyword]);

  return (
    <Container className="mt-4">
      <Header />
      <h3 className="mb-3">Danh sách môn học</h3>
      {error && <p className="text-danger">{error}</p>}

      <Form.Control
        className="mb-3"
        style={{ maxWidth: 320 }}
        type="text"
        placeholder="Tìm kiếm môn học..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Mã môn</th>
            <th>Tên môn học</th>
            <th className="text-center">Số lượng câu hỏi</th>
            <th>Tools</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((s) => (
            <tr key={s.id}>
              <td className="fw-bold">{s.id}</td>
              <td>{s.name}</td>
              <td className="text-center">{countOf(s.id)}</td>
              <td>
                <Button
                  variant="dark"
                  size="sm"
                  className="me-2"
                  onClick={() => navigate(`/question/${s.id}`)}
                >
                  Truy cập bộ câu hỏi
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelected(s)}
                >
                  Thông tin
                </Button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center text-muted">
                Không tìm thấy môn học nào.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={!!selected} onHide={() => setSelected(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thông tin môn học</Modal.Title>
        </Modal.Header>
        {selected && (
          <Modal.Body>
            <p>
              <strong>Mã môn:</strong> {selected.id}
            </p>
            <p>
              <strong>Tên môn học:</strong> {selected.name}
            </p>
            <p className="mb-0">
              <strong>Số lượng câu hỏi:</strong> {countOf(selected.id)}
            </p>
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelected(null)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default SubjectList;
