import { useCallback, useEffect, useState } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import Header from '../components/Header';
import QuestionModal from '../components/QuestionModal';

function QuestionList() {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    try {
      const [s, q] = await Promise.all([
        api.get(`/subjects/${subjectId}`),
        api.get('/questions', { params: { subjectId } }),
      ]);
      setSubject(s.data);
      setQuestions(q.data);
      setError('');
    } catch {
      setError('Không tìm thấy môn học hoặc không thể kết nối server.');
    }
  }, [subjectId]);

  useEffect(() => {
    load();
  }, [load]);

  const syncCount = async () => {
    const q = await api.get('/questions', { params: { subjectId } });
    await api.patch(`/subjects/${subjectId}`, { questionsCount: q.data.length });
  };

  const openAdd = () => {
    setEditing(null);
    setShowModal(true);
  };

  const openEdit = (q) => {
    setEditing(q);
    setShowModal(true);
  };

  const handleSave = async (data) => {
    try {
      if (editing) {
        await api.patch(`/questions/${editing.id}`, data);
      } else {
        await api.post('/questions', { subjectId, ...data });
        await syncCount();
      }
      setShowModal(false);
      await load();
    } catch {
      alert('Lưu câu hỏi thất bại. Vui lòng thử lại.');
    }
  };

  const handleDelete = async (q) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa câu hỏi "${q.content}" không?`)) {
      return;
    }
    try {
      await api.delete(`/questions/${q.id}`);
      await syncCount();
      await load();
    } catch {
      alert('Xóa câu hỏi thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <Container className="mt-4">
      <Header />

      {error ? (
        <>
          <p className="text-danger">{error}</p>
          <Button as={Link} to="/subjects" variant="secondary">
            Quay lại danh sách môn
          </Button>
        </>
      ) : (
        subject && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h3 className="mb-0">
                Bộ câu hỏi môn: {subject.name} ({subject.id})
              </h3>
              <div>
                <Button variant="success" className="me-2" onClick={openAdd}>
                  + Thêm câu hỏi mới
                </Button>
                <Button as={Link} to="/subjects" variant="secondary">
                  Quay lại danh sách môn
                </Button>
              </div>
            </div>
            <p className="text-muted">Tổng số câu hỏi: {questions.length}</p>

            <Table bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Nội dung câu hỏi</th>
                  <th>Các đáp án</th>
                  <th>Đáp án đúng</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, index) => (
                  <tr key={q.id}>
                    <td>{index + 1}</td>
                    <td>{q.content}</td>
                    <td>{q.options.join(', ')}</td>
                    <td>{q.correctAnswer}</td>
                    <td className="text-nowrap">
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => openEdit(q)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(q)}
                      >
                        Xóa
                      </Button>
                    </td>
                  </tr>
                ))}
                {questions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-muted">
                      Chưa có câu hỏi nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </>
        )
      )}

      <QuestionModal
        show={showModal}
        question={editing}
        onHide={() => setShowModal(false)}
        onSave={handleSave}
      />
    </Container>
  );
}

export default QuestionList;